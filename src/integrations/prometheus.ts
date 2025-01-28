import axios from "axios";
import { timeFormat } from "d3-time-format";
import { format } from "d3-format";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { config } from "../config/config.js";
import { logger } from "../utils/logger.js";

const PROMETHEUS_URL: string = config.prometheusUrl;
const QUERY_TIMEOUT: number = 5000;

interface PrometheusMetric {
  metric: Record<string, string>;
  value: [number, string];
}

interface PrometheusQueryResponse {
  status: string;
  data: {
    result: PrometheusMetric[];
  };
}

export const prometheusQueryTool = new DynamicStructuredTool({
  name: "prometheus_query",
  description: "Query Prometheus and return the result",
  schema: z.object({ query: z.string().describe("A PromQL query") }),
  func: async ({ query }: { query: string }) => queryPrometheus(query),
});

async function queryPrometheus(query: string): Promise<string> {
  try {
    console.log("Executing Query: " + query);
    const response = await axios.get<PrometheusQueryResponse>(
      `${PROMETHEUS_URL}/api/v1/query`,
      { params: { query }, timeout: QUERY_TIMEOUT },
    );
    return JSON.stringify(
      formatMetrics(response.data.data.result, query),
      null,
      2,
    );
  } catch (error) {
    return JSON.stringify({ error: "Error executing query" + error });
  }
}

function formatMetrics(data: PrometheusMetric[], query: string): object[] {
  if (!data.length) return [];

  const formatTime = timeFormat("%Y-%m-%d %H:%M:%S");
  const formatter = format(",.3f");

  const formattedData = data.map(({ metric, value }) => ({
    metric: extractMetrics(query)[0],
    node: metric.node,
    pod: metric.pod,
    value: formatter(parseFloat(value[1])),
    timestamp: formatTime(new Date(value[0] * 1000)),
  }));

  return formattedData;
}

export function extractMetrics(query: string): string[] {
  const metricRegex = /[a-zA-Z_:][a-zA-Z0-9_:]*/g;
  const promQLFunctions = new Set<string>([
    "sum",
    "avg",
    "min",
    "max",
    "count",
    "rate",
    "irate",
    "delta",
    "increase",
    "topk",
    "bottomk",
    "quantile",
    "sort",
    "sort_desc",
    "sort_asc",
    "stddev",
    "stdvar",
    "abs",
    "clamp_max",
    "clamp_min",
    "by",
    "on",
    "group_left",
    "group_right",
    "time",
    "changes",
    "predict_linear",
    "histogram_quantile",
  ]);

  const matches = query.match(metricRegex) || [];
  return matches
    .filter((metric) => !promQLFunctions.has(metric) && !metric.includes("("))
    .sort();
}

export async function fetchPrometheusMetrics(): Promise<string[]> {
  try {
    const response = await axios.get<{ data: string[] }>(
      `${PROMETHEUS_URL}/api/v1/metadata`,
      { timeout: QUERY_TIMEOUT },
    );
    return Object.keys(response.data.data);
  } catch (error) {
    logger.error("Error fetching Prometheus metrics:", error);
    return [];
  }
}

export async function fetchPrometheusLabels(): Promise<string[]> {
  try {
    const response = await axios.get<{ data: string[] }>(
      `${PROMETHEUS_URL}/api/v1/labels`,
      { timeout: QUERY_TIMEOUT },
    );

    return response.data.data;
  } catch (error) {
    logger.error("Error fetching Prometheus labels:", error);
    return [];
  }
}

export async function fetchAllPrometheusLabelValues(): Promise<
  { label: string; value: string }[]
> {
  try {
    // Fetch all label names
    const labels = await fetchPrometheusLabels();
    const result = (
      await Promise.all(
        labels.map(async (label) => {
          try {
            return (await fetchPrometheusLabelValues(label)).map((value) => ({
              value,
              label,
            }));
          } catch (error) {
            logger.error(`Error fetching values for label ${label}:`, error);
            return []; // Return an empty array to avoid breaking Promise.all
          }
        }),
      )
    ).flat();
    return result;
  } catch (error) {
    logger.error("Error fetching all Prometheus label values:", error);
    return [];
  }
}

export async function fetchPrometheusLabelValues(
  label: string,
): Promise<string[]> {
  try {
    const response = await axios.get<{ data: string[] }>(
      `${PROMETHEUS_URL}/api/v1/label/${label}/values`,
      { timeout: QUERY_TIMEOUT },
    );

    return response.data.data;
  } catch (error) {
    logger.error(`Error fetching values for label ${label}:`, error);
    return [];
  }
}
