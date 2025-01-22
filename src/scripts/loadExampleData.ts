import fs from 'fs';
import path from 'path';
import { OpenAIEmbeddings } from "@langchain/openai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { ChromaClient } from "chromadb";
import { normalizeQuestion } from '../utils/dataNormalizer.js';
import { config } from "../config/config.js";

const enrichedDir = './data/enriched';
const embeddings = new OpenAIEmbeddings({ model: process.env.OPENAI_EMBEDDINGS });
const vectorStore = new Chroma(embeddings, {
  collectionName: config.chromaIndex,
  url: config.chromaUrl,
});

async function processFile(filePath: string) {
  try {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const inputData = JSON.parse(rawData);

    if (!Array.isArray(inputData)) throw new Error(`Invalid data format in ${filePath}`);


    const documents = inputData.map((item: any) => {
      console.log(normalizeQuestion(item.question)); 
      return {
        id: item.id,
        pageContent: normalizeQuestion(item.question),
        metadata: { question: item.question, metrics: item.metrics.join(', '), query: item.query },
      };
    });

    await vectorStore.addDocuments(documents);
    console.log(`Added documents from ${filePath}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error processing file ${filePath}:`, error.message);
    } else {
      console.error(`Uknown Error processing file ${filePath}:`, error);
    }
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
    console.log(`Clearing existing collection: ${config.chromaIndex}`);
    const client = new ChromaClient();
    const chromaIndex = config.chromaIndex;
    const collections: string[] = await client.listCollections();
    const collectionExists = collections.some((col: string) => col === chromaIndex);

    if (collectionExists) {
      console.log(`Collection '${chromaIndex}' already exists. Skipping creation.`);
    } else {
      console.log(`Collection '${chromaIndex}' does not exist. Creating it now.`);
      await client.createCollection({ name: chromaIndex });
    }

    await client.deleteCollection({ name: config.chromaIndex });
    await processAllFiles();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("Unkonwn Error:", error);
    }
  }
})();