import { requireEnv } from "../utils/config.js";

import { v4 as uuidv4 } from "uuid";
import * as dotenv from "dotenv";

dotenv.config();

const langsmithTracing = requireEnv("LANGSMITH_TRACING") === "true";
const graphRecursionLimit = requireEnv("GRAPH_RECURSION_LIMIT");
const modelProvider = requireEnv("MODEL_PROVIDER");
const modelApiKey =
  modelProvider != "ollama" ? requireEnv("MODEL_API_KEY") : "";
const tavilyApiKey = process.env.TAVILY_API_KEY || null;
const modelBaseUrl = process.env.MODEL_BASE_URL || "http://localhost:11434";

const tavilyEnabled = !!tavilyApiKey;

export const config = {
  modelProvider,
  modelApiKey,
  model: requireEnv("MODEL"),
  prometheusUrl: requireEnv("PROMETHEUS_URL"),
  tavilyApiKey,
  telemetry: requireEnv("TELEMETRY"),
  tavilyEnabled,
  modelBaseUrl,
  langsmithTracing,
  langSmithEndpoint: langsmithTracing
    ? requireEnv("LANGSMITH_ENDPOINT")
    : "https://api.smith.langchain.com",
  langSmithApiKey: langsmithTracing
    ? requireEnv("LANGSMITH_API_KEY")
    : "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",
  langSmithProject: langsmithTracing
    ? requireEnv("LANGSMITH_PROJECT")
    : "Ollychat",
  logging: !process.execArgv.includes("--no-warnings"),
  configurable: { thread_id: uuidv4(), recursionLimit: graphRecursionLimit },
};
