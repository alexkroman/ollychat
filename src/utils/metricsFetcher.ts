import { MetricsVectorStore } from "../utils/chroma.js";

export const metricsExampleSelector = MetricsVectorStore.asRetriever({
  k: 5,
});

const getAllMetricsSelector = MetricsVectorStore.asRetriever({
  k: 2000,
});

const allMetrics = await getAllMetricsSelector.invoke("");
export const allMetricNames = allMetrics.map((metric) => metric.metadata.name);
