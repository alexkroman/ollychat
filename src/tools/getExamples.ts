import { vectorStore } from '../tools/chroma.js';
import { allMetricNames } from '../tools/getMetrics.js';
import { ScoreThresholdRetriever } from "langchain/retrievers/score_threshold";

export const exampleSelector = ScoreThresholdRetriever.fromVectorStore(vectorStore, {
  minSimilarityScore: 0.2, // Finds results with at least this similarity score
  maxK: 3, // The maximum K value to use. Use it based to your chunk size to make sure you don't run out of tokens
  kIncrement: 2, // How much to increase K by each time. It'll fetch N results, then N + kIncrement, then N + kIncrement * 2, etc.
  filter: {'metrics': {'$in': allMetricNames}}
});