import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { z } from "zod";
import { Annotation } from "@langchain/langgraph";
import { StateGraph } from "@langchain/langgraph";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { ScoreThresholdRetriever } from "langchain/retrievers/score_threshold";
import { prometheusQueryTool } from '../tools/prometheus.js';
import { loadPromptFromFile } from '../tools/loadPrompts.js';

import { model } from '../models/openai.js';

import * as dotenv from 'dotenv';
dotenv.config();

const logging = !process.execArgv.includes('--no-warnings');

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

const queryOutput = z.object({
  explanation: z.string().describe("Description of what the PromQL query does."),
  query: z.string().describe("Syntactically valid PromQL query."),
});

const structuredModel = model.withStructuredOutput(queryOutput);

const queryPromptTemplate = loadPromptFromFile('query');

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

  const examplePrompt = loadPromptFromFile('example')

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

  const metricExamplePrompt = loadPromptFromFile('metricExample')

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
  if (logging === true) {
    console.log(promptValue);
  }
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

    Answer the user's question:
     Use only the data above
     Do not respond with any additional explanation beyond the answer.
     Do not ask for more information.
     If you do not know the answer to the user's question say that you don't know.
    `;
    if (logging === true) {
      console.log(promptValue);
    }
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