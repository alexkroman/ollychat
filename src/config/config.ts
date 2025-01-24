import { requireEnv } from "../utils/config.js";

import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  // OpenAI API Configuration
  openAIApiKey: requireEnv("OPENAI_API_KEY"),
  openAIModel: requireEnv("OPENAI_MODEL"),
  openAIEmbeddings: requireEnv("OPENAI_EMBEDDINGS"),

  // Prometheus Configuration
  prometheusUrl: requireEnv("PROMETHEUS_URL"),

  // Chroma Vector Store Configuration
  chromaUrl: requireEnv("CHROMA_URL"),
  chromaIndex: requireEnv("CHROMA_INDEX"),
  chromaMetricsIndex: requireEnv("CHROMA_METRICS_INDEX"),

  // Logging Configuration
  logging: !process.execArgv.includes("--no-warnings"),
};
