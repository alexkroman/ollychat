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

const transformedData: Document[] = inputData.map((item: any) => {
  
  const labelObj: Record<string, string[]> = {};
  
  item.labels.forEach((label: { labelKey: string; values: string[] }) => {
    labelObj[label.labelKey] = label.values;
  });

  const labelLines: string[] = [];
  
  for (const [key, values] of Object.entries(labelObj)) {
    labelLines.push(`  ${key} => ${values.join(", ")}`);
  }

  const pageContentRaw = [
    `Metric Name: ${normalizeQuestion(item.name)}`,
    `Help: ${normalizeQuestion(item.help)}`,
    `Labels:`,
    ...labelLines
  ].join("\n");

  const maxLength = 8000;
  const pageContent =
    pageContentRaw.length > maxLength
      ? pageContentRaw.slice(0, maxLength - 3) + "..."
      : pageContentRaw;

  return {
    id: item.id,
    pageContent: pageContent,
    metadata: {
      name: item.name,
      help: item.help,
      labels: labelObj,
    },
  };
});

const embeddings = new OpenAIEmbeddings({
  model: config.openAIEmbeddings,
});

const vectorStore = new Chroma(embeddings, {
  collectionName: config.chromaMetricsIndex,
  url: config.chromaUrl,
});

// Add documents to vector store
(async () => {
  try {
    const client = new ChromaClient();
    const metricsIndex = config.chromaMetricsIndex;

    const collections: string[] = await client.listCollections();
    const collectionExists = collections.some((col: string) => col === metricsIndex);

    if (collectionExists) {
      console.log(`Collection '${metricsIndex}' already exists. Skipping creation.`);
    } else {
      console.log(`Collection '${metricsIndex}' does not exist. Creating it now.`);
      await client.createCollection({ name: metricsIndex });
    }

    await client.deleteCollection({ name: metricsIndex });
   
    console.log("Transformed Data Page Contents:");
    transformedData.forEach((doc, index) => {
      console.log(`${index + 1}: ${doc.pageContent}`);
    });

    await vectorStore.addDocuments(transformedData);
    console.log("Documents successfully added to the vector store.");
  } catch (error) {
    console.error("Error adding documents to the vector store:", error);
  }
})();
