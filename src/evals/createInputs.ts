import { Client } from "langsmith";
import { config } from "../config/config.js";

const examples = [
  ["is my k8 cluster too small?", "yes"],
  ["what region is my infra running in?", "yes"],
  ["how many alerts?", "yes"],
  ["how many unhealthy nodes?", "yes"],
  ["how many pods are unschedulable?", "yes"],
  ["how many nodes do I have?", "yes"],
  ["what are my vCPUs?", "yes"],
  ["what is my machine type?", "yes"],
  ["is autoscaling on?", "yes"],
  ["cpu requested of node gke-ollychat-demo-default-pool-7d2e27be-utyo", "yes"],
  ["what is cpu requested of all nodes?", "yes"],
  ["what is cpu requested of all nodes as mCPU", "yes"],
  ["memory requested by node", "yes"],
  ["memory allocatable by node", "yes"],
  ["restart count by pod", "yes"],
  ["is docker working?", "yes"],
  ["what is my total memory", "yes"],
  ["how many node pools do I have?", "yes"],
  [
    "what is the pod ip range",
    "The pod IPs in the system fall within a range that includes addresses such as `10.88.0.x` to `10.88.3.x` and `10.128.0.x` to `10.128.0.62`. These indicate the potential IP range for pods in your Kubernetes cluster.",
  ],
  [
    "storage requested",
    "The total requested storage in the system is approximately 10.74 GB.",
  ],
  ["storage allocatable", "yes"],
  [
    "How many pods are running in us-central1",
    "There are 3 node pools in the Kubernetes cluster.",
  ],
];

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
