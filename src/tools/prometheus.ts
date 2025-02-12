import * as chrono from "chrono-node";
import { DynamicTool, tool } from "@langchain/core/tools";
import { PrometheusDriver } from "prometheus-query";
import { z } from "zod";
import { config } from "../config/config.js";
import { model } from "../model/index.js";
import { PromptTemplate } from "@langchain/core/prompts";
import { getQueries } from "../prompts/getQueries.js";
import { parser } from "@prometheus-io/lezer-promql";

const prom = new PrometheusDriver({
  endpoint: config.prometheusUrl,
  baseURL: "/api/v1",
});

let metricNamesCache: string | null = null;

export const getMetricNamesTool = new DynamicTool({
  name: "getMetricNames",
  description: "Fetches and caches the list of metric names from Prometheus.",
  func: async (): Promise<string> => {
    if (!metricNamesCache) {
      const metricQuery = await prom.instantQuery(
        'count by (__name__)({__name__!=""}) > 100',
      );
      metricNamesCache = metricQuery.result
        .map((entry: { metric: { name: string } }) => entry.metric.name)
        .join(", ");
    }
    return metricNamesCache;
  },
});

export const alertsFetcherTool = new DynamicTool({
  name: "alertsFetcherTool",
  description:
    "Fetches current active alerts from Prometheus to provide insights on ongoing incidents.",
  func: async (): Promise<string> => {
    const response = await prom.alerts();
    return JSON.stringify(response);
  },
});

export const queryGeneratorTool = new DynamicTool({
  name: "queryGeneratorTool",
  description:
    "This tool transforms user input into Prometheus queries and results about infrastructure, services, and system performance. It is invoked when a user asks a question answerable by an engineer or observability tool, such as queries about CPU usage, storage, disk, error rates, latency, or other metrics. By leveraging Prometheus data, it provides real-time, actionable insights into system health and performance.",
  func: async (input: string): Promise<string> => {
    const getQueriesPromptTemplate = PromptTemplate.fromTemplate(getQueries);
    const queryPromptValue = await getQueriesPromptTemplate.invoke({
      input,
      metricResults: await getMetricNamesTool.func(""),
    });
    const queryResults = await model.invoke(queryPromptValue, config);
    return JSON.stringify(queryResults.content);
  },
});

export const metricDetailsTool = new DynamicTool({
  name: "metricDetailsTool",
  description:
    "Retrieves detailed information for a specified metric, including its labels and recent data points. The input should be a Prometheus Metric Name",
  func: async (input: string): Promise<string> => {
    const query = `group by (__name__) ({__name__="${input}"})`;
    const response = await prom.instantQuery(query);
    const series = response.result;
    let result = "";
    series.forEach((serie) => {
      result += "Metric: " + serie.metric + "\n";
      result += "Timestamp: " + serie.value.time + "\n";
      result += "Value: " + serie.value.value + "\n";
    });
    return result;
  },
});

function validatePromQLQuery(query: string): boolean {
  const tree = parser.parse(query);
  return tree.cursor().node.type.isError === false;
}

const instantQueryExecutorSchema = z.object({
  query: z
    .string()
    .describe("Single Syntatically valid PromQL query")
    .min(1, "Query cannot be empty")
    .max(1000, "Query is too long")
    .refine((query) => validatePromQLQuery(query), {
      message: "Invalid PromQL syntax",
    }),
});

export const instantQueryExecutorTool = tool(
  async ({ query }) => {
    let result = "";
    const response = await prom.instantQuery(query);
    const series = response.result;
    series.forEach((serie) => {
      result += "Metric: " + serie.metric.toString() + "\n";
      result += "Timestamp: " + serie.value.time + "\n";
      result += "Value: " + serie.value.value + "\n";
    });
    return [result, { query: query }];
  },
  {
    name: "instantQueryExecutorTool",
    schema: instantQueryExecutorSchema,
    responseFormat: "content_and_artifact",
    description:
      "Executes a PromQL instant query (no from and to timestamps) and returns the results.",
  },
);

const rangeQueryExecutorSchema = z.object({
  query: z
    .string()
    .describe("Single Syntatically valid PromQL query")
    .min(1, "Query cannot be empty")
    .max(1000, "Query is too long")
    .refine((query) => validatePromQLQuery(query), {
      message: "Invalid PromQL syntax",
    }),
  startString: z.string().describe("Text describing start date and time"),
  endString: z.string().describe("Text describing end date and time"),
});

export const rangeQueryExecutorTool = tool(
  async ({
    query,
    startString,
    endString,
  }: {
    query: string;
    startString: string;
    endString: string;
  }) => {
    const start: Date =
      chrono.parseDate(startString) ||
      chrono.parseDate("30 minutes ago") ||
      new Date();
    const end: Date = chrono.parseDate(endString) || new Date();

    const step: number = 6 * 60 * 60;
    const response = await prom.rangeQuery(query, start, end, step);

    let result = "";
    response.result.forEach((serie) => {
      result += "Serie:" + serie.metric.toString() + "\n";
      result += "Values:\n" + serie.values.join("\n");
    });
    return { result, query };
  },
  {
    name: "rangeQueryExecutorTool",
    description:
      "Executes a PromQL ranged query. Requires query, from time (as text parseable by chrono-time), and to time (as text parseable by chrono-time).",
    schema: rangeQueryExecutorSchema,
    responseFormat: "content_and_artifact",
  },
);
