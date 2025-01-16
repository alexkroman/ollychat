import fs from 'fs';
import path from 'path';
import { OpenAIEmbeddings } from "@langchain/openai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { ChromaClient } from "chromadb";

import * as dotenv from 'dotenv';
dotenv.config();

const enrichedDir = './data/enriched';
const embeddings = new OpenAIEmbeddings({ model: process.env.OPENAI_EMBEDDINGS });
const vectorStore = new Chroma(embeddings, {
  collectionName: process.env.CHROMA_INDEX,
  url: process.env.CHROMA_URL,
});

async function processFile(filePath: string) {
  try {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const inputData = JSON.parse(rawData);

    if (!Array.isArray(inputData)) throw new Error(`Invalid data format in ${filePath}`);

    const documents = inputData.map((item: any) => ({
      id: item.id,
      pageContent: `${item.question} ${item.name} ${item.description} ${item.metrics.join(', ')}`,
      metadata: { question: item.question, metrics: item.metrics.join(', '), query: item.query },
    }));

    await vectorStore.addDocuments(documents);
    console.log(`Added documents from ${filePath}`);
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
  }
}

async function processAllFiles() {
  const files = fs.readdirSync(enrichedDir).filter(file => file.endsWith('.json'));
  for (const file of files) {
    console.log(`Processing ${file}...`);
    await processFile(path.join(enrichedDir, file));
  }
  console.log("Finished processing all files.");
}

(async () => {
  try {
    console.log(`Clearing existing collection: ${process.env.CHROMA_INDEX}`);
    const client = new ChromaClient();
    if (!process.env.CHROMA_INDEX) {
      throw new Error("CHROMA_INDEX environment variable is not defined");
    }
    await client.deleteCollection({ name: process.env.CHROMA_INDEX });
    await processAllFiles();
  } catch (error) {
    console.error("Error:", error.message);
  }
})();