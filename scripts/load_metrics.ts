// Import required modules
import fs from 'fs';
import { OpenAIEmbeddings } from "@langchain/openai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import * as dotenv from 'dotenv';
import { Document } from "@langchain/core/documents";
import { ChromaClient } from "chromadb";

dotenv.config();

// Read and parse the JSON file
const rawData = fs.readFileSync('./training_data/metrics/metrics.json', 'utf-8');
const inputData: Document[] = JSON.parse(rawData);

// Ensure the data is an array of documents
if (!Array.isArray(inputData)) {
  throw new Error("Parsed JSON data is not an array of documents");
}

// Transform the data into the desired format
const transformedData: Document[] = inputData.map((item: any) => ({
  id: item.id,
  pageContent: `${item.name}: ${item.help}`,
  metadata: {
    name: item.name,
    help: item.help
  },
}));

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-ada-002",
});

const vectorStore = new Chroma(embeddings, {
  collectionName: process.env.CHROMA_METRICS_INDEX || "prometheus_metrics",
  url: process.env.CHROMA_URL || "http://localhost:8000",
});

// Add documents to vector store
(async () => {
  try {
    const client = new ChromaClient();
    const metricsIndex = process.env.CHROMA_METRICS_INDEX || "default_metrics_index";
    await client.deleteCollection({ name: metricsIndex });
    await vectorStore.addDocuments(transformedData);
    console.log("Documents successfully added to the vector store.");
  } catch (error) {
    console.error("Error adding documents to the vector store:", error);
  }
})();
