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
  k: 20,
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
 
    Use the following format:

    Question: Question from user
    PromQL Metadata: PromQL Metadata to user for they query
    PromQL Query: PromQL Query
    PromQL Result: Prom QL Result
    Answer: Final answer here
       
   Question: {question}

    Below are a number of examples of questions and their corresponding PromQL queries.`,
  suffix: `
  Input: {question}\n
  PromQL query: 
  `,
  inputVariables: ["question"]
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



const prometheusMetadataTool = new DynamicStructuredTool({
  name: "prometheus_metadata",
  description: "Get all metadata from Prometheus",
  schema: z.object({}),
  func: async () => {
    return await getPromMetadata();
  },
});



const writeQueryFromTemplateTool = new DynamicStructuredTool({
  name: "prometheus_write_query_from_template",
  description: "Take a PromQL query and replace any variables with their values",
  schema: z.object({
    query: z.string().describe("A PromQL query"),
  }),
  func: async ({ query }: { query: string }) => {
    return await replaceVariables({ query });
  },
});

const getPrometheusNode = async () => {
  let result = await prometheusQueryTool.invoke({ query: 'count by (nodename) (node_uname_info)' });
  result = JSON.parse(result)[0].metric.nodename;
  return result;
};

const getPrometheusJob = async () => {
  let result = await prometheusQueryTool.invoke({ query: 'count by (job) (up)' });
  result = JSON.parse(result)[0].metric.nodename;
  return result;
};

const replaceVariables = async ({ query }: { query: string }) => {
  query = query.replace(/\$__rate_interval/g, '5m');
  query = query.replace(/\$node/g, await getPrometheusNode());
  query = query.replace(/\$job/g, await getPrometheusJob());
  return { query: query };
};


const StateAnnotation = Annotation.Root({
  question: Annotation<string>,
  metadata: Annotation<string>,
  query_template: Annotation<string>,
  query_explanation: Annotation<string>,
  query: Annotation<string>,
  result: Annotation<string>,
  answer: Annotation<string>,
});

const getMetadata = async (state: typeof StateAnnotation.State) => {
  return { metadata: await prometheusMetadataTool.invoke };
};

const writeQueryTemplate = async (state: typeof InputStateAnnotation.State) => {
  const promptValue = await queryPromptTemplate.invoke({
    question: state.question,
  });
  const result = await structuredModel.invoke(promptValue);
  return { query_template: result.query, query_explanation: result.explanation };
};

const writeQueryFromTemplate = async (state: typeof StateAnnotation.State) => {
  const result = await writeQueryFromTemplateTool.invoke({ query: state.query_template });
  return { query: result.query };
};

const executeQuery = async (state: typeof StateAnnotation.State) => {
  return { result: await prometheusQueryTool.invoke({ query: state.query }) };
};

const generateAnswer = async (state: typeof StateAnnotation.State) => {
  const promptValue =
    `You are a helpful Prometheus assistant. 
    
    The user asked this question: 
    ${state.question}

    We ran the following PromQL query:
    ${state.query}
    
    What the purpose of the PromQL query was:
    ${state.query_explanation}

    The query returned the following data:
     ${state.result}

    Based on these results, briefly answer the user's question without adding extra explanation. 
    
    If the query returned an empty result answer that you don't know.
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
  .addNode("getMetadata", getMetadata)
  .addNode("writeQueryTemplate", writeQueryTemplate)
  .addNode("writeQueryFromTemplate", writeQueryFromTemplate)
  .addNode("executeQuery", executeQuery)
  .addNode("generateAnswer", generateAnswer)
  .addEdge("__start__", "getMetadata")
  .addEdge("getMetadata", "writeQueryTemplate")
  .addEdge("writeQueryTemplate", "writeQueryFromTemplate")
  .addEdge("writeQueryFromTemplate", "executeQuery")
  .addEdge("executeQuery", "generateAnswer")
  .addEdge("generateAnswer", "__end__");

const graph = graphBuilder.compile();

const answerQuestion = async (inputs: { question: string }) => {
  return await graph.invoke(inputs);
}
export {
  answerQuestion
};