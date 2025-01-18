import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  // OpenAI API Configuration
  openAIApiKey: process.env.OPENAI_API_KEY ?? "",
  openAIModel: process.env.OPENAI_MODEL ?? "gpt-4-turbo",
  openAIEmbeddings: process.env.OPENAI_EMBEDDINGS ?? "text-embedding-ada-002",

  // Slack API Configuration
  slackBotToken: process.env.SLACK_BOT_TOKEN ?? "",
  slackSigningSecret: process.env.SLACK_SIGNING_SECRET ?? "",
  slackAppToken: process.env.SLACK_APP_TOKEN ?? "",

  // Server Configuration
  port: Number(process.env.PORT) || 3000,

  // Prometheus Configuration
  prometheusUrl: process.env.PROMETHEUS_URL ?? "https://prometheus.demo.do.prometheus.io",

  // Chroma Vector Store Configuration
  chromaUrl: process.env.CHROMA_URL ?? "http://localhost:8000",
  chromaIndex: process.env.CHROMA_INDEX ?? "prometheus_examples-3",
  chromaMetricsIndex: process.env.CHROMA_METRICS_INDEX ?? "prometheus_metrics",

  // Logging Configuration
  logging: !process.execArgv.includes("--no-warnings"),
};