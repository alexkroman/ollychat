import { Client } from "langsmith";
import { config } from "../config/config.js";

const examples = [
  ["is my k8 cluster too small?", "yes"],
  ["2+2", "4"],
  ["What is the weather in Cleveland, Ohio", "Shows the weather"],
  ["Look up PromQL in StackOverflow", "Searches StackOverflow"],
  [
    "how was apiserver_flowcontrol_demand_seats_bucket over the last 24 hours?",
    "Creates a ranged query",
  ],
  ["what region is my infra running in?", "yes"],
  ["how many alerts?", "yes"],
  ["how many unhealthy nodes?", "yes"],
  ["how many pods are unschedulable?", "yes"],
  ["how many nodes do I have?", "yes"],
  ["what are my vCPUs?", "yes"],
  ["what is my machine type?", "yes"],
  ["is autoscaling on?", "yes"],
  [
    "cpu requested of node gke-ollychat-demo-default-pool-7d2e27be-utyo",
    "It seems that there are currently no CPU requests recorded for the node **gke-ollychat-demo-default-pool-7d2e27be-utyo** in the Kubernetes cluster, as the queries returned no results.",
  ],
  [
    "what is cpu requested of all nodes?",
    "The total CPU requested by all nodes in the Kubernetes cluster is approximately **3.05 CPU** (CPU cores).",
  ],
  [
    "what is cpu requested of all nodes as mCPU",
    "The total CPU requested by all nodes in the Kubernetes cluster is approximately **3054 mCPU** (milliCPU).",
  ],
  [
    "memory requested by node",
    `ai: The memory requested by each node in the Kubernetes cluster is as follows:

1. **Node 1**: Approximately **1,191 MB** (1,191,530,752 bytes)
2. **Node 2**: Approximately **1,189 MB** (1,189,219,200 bytes)
3. **Node 3**: Approximately **998 MB** (997,544,192 bytes)
4. **Node 4**: Approximately **277 MB** (276,824,064 bytes)

These values represent the total memory requested by the pods running on each respective node.`,
  ],
  [
    "memory allocatable by node",
    `ai: The allocatable memory by node in the Kubernetes cluster is as follows:

1. **Node 1**:
   - Allocatable Memory: Approximately **948 MB** (948,371,456 bytes)
   - Total Memory: Approximately **1,123 MB** (1,123,319,808 bytes)
   - Allocatable Percentage: **45.78%**

2. **Node 2**:
   - Allocatable Memory: Approximately **588 MB** (588,279,808 bytes)
   - Total Memory: Approximately **1,483 MB** (1,483,411,456 bytes)
   - Allocatable Percentage: **28.40%**

3. **Node 3**:
   - Allocatable Memory: Approximately **1,194 MB** (1,194,033,152 bytes)
   - Total Memory: Approximately **877 MB** (877,658,112 bytes)
   - Allocatable Percentage: **57.64%**

These values reflect the memory available for pod allocation on each node.`,
  ],
  [
    "restart count by pod",
    "It appears that there are no recorded restart counts for the pods in the Kubernetes cluster, as the query returned no results.",
  ],
  ["is docker working?", "yes"],
  [
    "what is my total memory",
    "The total memory available in the Kubernetes cluster is approximately **43.13 GB** (43,127,729,920 bytes). ",
  ],
  [
    "how many node pools do I have?",
    "There are currently **57 node pools** configured in the Kubernetes cluster.",
  ],
  [
    "what is the pod ip range",
    "The pod IPs in the system fall within a range that includes addresses such as `10.88.0.x` to `10.88.3.x` and `10.128.0.x` to `10.128.0.62`. These indicate the potential IP range for pods in your Kubernetes cluster.",
  ],
  [
    "storage requested?",
    "It appears that there is currently no storage requested by the pods in the Kubernetes cluster",
  ],
  [
    "what is my allocatable storage?",
    "The allocatable storage in the Kubernetes cluster is approximately **3.77 TB** (3,773,265,195,008 bytes) available for use.",
  ],
  [
    "How many pods are running in us-central1",
    "ai: In the us-central1 region, there are currently **46 pods** running.",
  ],
];

const client = new Client({
  apiKey: config.langSmithApiKey,
  apiUrl: config.langSmithEndpoint,
});

const datasetName = "Ollychat";

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
