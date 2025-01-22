import { ChromaClient } from "chromadb";
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


async function testChromaConnection() {
  try {
    const chroma = new ChromaClient({ path: config.chromaUrl });
    const collectionNames = (await chroma.listCollections()).map(name => name);

    [config.chromaIndex, config.chromaMetricsIndex].forEach(index => {
      if (!collectionNames.includes(index)) {
        throw new Error(`Chroma index "${index}" does not exist. Please run npm run load-data to create it.`);
      }
    });
  } catch (error) {
    console.error("Error connecting to Chroma:", error);
    process.exit(1);
  }
}

await testChromaConnection();
