// Import required modules
import fs from 'fs';
import { OpenAIEmbeddings } from "@langchain/openai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import * as dotenv from 'dotenv';
import { Document } from "@langchain/core/documents";
import { ChromaClient } from "chromadb";

dotenv.config();

// Read and parse the JSON file
const rawData = fs.readFileSync('./training_data/enriched/grafana_dashboards/1860_rev37.json', 'utf-8');
const inputData: Document[] = JSON.parse(rawData);

// Ensure the data is an array of documents
if (!Array.isArray(inputData)) {
  throw new Error("Parsed JSON data is not an array of documents");
}

// Transform the data into the desired format
const transformedData: Document[] = inputData.map((item: any) => ({
  id: item.id,
  pageContent: `${item.question} ${item.name} ${item.description} ${item.metrics.join(', ')}`,
  metadata: {
    question: item.question,
    metrics: item.metrics.join(', '),
    query: item.query
  },
}));

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-ada-002",
});

const vectorStore = new Chroma(embeddings, {
  collectionName: process.env.CHROMA_INDEX,
  url: process.env.CHROMA_URL,
});

// Add documents to vector store
(async () => {
  try {
    const client = new ChromaClient();
    const chromaIndex = process.env.CHROMA_INDEX || "default_metrics_index";
    await client.deleteCollection({ name: chromaIndex });
    await vectorStore.addDocuments(transformedData);
    console.log("Documents successfully added to the vector store.");
  } catch (error) {
    console.error("Error adding documents to the vector store:", error);
  }
})();
