import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { z } from "zod";
import { FewShotPromptTemplate, PromptTemplate } from "@langchain/core/prompts";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { SemanticSimilarityExampleSelector } from "@langchain/core/example_selectors";
import { examples } from "./training.js";
import { Annotation } from "@langchain/langgraph";
import { createQueryExecutor, createMetadataFetcher } from './prometheus.js';
import { DynamicStructuredTool } from "@langchain/core/tools";
import { StateGraph } from "@langchain/langgraph";

import * as dotenv from 'dotenv';

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

// Initialize Prometheus clients
const getPromMetadata = createMetadataFetcher(prometheusUrl);
const queryPrometheus = createQueryExecutor(prometheusUrl);

const exampleSelector = await SemanticSimilarityExampleSelector.fromExamples<typeof MemoryVectorStore>(
  examples,
  new OpenAIEmbeddings(),
  MemoryVectorStore, {
  k: 5,
  inputKeys: ['question']
}
);

const examplePrompt = PromptTemplate.fromTemplate(
  `Question: {question}\nPromQL: {query}`
);

const queryPromptTemplate = new FewShotPromptTemplate({
  exampleSelector,
  examplePrompt,
  prefix: `
    You are a PromQL expert.

    Given an input question, first create a syntactically correct PromQL query to run,
    then look at the results of the query and return the answer to the input question.
    You must query only the metadata that are needed to answer the question.
    Pay attention to replace variables according to the table below.
    Pay attention to use only the metadata you can see in the metadata below.
    Be careful to not query for metadata that do not exist.
    In the query text you should always replace $__rate_interval with 5m  

    Use the following format:
    Question: "Question here"
    PromQLQuery: "PromQL Query to run"
    PromQLResult: "Result of the PromQLQuery"
    Answer: "Final answer here"
    
    Only use the following metadata:
    {metadata}
    
    User question: {question}

    Below are a number of examples of questions and their corresponding PromQL queries.`,
  suffix: `
  Input: {question}\n
  PromQL query: 
  `,
  inputVariables: ["metadata", "question"]
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

const executeQuery = async (state: typeof StateAnnotation.State) => {
  return { result: await prometheusQueryTool.invoke({ query: state.query }) };
};

const generateAnswer = async (state: typeof StateAnnotation.State) => {
  const promptValue =
    "Given the following user question, corresponding PromQL query, " +
    "and PromQL result, answer the user question.\n\n" +
    `Question: ${state.question}\n` +
    `PromQL Query: ${state.query}\n` +
    `PromQL Result: ${state.result}\n`;
  const response = await model.invoke(promptValue);
  return { answer: response.content };
};

const writeQuery = async (state: typeof InputStateAnnotation.State) => {
  const promptValue = await queryPromptTemplate.invoke({
    metadata: await getPromMetadata(),
    question: state.question,
  });
  const result = await structuredModel.invoke(promptValue);
  return { query: result.query, explanation: result.explanation };
};

const InputStateAnnotation = Annotation.Root({
  question: Annotation<string>,
});

const StateAnnotation = Annotation.Root({
  question: Annotation<string>,
  query: Annotation<string>,
  result: Annotation<string>,
  answer: Annotation<string>,
});

const graphBuilder = new StateGraph({
  stateSchema: StateAnnotation,
})
  .addNode("writeQuery", writeQuery)
  .addNode("executeQuery", executeQuery)
  .addNode("generateAnswer", generateAnswer)
  .addEdge("__start__", "writeQuery")
  .addEdge("writeQuery", "executeQuery")
  .addEdge("executeQuery", "generateAnswer")
  .addEdge("generateAnswer", "__end__");

const graph = graphBuilder.compile();

const answerQuestion = async (inputs: { question: string }) => {
  return await graph.invoke(inputs);
}
export {
  answerQuestion
};