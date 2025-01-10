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

import * as dotenv from 'dotenv';
import { create } from "domain";

dotenv.config();

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

const exampleSelector = await SemanticSimilarityExampleSelector.fromExamples<typeof MemoryVectorStore>(
  examples,
  new OpenAIEmbeddings(),
  MemoryVectorStore, {
  k: 5,
  inputKeys: ['question']
}
);

const examplePrompt = PromptTemplate.fromTemplate(`
Question: {question}
PromQL: {query}`
);

const queryPromptTemplate = new FewShotPromptTemplate({
  exampleSelector,
  examplePrompt,
  prefix: `Given an input question, first create a syntactically correct PromQL query to run, then look at the results of the query and return the answer.

Use the following format:

Question: "Question here"
PromQLQuery: "PromQL Queryto run"
PromQLResult: "Result of the PromQLQuery"
Answer: "Final answer here"

List of available nodes:
{nodes}

List of available jobs:
{jobs}

List of available metrics:
{metrics}

Below are a number of examples of questions and their corresponding PromQL queries.`,
  suffix: `
  Question: {question}
  PromQLQuery: 
  `,
  inputVariables: ["question", "metrics", "nodes", "jobs"]
});

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

const getPrometheusNodesTool = new DynamicStructuredTool({
  name: "get_prometheus_nodes",
  description: "Query Prometheus and return a list of nodes",
  schema: z.object({}),
  func: async () => {
    return await prometheusQueryTool.invoke({ query: 'count by (nodename) (node_uname_info)' });
  },
});

const getPrometheusJobsTool = new DynamicStructuredTool({
  name: "get_prometheus_jobs",
  description: "Query Prometheus and return a list of jobs",
  schema: z.object({}),
  func: async () => {
    return await prometheusQueryTool.invoke({ query: 'count by (job) (up)' });
  },
});

const StateAnnotation = Annotation.Root({
  question: Annotation<string>,
  metrics: Annotation<string>,
  nodes: Annotation<string>,
  jobs: Annotation<string>,
  query_explanation: Annotation<string>,
  query: Annotation<string>,
  result: Annotation<string>,
  answer: Annotation<string>,
});

const getMetrics = async (state: typeof StateAnnotation.State) => {
  return { metrics: await prometheusMetricsTool.invoke({}) };
};

const getPrometheusNodes = async (state: typeof StateAnnotation.State) => {
  return { nodes: await getPrometheusNodesTool.invoke({}) };
};

const getPrometheusJobs = async (state: typeof StateAnnotation.State) => {
  return { jobs: await getPrometheusJobsTool.invoke({}) };
};

const writeQueryTemplate = async (state: typeof StateAnnotation.State) => {
  const promptValue = await queryPromptTemplate.invoke({
    question: state.question, 
    jobs: state.jobs, 
    nodes: state.nodes, 
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
    
    The user asked this question: 
    ${state.question}

    We ran the following PromQL query:
    ${state.query}
    
    This was the explanation of the PromQL query:
    ${state.query_explanation}

    The query returned the following data:
     ${state.result}

    Based on these results, briefly answer the user's question without adding extra explanation. 
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
  .addNode("getMetrics", getMetrics)
  .addNode("getPrometheusNodes", getPrometheusNodes)
  .addNode("getPrometheusJobs", getPrometheusJobs)
  .addNode("writeQueryTemplate", writeQueryTemplate)
  .addNode("executeQuery", executeQuery)
  .addNode("generateAnswer", generateAnswer)
  .addEdge("__start__", "getMetrics")
  .addEdge("getMetrics", "getPrometheusNodes")
  .addEdge("getPrometheusNodes", "getPrometheusJobs")
  .addEdge("getPrometheusJobs", "writeQueryTemplate")
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