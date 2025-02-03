import { Client } from "langsmith";
import { config } from "../config/config.js";

const examples = [["is my k8 cluster too small?", "yes"]];

const client = new Client({
  apiKey: config.langSmithApiKey,
  apiUrl: config.langSmithApiUrl,
});

const datasetName = "Dataset update";

// Fetch existing datasets and delete if one with the same name exists
const existingDatasets = [];
for await (const dataset of client.listDatasets()) {
  existingDatasets.push(dataset);
}
const datasetToDelete = existingDatasets.find(
  (dataset) => dataset.name === datasetName,
);

if (datasetToDelete) {
  await client.deleteDataset({ datasetId: datasetToDelete.id });
  console.log(`Deleted existing dataset: ${datasetName}`);
}

// Create new dataset
const dataset = await client.createDataset(datasetName, {
  description: "A sample dataset in LangSmith.",
});

console.log(`Created new dataset: ${datasetName}`);

const inputs = examples.map(([inputPrompt]) => ({
  question: inputPrompt,
}));
const outputs = examples.map(([, outputAnswer]) => ({
  answer: outputAnswer,
}));

await client.createExamples({
  inputs,
  outputs,
  datasetId: dataset.id,
});

console.log("Added examples to dataset.");
