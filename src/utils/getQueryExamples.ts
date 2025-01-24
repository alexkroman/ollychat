import { vectorStore } from "./chroma.js";
import { allMetricNames } from "./metricsFetcher.js";

export const exampleSelector = vectorStore.asRetriever({
  filter: { metrics: { $in: allMetricNames } },
  k: 10,
});
