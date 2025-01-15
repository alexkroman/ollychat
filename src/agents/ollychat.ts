import { z } from "zod";
import { Annotation } from "@langchain/langgraph";
import { StateGraph } from "@langchain/langgraph";
import { prometheusQueryTool } from '../tools/prometheus.js';
import { metricsExampleSelector } from '../tools/getMetrics.js';
import { exampleSelector } from '../tools/getExamples.js';
import { model } from '../models/openai.js';
import { loadPromptFromFile, loadFile } from '../tools/loadPrompts.js';

const queryOutput = z.object({
  explanation: z.string().describe("Description of what the PromQL query does."),
  query: z.string().describe("Syntactically valid PromQL query."),
});

const structuredModel = model.withStructuredOutput(queryOutput);

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
  const queryPromptTemplate = loadPromptFromFile('query');
  const promptValue = await queryPromptTemplate.invoke({
    question: state.question,
    examples: state.examples,
    metrics: state.metrics,
  });
  const result = await structuredModel.invoke(promptValue);
  return { query: result.query, query_explanation: result.explanation };
};

const executeQuery = async (state: typeof StateAnnotation.State) => {
  return { result: await prometheusQueryTool.invoke({ query: state.query }) };
};

const generateAnswer = async (state: typeof StateAnnotation.State) => {
  const promptValue = loadFile('answerPrompt');
  const response = await model.invoke(promptValue);
  return { answer: response.content };
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

export const answerQuestion = async (inputs: { question: string }) => {
  return await graph.invoke(inputs);
}