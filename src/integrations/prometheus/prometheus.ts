import axios from "axios";
import { timeFormat } from "d3-time-format";
import { format } from "d3-format";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { config } from "../../config/config.js";
import { logger } from "../../utils/logger.js";

const prometheusUrl = config.prometheusUrl;
const queryPrometheus = createQueryExecutor(prometheusUrl);

export const prometheusQueryTool = new DynamicStructuredTool({
  name: "prometheus_query",
  description: "Query Prometheus and return the result",
  schema: z.object({
    query: z.string().describe("A PromQL query"),
  }),
  func: async ({ query }: { query: string }) => {
    return await queryPrometheus(query);
  },
});

interface PrometheusMetadataResponse {
  status: string;
  data: Record<
    string,
    Array<{
      type: string;
      help: string;
      unit?: string;
    }>
  >;
}

interface PrometheusQueryResponse {
  status: string;
  data: {
    result: PrometheusMetric[];
  };
}

interface PrometheusMetric {
  metric: Record<string, string>;
  value: [number, string];
}

interface PrometheusSeriesResponse {
  status: string;
  data: Array<Record<string, string>>;
}

export type QueryExecutor = (query: string) => Promise<string>;

export function metricsToJSON(
  data: PrometheusMetric[],
  query: string,
): object[] {
  if (data.length === 0) {
    return [];
  }

  const formatTime = timeFormat("%Y-%m-%d %H:%M:%S"); // Adjust format as needed
  const formatter = format(",.3f");

  const values = data.map(({ value }) => parseFloat(value[1]));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((sum, val) => sum + val, 0) / values.length;

  const table = data.map(({ metric, value }) => ({
    metric: extractPromQLMetrics(query)[0],
    node: metric.node,
    pod: metric.pod,
    value: formatter(parseFloat(value[1])),
    timestamp: formatTime(new Date(value[0] * 1000)),
  }));

  table.push({
    metric: "Aggregations",
    node: "",
    value: `Min: ${formatter(min)}, Max: ${formatter(max)}, Average: ${formatter(avg)}`,
    timestamp: "",
    pod: "",
  });

  return table;
}

export function extractPromQLMetrics(query: string): string[] {
  const metricRegex = /[a-zA-Z_:][a-zA-Z0-9_:]*/g;
  const promQLFunctions = new Set([
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
    "m",
    "oninstance",
    "job",
    "__range",
    "count_over_time",
    "sum_over_time",
    "avg_over_time",
    "__interval",
    "or",
    "histogram_quantile",
    "label_replace",
    "label_join",
    "receiver",
    "instance",
    "job",
    "namespace",
    "exporter",
    "grouping",
    "le",
    "exp",
    "service_name",
    "title",
    "name",
    "pod",
    "s",
    "method",
    "path",
    "h",
    "type",
    "level",
    "location",
    "and",
    "realm",
    "kind",
    "ref",
    "unless",
    "node",
    "code",
    "interval",
    "requestKind",
    "controller",
    "d",
    "on",
    "group_left",
    "interval",
    "time",
    "changes",
    "d:1d",
    "d:1h",
    "d:1m",
    "d:1s",
    "d:1w",
    "d:1y",
    "d:2d",
    "d:2h",
    "d:2m",
    "d:2s",
    "d:2w",
    "d:2y",
    "d:3d",
    "d:3h",
    "Identifier",
    "OR",
    "info",
    "proto",
    "type",
    "zone",
    "service",
    "container_name",
    "pod_name",
    "pod_namespace",
    "pod_uid",
    "interval",
    "mount",
    "vector",
    "time",
    "volume",
    "project",
    "version",
    "task_execution_id",
    "task_name",
    "cluster",
    "predict_linear",
    "status",
    "gpu",
    "Interval",
    "datname",
    "i",
    "searchable_pattern",
    "job_name",
    "query",
    "verb",
    "policy_name",
    "stream",
    "flag",
    "value",
    "round",
    "status",
    "verb",
    "BY",
    "idle",
    "mode",
  ]);

  const metrics = new Set<string>();
  const matches = query.match(metricRegex);
  if (matches) {
    matches.forEach((metric) => {
      if (!promQLFunctions.has(metric) && !metric.includes("(")) {
        metrics.add(metric);
      }
    });
  }
  return Array.from(metrics).sort();
}

export function createQueryExecutor(
  prometheusUrl: string,
  timeout: number = 5000,
): QueryExecutor {
  return async function executeQuery(query: string): Promise<string> {
    try {
      const response = await axios.get<PrometheusQueryResponse>(
        `${prometheusUrl}/api/v1/query`,
        { params: { query }, timeout },
      );
      const result = response.data.data.result;
      const table = metricsToJSON(result, query);
      return JSON.stringify(table, null, 2);
    } catch (error) {
      logger.error("Error executing Prometheus query:", error);
      return JSON.stringify({ error: "Error executing query" });
    }
  };
}

export function createMetricsFetcher(
  prometheusUrl: string,
  timeout: number = 5000,
): () => Promise<string> {
  return async function getMetrics(): Promise<string> {
    // 1. Fetch metadata
    const metadataResponse = await axios.get<PrometheusMetadataResponse>(
      `${prometheusUrl}/api/v1/metadata`,
      {
        timeout,
      },
    );
    const metadata = metadataResponse.data.data;

    // 2. Fetch all series
    const seriesResponse = await axios.get<PrometheusSeriesResponse>(
      `${prometheusUrl}/api/v1/series`,
      {
        timeout,
        params: { "match[]": '{__name__=~".+"}' },
      },
    );
    const allSeries = seriesResponse.data.data;

    const metricLabelsMap: Record<string, Record<string, Set<string>>> = {};

    // 3. Build up the label key/value sets per metric
    for (const series of allSeries) {
      const metricName = series["__name__"];
      if (!metricName) continue;

      if (!metricLabelsMap[metricName]) {
        metricLabelsMap[metricName] = {};
      }

      // For each label key-value in this series, track them
      for (const [labelKey, labelValue] of Object.entries(series)) {
        // Skip __name__ if you don't want to treat it as a normal label
        if (labelKey === "__name__") continue;

        if (!metricLabelsMap[metricName][labelKey]) {
          metricLabelsMap[metricName][labelKey] = new Set<string>();
        }
        metricLabelsMap[metricName][labelKey].add(labelValue);
      }
    }

    // 4. Combine the metadata and label sets into a final structure
    const combinedData = Object.keys(metadata).map((metricName) => {
      // All metadata entries for this metric name
      const metaEntries = metadata[metricName] || [];

      // All label keys and their possible values for this metric
      const labelsRecord = metricLabelsMap[metricName] || {};
      // Convert that record into an array of { key, values[] }
      const labels = Object.entries(labelsRecord).map(
        ([labelKey, labelValuesSet]) => ({
          labelKey,
          values: Array.from(labelValuesSet),
        }),
      );

      return {
        metricName,
        metadata: metaEntries,
        labels,
      };
    });

    // 5. Return JSON
    return JSON.stringify(combinedData, null, 2);
  };
}
