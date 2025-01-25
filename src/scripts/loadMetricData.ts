import fs from "fs";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { Document } from "@langchain/core/documents";
import { ChromaClient } from "chromadb";
import { config } from "../config/config.js";

// Read and parse the JSON files
const metricsData: MetricItem[] = JSON.parse(
  fs.readFileSync("./data/metrics/metrics.json", "utf-8"),
);
const labelsData: string[] = JSON.parse(
  fs.readFileSync("./data/metrics/labels.json", "utf-8"),
);
const labelValuesData: LabelValueItem[] = JSON.parse(
  fs.readFileSync("./data/metrics/values.json", "utf-8"),
);

// Ensure data integrity
if (
  !Array.isArray(metricsData) ||
  !Array.isArray(labelsData) ||
  !Array.isArray(labelValuesData)
) {
  throw new Error("One or more JSON data files do not contain an array.");
}

// Define TypeScript interfaces
interface MetricItem {
  id: string;
  name: string;
}

interface LabelValueItem {
  label: string;
  value: string;
}

const transformedMetrics: Document[] = metricsData.map((metric, index) => ({
  id: `metric-${index}`,
  pageContent: JSON.stringify(metric),
  metadata: { metric },
}));

const transformedLabels: Document[] = labelsData.map((label, index) => ({
  id: `label-${index}`,
  pageContent: label,
  metadata: { label },
}));

const transformedLabelValues: Document[] = labelValuesData.map(
  (item, index) => ({
    id: `labelValue-${index}`,
    pageContent: item.label,
    metadata: { label: item.label, value: item.value },
  }),
);

const embeddings = new OpenAIEmbeddings({
  model: config.openAIEmbeddings,
});

// Function to handle vector storage
async function storeData(collectionName: string, documents: Document[]) {
  const client = new ChromaClient();
  const existingCollections = await client.listCollections();
  const collectionExists = existingCollections.some(
    (col) => col === collectionName,
  );

  if (collectionExists) {
    console.log(
      `Collection '${collectionName}' already exists. Skipping creation.`,
    );
  } else {
    console.log(`Creating collection '${collectionName}'...`);
    await client.createCollection({ name: collectionName });
  }

  console.log(`Clearing existing data in '${collectionName}'...`);
  await client.deleteCollection({ name: collectionName });

  console.log(`Adding documents to '${collectionName}'...`);
  const vectorStore = new Chroma(embeddings, {
    collectionName,
    url: config.chromaUrl,
  });

  await vectorStore.addDocuments(documents);
  console.log(`Successfully added documents to '${collectionName}'.`);
}

// Execute storage operations for metrics, labels, and label values
(async () => {
  try {
    await Promise.all([
      storeData(config.chromaMetricsIndex, transformedMetrics),
      storeData(config.chromaLabelsIndex, transformedLabels),
      storeData(config.chromaValuesIndex, transformedLabelValues),
    ]);
    console.log("All data successfully stored.");
  } catch (error) {
    console.error("Error storing data:", error);
  }
})();
