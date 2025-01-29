import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ScoreThresholdRetriever } from "langchain/retrievers/score_threshold";
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

export const metricsExampleSelector = ScoreThresholdRetriever.fromVectorStore(
  MetricsVectorStore,
  {
    minSimilarityScore: 0.4,
    maxK: 5,
  },
);

export const labelsExampleSelector = ScoreThresholdRetriever.fromVectorStore(
  LabelsVectorStore,
  {
    minSimilarityScore: 0.4,
    maxK: 5,
  },
);

export const valuesExampleSelector = ScoreThresholdRetriever.fromVectorStore(
  ValuesVectorStore,
  {
    minSimilarityScore: 0.4,
    maxK: 5,
  },
);

const getAllMetricsSelector = MetricsVectorStore.asRetriever({
  k: 2000,
});

export const vectorStore = new Chroma(embeddings, {
  collectionName: config.chromaIndex,
  url: config.chromaUrl,
});

export const allMetrics = await getAllMetricsSelector.invoke("");

export const exampleSelector = ScoreThresholdRetriever.fromVectorStore(
  vectorStore,
  {
    minSimilarityScore: 0.2,
    maxK: 5,
    filter: {
      metrics: { $in: allMetrics.map((metric) => metric.metadata.metric) },
    },
  },
);
