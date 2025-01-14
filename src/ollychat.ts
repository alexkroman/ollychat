import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { z } from "zod";
import { FewShotPromptTemplate, PromptTemplate } from "@langchain/core/prompts";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { SemanticSimilarityExampleSelector } from "@langchain/core/example_selectors";
import { examples } from "./training.js";
import { Annotation } from "@langchain/langgraph";
import { createQueryExecutor, createMetricsFetcher } from './prometheus.js';
import { DynamicStructuredTool } from "@langchain/core/tools";
import { StateGraph } from "@langchain/langgraph";
import { Chroma } from "@langchain/community/vectorstores/chroma";

import fs from 'fs';

import * as dotenv from 'dotenv';

dotenv.config();

// Load metrics

const rawData = fs.readFileSync('./training_data/metrics/metrics.json', 'utf-8');
const metrics = JSON.parse(rawData);

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});

const vectorStore = new Chroma(embeddings, {
  collectionName: "prometheus_examples",
  url: process.env.CHROMA_URL || "http://localhost:8000", // Optional, will default to this value
});

const exampleSelector = vectorStore.asRetriever({
  k: 5
});

console.log(await exampleSelector.invoke('cpu'));

// Map the JSON data to an array with the desired structure
const metricsArray: Array<{ name: string; description: string }> = metrics.map((metric: { name: string; description: string }) => ({
  name: metric.name,
  description: metric.description || ``,
}));

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




const queryPromptTemplate = PromptTemplate.fromTemplate(
`Given an input question, first create a syntactically correct PromQL query to run, then look at the results of the query and return the answer.

Use the following format:

Question: "Question here"
PromQLQuery: "PromQL Query to run"
PromQLResult: "Result of the PromQLQuery"
Answer: "Final answer here"

List of available metrics:
{metrics}

Below are a number of examples of questions and their corresponding PromQL queries.
{examples}

User Question: {question}
PromQLQuery: 
`);

const getMetricsFetcher = createMetricsFetcher(prometheusUrl);

const prometheusMetricsTool = new DynamicStructuredTool({
  name: "prometheus_metrics",
  description: "Get all metrics from Prometheus",
  schema: z.object({}),
  func: async () => {
    return await getMetricsFetcher();
  },
});

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
});

const getExamples = async (state: typeof StateAnnotation.State) => {
  const examples = await exampleSelector.invoke(state.question);

  const examplePrompt = PromptTemplate.fromTemplate(`
Example Question: {question}
Example PromQL: {query}`
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

const writeQueryTemplate = async (state: typeof StateAnnotation.State) => {
  const promptValue = await queryPromptTemplate.invoke({
    question: state.question,
    examples: state.examples, 
    metrics: state.metrics
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

    Using the data above and your knowledge of Prometheus, give a brief answer to the user's question being as specific as possible:
    ${state.question}

    Do not ask for more information.
    If you respond with any numbers please give the units based on the above.
    If the query returned "[]" you can say "No data found". 
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
  .addNode("writeQueryTemplate", writeQueryTemplate)
  .addNode("executeQuery", executeQuery)
  .addNode("generateAnswer", generateAnswer)
  .addEdge("__start__", "getExamples")
  .addEdge("getExamples", "writeQueryTemplate")
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