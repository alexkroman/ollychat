import { Annotation } from "@langchain/langgraph";
import { StateGraph } from "@langchain/langgraph";

import { model } from '../models/openai.js';
import { promModel } from '../models/prom.js';

import { prometheusQueryTool } from '../utils/prometheus.js';
import { metricsExampleSelector } from '../utils/metricsFetcher.js';
import { loadPromptFromFile } from '../utils/promptLoader.js';
import { exampleSelector } from '../utils/getQueryExamples.js';
import { formatExamples } from '../utils/exampleFormatter.js';
import { normalizeQuestion } from '../utils/dataNormalizer.js';

const getQueryExamples = async (state: typeof StateAnnotation.State) => {
  const examples = await exampleSelector.invoke(normalizeQuestion(state.question));
  const combinedExamples = await formatExamples(examples, 'example', ['question', 'query']);
  return { examples: combinedExamples };
};

const getMetricExamples = async (state: typeof StateAnnotation.State) => {
  const metricExamples = await metricsExampleSelector.invoke(state.question);
  const combinedMetricExamples = await formatExamples(metricExamples, 'metricExample', ['name', 'help']);
  return { metrics: combinedMetricExamples };
};

const writeQueryTemplate = async (state: typeof StateAnnotation.State) => {
  const queryPromptTemplate = loadPromptFromFile('query');
  const promptValue = await queryPromptTemplate.invoke({
    question: state.question,
    examples: state.examples,
    metrics: state.metrics,
  });
  const result = await promModel.invoke(promptValue);
  return { query: result.query, query_explanation: result.explanation };
};

const executeQuery = async (state: typeof StateAnnotation.State) => {
  return { result: await prometheusQueryTool.invoke({ query: state.query }) };
};

const generateAnswer = async (state: typeof StateAnnotation.State) => {
  const answerPromptTemplate = loadPromptFromFile('answerPrompt');
  const answerPromptValue = await answerPromptTemplate.invoke({
    question: state.question,
    query: state.query,
    result: state.result,
  });

  const result = await model.invoke(answerPromptValue);
  return { answer: result.content };

};

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

const InputStateAnnotation = Annotation.Root({
  question: Annotation<string>,
});

const graphBuilder = new StateGraph({
  stateSchema: StateAnnotation,
})
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

export const answerQuestion = async (inputs: { question: string }) => {
  const graph = graphBuilder.compile();
  return await graph.invoke(inputs);
}