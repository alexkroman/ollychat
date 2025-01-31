import { Client } from "langsmith";
import { config } from "../config/config.js";

const client = new Client({
  apiKey: config.langSmithApiKey,
  apiUrl: config.langSmithApiUrl,
});

const examples: [string, string][] = [["is my k8 cluster too small?", "yes"]];

const inputs = examples.map(([inputPrompt]) => ({
  question: inputPrompt,
}));
const outputs = examples.map(([, outputAnswer]) => ({
  answer: outputAnswer,
}));

const dataset = await client.createDataset("Sample dataset", {
  description: "A sample dataset in LangSmith.",
});

await client.createExamples({
  inputs,
  outputs,
  datasetId: dataset.id,
});
