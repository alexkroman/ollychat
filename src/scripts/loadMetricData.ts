// Import required modules
import fs from 'fs';
import { OpenAIEmbeddings } from "@langchain/openai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { Document } from "@langchain/core/documents";
import { ChromaClient } from "chromadb";
import { normalizeQuestion } from '../utils/dataNormalizer.js';
import { config } from "../config/config.js";


// Read and parse the JSON file
const rawData = fs.readFileSync('./data/metrics/metrics.json', 'utf-8');
const inputData: Document[] = JSON.parse(rawData);

// Ensure the data is an array of documents
if (!Array.isArray(inputData)) {
  throw new Error("Parsed JSON data is not an array of documents");
}

// Transform the data into the desired format
const transformedData: Document[] = inputData.map((item: any) => ({
  id: item.id,
  pageContent: `${normalizeQuestion(item.name)}: ${normalizeQuestion(item.help)}`,
  metadata: {
    name: item.name,
    help: item.help
  },
}));

const embeddings = new OpenAIEmbeddings({
  model: config.openAIEmbeddings,
});

const vectorStore = new Chroma(embeddings, {
  collectionName: config.chromaIndex,
  url: config.chromaUrl,
});

// Add documents to vector store
(async () => {
  try {
    const client = new ChromaClient();
    const metricsIndex = config.chromaMetricsIndex;
    await client.deleteCollection({ name: metricsIndex });
    await vectorStore.addDocuments(transformedData);
    console.log("Documents successfully added to the vector store.");
  } catch (error) {
    console.error("Error adding documents to the vector store:", error);
  }
})();
