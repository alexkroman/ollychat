import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { z } from "zod";
import { PromptTemplate } from "@langchain/core/prompts";
import { Annotation } from "@langchain/langgraph";
import { createQueryExecutor, createMetricsFetcher } from './prometheus.js';
import { DynamicStructuredTool } from "@langchain/core/tools";
import { StateGraph } from "@langchain/langgraph";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { ScoreThresholdRetriever } from "langchain/retrievers/score_threshold";

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

const MetricsVectorStore = new Chroma(embeddings, {
  collectionName: process.env.CHROMA_METRICS_INDEX || 'prometheus_metrics',
  url: process.env.CHROMA_URL || "http://localhost:8000", // Optional, will default to this value
});

const metricsExampleSelector = MetricsVectorStore.asRetriever({
  k: 5
});

const getAllMetricsSelector = MetricsVectorStore.asRetriever({
  k: 2000
});

const allMetrics = await getAllMetricsSelector.invoke('');
const allMetricNames = allMetrics.map(metric => (metric.metadata.name));

const exampleSelector = ScoreThresholdRetriever.fromVectorStore(vectorStore, {
  minSimilarityScore: 0.2, // Finds results with at least this similarity score
  maxK: 3, // The maximum K value to use. Use it based to your chunk size to make sure you don't run out of tokens
  kIncrement: 2, // How much to increase K by each time. It'll fetch N results, then N + kIncrement, then N + kIncrement * 2, etc.
  filter: {'metrics': {'$in': allMetricNames}}
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
You are a PromQL expert.
Please help to generate a PromQL query to answer the question.
Your response should ONLY be based on the given context and follow the response guidelines and format instructions.

Given an input question, first create a syntactically correct PromQL query to run, 
then look at the results of the query and return the answer.

Use the following format:

Question: "Question here"
PromQLQuery: "PromQL Query to run"
PromQLResult: "Result of the PromQLQuery"
Answer: "Final answer here"

Below are a number of relevent user questions and their PromQL queries.
{examples}

Response Guidelines
1. If the provided context is sufficient, please generate a valid PromQL query without any explanations for the question.
2. If the provided context is insufficient, please explain why it can't be generated.
3. Please use the most relevant user questions and PromQL queries.
4. If the question has been asked and answered before, please repeat the answer exactly as it was given before.
5. Ensure that the output PromQL is PromQL-compliant and executable, and free of syntax errors. \n"

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
User Question: {question}
PromQL Query: {query}`
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
Metric Name: {name}
Metric Description: {help}`
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
    `You are a helpful data assistant.
    
    The user asked this question:
    ${state.question}

    The PromQL query for this question was:
    ${state.query}
    
    The following is the JSON data with the results of the PromQL query:
     ${state.result}

     Use the data above to answer the user's question. 
     Do not respond with any additional explanation beyond the answer.
     Do not ask for more information.
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