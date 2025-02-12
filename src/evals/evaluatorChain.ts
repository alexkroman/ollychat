import { evaluate } from "langsmith/evaluation";
import { config } from "../config/config.js";
import { app } from "../workflow/index.js";

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

async function runEval() {
  try {
    await evaluate(runGraph, {
      data: "Ollychat",
      experimentPrefix: "Ask Ollychat question",
      maxConcurrency: 1,
    });
  } catch (error) {
    console.error("Error during evaluation:", error);
  }
}

runEval();
