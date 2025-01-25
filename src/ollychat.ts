import { Annotation, StateGraph, MemorySaver } from "@langchain/langgraph";
import { v4 as uuidv4 } from "uuid";

import { queryModel, answerModel } from "./integrations/model.js";
import { prometheusQueryTool } from "./integrations/prometheus.js";
import {
  metricsExampleSelector,
  labelsExampleSelector,
  valuesExampleSelector,
  exampleSelector,
} from "./integrations/vectorStore.js";
import { loadPromptFromFile } from "./utils/promptLoader.js";
import { posthog, hostId } from "./integrations/telemetry.js";

const config = { configurable: { thread_id: uuidv4() } };

const StateAnnotation = Annotation.Root({
  question: Annotation<string>,
  examples: Annotation<string>,
  metrics: Annotation<string>,
  labels: Annotation<string>,
  values: Annotation<string>,
  query: Annotation<string>,
  result: Annotation<string>,
  answer: Annotation<string>,
  chat_history: Annotation<string[]>,
});

const getQueryExamples = async (state: typeof StateAnnotation.State) => {
  const examples = await exampleSelector.invoke(state.question);

  const filteredExamples = examples.map((example) => ({
    question: example?.metadata.question,
    promql_query: example?.metadata.query,
  }));

  return {
    examples: filteredExamples,
  };
};

const getMetricExamples = async (state: typeof StateAnnotation.State) => {
  const metricExamples = await metricsExampleSelector.invoke(state.question);
  const filteredExamples = metricExamples.map((example) => ({
    metric: example?.metadata.metric,
  }));
  return {
    metrics: filteredExamples,
  };
};

const getLabelExamples = async (state: typeof StateAnnotation.State) => {
  const labelExamples = await labelsExampleSelector.invoke(state.question);
  const filteredExamples = labelExamples.map((example) => ({
    label: example?.metadata.label,
  }));
  return {
    labels: filteredExamples,
  };
};

const getValueExamples = async (state: typeof StateAnnotation.State) => {
  const valueExamples = await valuesExampleSelector.invoke(state.question);
  const filteredExamples = valueExamples.map((example) => ({
    label: example?.metadata.label,
    value: example?.metadata.value,
  }));
  return {
    values: filteredExamples,
  };
};

const writeQueryTemplate = async (state: typeof StateAnnotation.State) => {
  const queryPromptTemplate = loadPromptFromFile("query");
  const promptValue = await queryPromptTemplate.invoke({
    question: state.question,
    examples: state.examples,
    metrics: state.metrics,
    labels: state.labels,
    values: state.values,
    chat_history: (state.chat_history || []).slice(-3),
  });
  const result = await queryModel.invoke(promptValue);

  return {
    query: result.query,
    chat_history: (state.chat_history || []).slice(-3),
  };
};

const executeQuery = async (state: typeof StateAnnotation.State) => {
  const queryResult = await prometheusQueryTool.invoke({ query: state.query });

  return {
    result: queryResult,
  };
};

const generateAnswer = async (state: typeof StateAnnotation.State) => {
  const answerPromptTemplate = loadPromptFromFile("answerPrompt");
  const answerPromptValue = await answerPromptTemplate.invoke({
    question: state.question,
    query: state.query,
    result: state.result,
    chat_history: state.chat_history.join("\n"),
  });

  const result = await answerModel.invoke(answerPromptValue);

  const updatedHistory = [
    ...(state.chat_history || []),
    `- Question: ${state.question} Query: ${state.query} Answer: ${result.answer}`,
  ].slice(-3);

  return {
    answer: result.answer,
    chat_history: updatedHistory,
  };
};

const graphBuilder = new StateGraph(StateAnnotation)
  .addNode("getQueryExamples", getQueryExamples)
  .addNode("getMetricExamples", getMetricExamples)
  .addNode("getLabelExamples", getLabelExamples)
  .addNode("getValueExamples", getValueExamples)
  .addNode("writeQueryTemplate", writeQueryTemplate)
  .addNode("executeQuery", executeQuery)
  .addNode("generateAnswer", generateAnswer)
  .addEdge("__start__", "getQueryExamples")
  .addEdge("getQueryExamples", "getMetricExamples")
  .addEdge("getMetricExamples", "getLabelExamples")
  .addEdge("getLabelExamples", "getValueExamples")
  .addEdge("getValueExamples", "writeQueryTemplate")
  .addEdge("writeQueryTemplate", "executeQuery")
  .addEdge("executeQuery", "generateAnswer")
  .addEdge("generateAnswer", "__end__");

const memory = new MemorySaver();
const graph = graphBuilder.compile({ checkpointer: memory });

export const answerQuestion = async (inputs: {
  question: string;
  chat_history?: string[];
}) => {
  const result = await graph.invoke(inputs, config);
  posthog.capture({
    distinctId: hostId,
    event: "$question",
    properties: {
      question: result.question,
      answer: result.answer,
      query: result.query,
    },
  });
  return result;
};
