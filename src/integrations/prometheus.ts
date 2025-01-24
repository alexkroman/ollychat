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

interface PrometheusMetadataResponse {
  status: string;
  data: Record<string, Array<{ type: string; help: string; unit?: string }>>;
}

interface PrometheusSeriesResponse {
  status: string;
  data: Array<Record<string, string>>;
}

export const prometheusQueryTool = new DynamicStructuredTool({
  name: "prometheus_query",
  description: "Query Prometheus and return the result",
  schema: z.object({ query: z.string().describe("A PromQL query") }),
  func: async ({ query }: { query: string }) => queryPrometheus(query),
});

async function queryPrometheus(query: string): Promise<string> {
  try {
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
    logger.error("Error executing Prometheus query:", error);
    return JSON.stringify({ error: "Error executing query" });
  }
}

function formatMetrics(data: PrometheusMetric[], query: string): object[] {
  if (!data.length) return [];

  const formatTime = timeFormat("%Y-%m-%d %H:%M:%S");
  const formatter = format(",.3f");
  const values = data.map(({ value }) => parseFloat(value[1]));

  const stats = {
    min: Math.min(...values),
    max: Math.max(...values),
    avg: values.reduce((sum, val) => sum + val, 0) / values.length,
  };

  const formattedData = data.map(({ metric, value }) => ({
    metric: extractMetrics(query)[0],
    node: metric.node,
    pod: metric.pod,
    value: formatter(parseFloat(value[1])),
    timestamp: formatTime(new Date(value[0] * 1000)),
  }));

  formattedData.push({
    metric: "Aggregations",
    node: "",
    pod: "",
    value: `Min: ${formatter(stats.min)}, Max: ${formatter(stats.max)}, Average: ${formatter(stats.avg)}`,
    timestamp: "",
  });

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

export async function fetchPrometheusMetrics(): Promise<string> {
  try {
    const metadataResponse = await axios.get<PrometheusMetadataResponse>(
      `${PROMETHEUS_URL}/api/v1/metadata`,
      { timeout: QUERY_TIMEOUT },
    );
    const seriesResponse = await axios.get<PrometheusSeriesResponse>(
      `${PROMETHEUS_URL}/api/v1/series`,
      { timeout: QUERY_TIMEOUT, params: { "match[]": '{__name__=~".+"}' } },
    );

    return JSON.stringify(
      combineMetadataAndSeries(
        metadataResponse.data.data,
        seriesResponse.data.data,
      ),
      null,
      2,
    );
  } catch (error) {
    logger.error("Error fetching Prometheus metrics:", error);
    return JSON.stringify({ error: "Failed to fetch metrics" });
  }
}

function combineMetadataAndSeries(
  metadata: Record<
    string,
    Array<{ type: string; help: string; unit?: string }>
  >,
  series: Array<Record<string, string>>,
): object[] {
  const metricLabelsMap: Record<string, Record<string, Set<string>>> = {};

  series.forEach((item) => {
    const metricName = item["__name__"];
    if (!metricName) return;

    metricLabelsMap[metricName] = metricLabelsMap[metricName] || {};
    Object.entries(item).forEach(([labelKey, labelValue]) => {
      if (labelKey !== "__name__") {
        metricLabelsMap[metricName][labelKey] =
          metricLabelsMap[metricName][labelKey] || new Set();
        metricLabelsMap[metricName][labelKey].add(labelValue);
      }
    });
  });

  return Object.keys(metadata).map((metricName) => ({
    metricName,
    metadata: metadata[metricName] || [],
    labels: Object.entries(metricLabelsMap[metricName] || {}).map(
      ([labelKey, values]) => ({
        labelKey,
        values: Array.from(values),
      }),
    ),
  }));
}
