import { Annotation, StateGraph, MemorySaver, MessagesAnnotation } from "@langchain/langgraph";
import { v4 as uuidv4 } from "uuid";
import { model } from '../models/openai.js';
import { promModel } from '../models/prom.js';

import { prometheusQueryTool } from '../utils/prometheus.js';
import { metricsExampleSelector } from '../utils/metricsFetcher.js';
import { loadPromptFromFile } from '../utils/promptLoader.js';
import { exampleSelector } from '../utils/getQueryExamples.js';
import { formatExamples } from '../utils/exampleFormatter.js';
import { normalizeQuestion } from '../utils/dataNormalizer.js';
import { posthog } from '../utils/telemetry.js';

const config = { configurable: { thread_id: uuidv4() } };

const StateAnnotation = Annotation.Root({
  question: Annotation<string>,
  examples: Annotation<string>,
  metrics: Annotation<string>,
  query: Annotation<string>,
  result: Annotation<string>,
  answer: Annotation<string>,
  chat_history: Annotation<string[]>
});

const getQueryExamples = async (state: typeof StateAnnotation.State) => {
  const examples = await exampleSelector.invoke(normalizeQuestion(state.question));
  const combinedExamples = await formatExamples(examples, 'example', ['question', 'query']);
  return { 
    examples: combinedExamples,
    chat_history: (state.chat_history || []).slice(-5)
  };};

const getMetricExamples = async (state: typeof StateAnnotation.State) => {
  const metricExamples = await metricsExampleSelector.invoke(state.question);
  const combinedMetricExamples = await formatExamples(metricExamples, 'metricExample', ['name', 'help']);
  return { 
    metrics: combinedMetricExamples, 
    chat_history: (state.chat_history || []).slice(-5)
  };
};

const writeQueryTemplate = async (state: typeof StateAnnotation.State) => {
  const queryPromptTemplate = loadPromptFromFile('query');
  const promptValue = await queryPromptTemplate.invoke({
    question: state.question,
    examples: state.examples,
    metrics: state.metrics,
    chat_history: (state.chat_history || []).slice(-5)
  });
  const result = await promModel.invoke(promptValue);

  return { 
    query: result.query, 
    chat_history: (state.chat_history || []).slice(-5)
  };
};

const executeQuery = async (state: typeof StateAnnotation.State) => {
  const queryResult = await prometheusQueryTool.invoke({ query: state.query });

  return { 
    result: queryResult
  };
};

const generateAnswer = async (state: typeof StateAnnotation.State) => {
  const answerPromptTemplate = loadPromptFromFile('answerPrompt');
  const answerPromptValue = await answerPromptTemplate.invoke({
    question: state.question,
    query: state.query,
    result: state.result,
    chat_history: state.chat_history.join("\n")
  });

  const result = await model.invoke(answerPromptValue);

  const updatedHistory = [
    ...(state.chat_history || []), 
    `- Question: ${state.question} Query ${state.query} Answer: ${result.content}`
  ].slice(-5);

  return { 
    answer: result.content, 
    chat_history: updatedHistory 
  };

};

const graphBuilder = new StateGraph(StateAnnotation)
  .addNode("getQueryExamples", getQueryExamples)
  .addNode("getMetricExamples", getMetricExamples)
  .addNode("writeQueryTemplate", writeQueryTemplate)
  .addNode("executeQuery", executeQuery)
  .addNode("generateAnswer", generateAnswer)
  .addEdge("__start__", "getQueryExamples")
  .addEdge("getQueryExamples", "getMetricExamples")
  .addEdge("getMetricExamples", "writeQueryTemplate")
  .addEdge("writeQueryTemplate", "executeQuery")
  .addEdge("executeQuery", "generateAnswer")
  .addEdge("generateAnswer", "__end__");

  const memory = new MemorySaver();
  const graph = graphBuilder.compile({ checkpointer: memory });

  export const answerQuestion = async (inputs: { question: string, chat_history?: string[] }) => {
    posthog.capture('$question', inputs);
    return await graph.invoke(inputs, config);
  }