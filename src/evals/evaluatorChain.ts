import { type Example, Run } from "langsmith";
import { evaluate, EvaluationResult } from "langsmith/evaluation";
import { config } from "../config/config.js";
import { app } from "../ollychat.js";

const runGraph = async (
  input: Record<string, unknown>,
): Promise<Record<string, unknown>> => {
  if (!input.question || typeof input.question !== "string") {
    throw new Error(
      "Invalid input: 'question' field is required and must be a string.",
    );
  }
  const formattedInput = {
    messages: [
      {
        role: "user",
        content: input.question,
      },
    ],
  };

  return await app.invoke(formattedInput, config);
};

const evaluatePost = (run: Run, example?: Example): EvaluationResult => {
  if (!example) {
    throw new Error("No example provided");
  }
  if (!example.outputs) {
    throw new Error("No example outputs provided");
  }
  if (!run.outputs) {
    throw new Error("No run outputs provided");
  }

  // TODO: Implement evaluation logic
  throw new Error("Evaluation logic not implemented");
};

async function runEval() {
  const datasetName = "Sample dataset";
  await evaluate(runGraph, {
    data: datasetName,
    evaluators: [evaluatePost],
    experimentPrefix: "Ask Ollychat question",
  });
}

runEval().catch(console.error);
