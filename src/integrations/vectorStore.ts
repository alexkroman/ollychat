import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { config } from "../config/config.js";

const embeddings = new OpenAIEmbeddings({
  model: config.openAIEmbeddings,
});

export const MetricsVectorStore = new Chroma(embeddings, {
  collectionName: config.chromaMetricsIndex,
  url: config.chromaUrl,
});

export const LabelsVectorStore = new Chroma(embeddings, {
  collectionName: config.chromaLabelsIndex,
  url: config.chromaUrl,
});

export const ValuesVectorStore = new Chroma(embeddings, {
  collectionName: config.chromaValuesIndex,
  url: config.chromaUrl,
});

export const metricsExampleSelector = MetricsVectorStore.asRetriever({
  k: 10,
});

export const labelsExampleSelector = LabelsVectorStore.asRetriever({
  k: 5,
});

export const valuesExampleSelector = ValuesVectorStore.asRetriever({
  k: 5,
});

const getAllMetricsSelector = MetricsVectorStore.asRetriever({
  k: 2000,
});

const allMetrics = await getAllMetricsSelector.invoke("");
export const allMetricNames = allMetrics.map(
  (metric) => metric.metadata.metric,
);

export const vectorStore = new Chroma(embeddings, {
  collectionName: config.chromaIndex,
  url: config.chromaUrl,
});

export const exampleSelector = vectorStore.asRetriever({
  filter: { metrics: { $in: allMetricNames } },
  k: 10,
});
