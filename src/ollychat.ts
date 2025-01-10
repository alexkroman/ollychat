import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { z } from "zod";
import { FewShotPromptTemplate, PromptTemplate } from "@langchain/core/prompts";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { SemanticSimilarityExampleSelector } from "@langchain/core/example_selectors";
import { examples } from "./training.js";
import { metrics} from "./training-metric.js";
import { Annotation } from "@langchain/langgraph";
import { createQueryExecutor, createMetricsFetcher } from './prometheus.js';
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

const queryPrometheus = createQueryExecutor(prometheusUrl);



const exampleSelector = await SemanticSimilarityExampleSelector.fromExamples<typeof MemoryVectorStore>(
  examples,
  new OpenAIEmbeddings(),
  MemoryVectorStore, {
  k: 5,
  inputKeys: ['question']
});

const metricSelector = await SemanticSimilarityExampleSelector.fromExamples<typeof MemoryVectorStore>(
  metrics,
  new OpenAIEmbeddings(),
  MemoryVectorStore, {
  k: 5,
  inputKeys: ['description']
});

const queryPromptTemplate = PromptTemplate.fromTemplate(
`Given an input question, first create a syntactically correct PromQL query to run, then look at the results of the query and return the answer.

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
  examples: Annotation<string>,
  metrics: Annotation<string>,
  nodes: Annotation<string>,
  jobs: Annotation<string>,
  query_explanation: Annotation<string>,
  query: Annotation<string>,
  result: Annotation<string>,
  answer: Annotation<string>,
});

const getExamples = async (state: typeof StateAnnotation.State) => {
  const examples = await exampleSelector.selectExamples({ question: state.question });

  const examplePrompt = PromptTemplate.fromTemplate(`
Example Question: {question}
Example PromQL: {query}`
  );

  const formattedExamples = await Promise.all(
    examples.map(example => 
      examplePrompt.format({
        question: example.question,
        query: example.query
      })
    )
  );
  
  const combinedExamples = formattedExamples.join('\n\n');

  return { examples: combinedExamples };
};



const getMetrics = async (state: typeof StateAnnotation.State) => {
  const metrics = await metricSelector.selectExamples({ question: state.question });

  const metricPrompt = PromptTemplate.fromTemplate(`
Metric: {metric}
Description: {description}`);

  const formattedMetrics = await Promise.all(
    metrics.map(metric => 
      metricPrompt.format({
        metric: metric.metric,
        description: metric.description
      })
    )
  );
  
  const combinedMetrics = formattedMetrics.join('\n');

  return { metrics: combinedMetrics };
};

const getPrometheusNodes = async (state: typeof StateAnnotation.State) => {
  const nodes: {
    metric: any; nodename: string 
}[] = await getPrometheusNodesTool.invoke({});
  return { nodes: nodes };  
};

const getPrometheusJobs = async (state: typeof StateAnnotation.State) => {
  return { jobs: await getPrometheusJobsTool.invoke({}) };
};

const writeQueryTemplate = async (state: typeof StateAnnotation.State) => {
  const promptValue = await queryPromptTemplate.invoke({
    question: state.question,
    examples: state.examples, 
    metrics: state.metrics,
    jobs: state.jobs, 
    nodes: state.nodes
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

    Using only the data above answer the user's question. 
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
  .addNode("getMetrics", getMetrics)
  .addNode("getExamples", getExamples)
  .addNode("getPrometheusNodes", getPrometheusNodes)
  .addNode("getPrometheusJobs", getPrometheusJobs)
  .addNode("writeQueryTemplate", writeQueryTemplate)
  .addNode("executeQuery", executeQuery)
  .addNode("generateAnswer", generateAnswer)
  .addEdge("__start__", "getMetrics")
  .addEdge("getMetrics", "getExamples")
  .addEdge("getExamples", "getPrometheusNodes")
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