import {
  getMetricNamesTool,
  queryGeneratorTool,
  alertsFetcherTool,
  rangeQueryExecutorTool,
  metricDetailsTool,
  instantQueryExecutorTool,
} from "../tools/prometheus.js";
import { searchTool } from "../tools/search.js";
import { llmReasoningTool } from "../tools/llmReasoning.js";

export const tools = [
  llmReasoningTool,
  getMetricNamesTool,
  queryGeneratorTool,
  rangeQueryExecutorTool,
  alertsFetcherTool,
  metricDetailsTool,
  instantQueryExecutorTool,
  searchTool,
].filter((tool) => tool !== null);
