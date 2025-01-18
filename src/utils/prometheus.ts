import { createQueryExecutor } from '../integrations/prometheusIntegration.js';
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { config } from "../config/config.js";

const prometheusUrl = config.prometheusUrl
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