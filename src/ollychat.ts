import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { z } from "zod";
import { PromptTemplate } from "@langchain/core/prompts";
import { Annotation } from "@langchain/langgraph";
import { createQueryExecutor, createMetricsFetcher } from './prometheus.js';
import { DynamicStructuredTool } from "@langchain/core/tools";
import { StateGraph } from "@langchain/langgraph";
import { Chroma } from "@langchain/community/vectorstores/chroma";

import fs from 'fs';

import * as dotenv from 'dotenv';

dotenv.config();

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-ada-002",
});

const vectorStore = new Chroma(embeddings, {
  collectionName: process.env.CHROMA_INDEX || 'prometheus_examples-2',
  url: process.env.CHROMA_URL || "http://localhost:8000", // Optional, will default to this value
});

const exampleSelector = vectorStore.asRetriever({
  k: 5
});

const MetricsVectorStore = new Chroma(embeddings, {
  collectionName: process.env.CHROMA_METRICS_INDEX || 'prometheus_metrics',
  url: process.env.CHROMA_URL || "http://localhost:8000", // Optional, will default to this value
});

const metricsExampleSelector = MetricsVectorStore.asRetriever({
  k: 5
});


const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  model: "gpt-3.5-turbo",
  temperature: 0
});

const queryOutput = z.object({
  explanation: z.string().describe("Description of what the PromQL query does."),
  query: z.string().describe("Syntactically valid PromQL query."),
});

const structuredModel = model.withStructuredOutput(queryOutput);

const prometheusUrl = process.env.PROMETHEUS_URL || 'http://localhost:9090'

const queryPrometheus = createQueryExecutor(prometheusUrl);

const queryPromptTemplate = PromptTemplate.fromTemplate(`
Given an input question, first create a syntactically correct PromQL query to run, 
then look at the results of the query and return the answer.

Use the following format:

Question: "Question here"
PromQLQuery: "PromQL Query to run"
PromQLResult: "Result of the PromQLQuery"
Answer: "Final answer here"

Below are a number of relevent Prometheus metrics and their help text.
{metrics}

Below are a number of relevent examples of questions and their corresponding PromQL queries.
{examples}

User Question: {question}
PromQLQuery: 
`);

const prometheusQueryTool = new DynamicStructuredTool({
  name: "prometheus_query",
  description: "Query Prometheus and return the result",
  schema: z.object({
    query: z.string().describe("A PromQL query"),
  }),
  func: async ({ query }: { query: string }) => {
    return await queryPrometheus(query);
  },
});

const StateAnnotation = Annotation.Root({
  question: Annotation<string>,
  examples: Annotation<string>,
  metrics: Annotation<string>,
  query_explanation: Annotation<string>,
  query: Annotation<string>,
  result: Annotation<string>,
  answer: Annotation<string>,
  unit: Annotation<string>,
  unit_description: Annotation<string>
});

const getExamples = async (state: typeof StateAnnotation.State) => {
  const examples = await exampleSelector.invoke(state.question);

  const examplePrompt = PromptTemplate.fromTemplate(`
Example Question: {question}
Example PromQL Query: {query}`
  );

  const formattedExamples = await Promise.all(
    examples.map(example =>
      examplePrompt.format({
        question: example.metadata.question,
        query: example.metadata.query
      })
    )
  );

  const combinedExamples = formattedExamples.join('\n\n');

  return { examples: combinedExamples };
};

const getMetricExamples = async (state: typeof StateAnnotation.State) => {
  const metricExamples = await metricsExampleSelector.invoke(state.question);

  const metricExamplePrompt = PromptTemplate.fromTemplate(`
Example Metric: {name}
Example Metric Description: {help}`
  );

  const formattedMetricExamples = await Promise.all(
    metricExamples.map(example =>
      metricExamplePrompt.format({
        name: example.metadata.name,
        help: example.metadata.help
      })
    )
  );

  const combinedMetricExamples = formattedMetricExamples.join('\n\n');

  return { metrics: combinedMetricExamples };
};

const writeQueryTemplate = async (state: typeof StateAnnotation.State) => {
  const promptValue = await queryPromptTemplate.invoke({
    question: state.question,
    examples: state.examples,
    metrics: state.metrics,
  });
  console.log(promptValue);
  const result = await structuredModel.invoke(promptValue);
  return { query: result.query, query_explanation: result.explanation };
};

const executeQuery = async (state: typeof StateAnnotation.State) => {
  return { result: await prometheusQueryTool.invoke({ query: state.query }) };
};

const generateAnswer = async (state: typeof StateAnnotation.State) => {
  const promptValue =
    `You are a helpful site reliability engineer analyzing Prometheus Queries. 
    
    We ran the following PromQL query:
    ${state.query}
    
    This was the explanation of the PromQL query:
    ${state.query_explanation}

    The query returned the following data:
     ${state.result}

    Using the above give a brief answer to the user's question being as specific as possible:
    ${state.question}

    Do not ask for more information.
    If you respond with any numbers please give the correct units units.
    `;
  console.log(promptValue);
  const response = await model.invoke(promptValue);
  return { answer: response.content };
};

const InputStateAnnotation = Annotation.Root({
  question: Annotation<string>,
});

const graphBuilder = new StateGraph({
  stateSchema: StateAnnotation,
})
  .addNode("getExamples", getExamples)
  .addNode("getMetricExamples", getMetricExamples)
  .addNode("writeQueryTemplate", writeQueryTemplate)
  .addNode("executeQuery", executeQuery)
  .addNode("generateAnswer", generateAnswer)
  .addEdge("__start__", "getExamples")
  .addEdge("getExamples", "getMetricExamples")
  .addEdge("getMetricExamples", "writeQueryTemplate")
  .addEdge("writeQueryTemplate", "executeQuery")
  .addEdge("executeQuery", "generateAnswer")
  .addEdge("generateAnswer", "__end__");

const graph = graphBuilder.compile();

const answerQuestion = async (inputs: { question: string }) => {
  return await graph.invoke(inputs);
}
export {
  answerQuestion
};