import { createQueryExecutor } from '../connectors/prometheus.js';
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import * as dotenv from 'dotenv';
dotenv.config();

const prometheusUrl = process.env.PROMETHEUS_URL || 'http://localhost:9090'
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