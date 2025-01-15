import { vectorStore } from './chroma.js';
import { allMetricNames } from './getMetrics.js';
import { ScoreThresholdRetriever } from "langchain/retrievers/score_threshold";

export const exampleSelector = ScoreThresholdRetriever.fromVectorStore(vectorStore, {
  minSimilarityScore: 0.2,
  maxK: 3,
  kIncrement: 2,
  filter: {'metrics': {'$in': allMetricNames}}
});