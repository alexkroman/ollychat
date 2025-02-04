import { evaluate } from "langsmith/evaluation";
import { config } from "../config/config.js";
import { app } from "../ollychat.js";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import type { EvaluationResult } from "langsmith/evaluation";
import OpenAI from "openai";

const openai = new OpenAI();

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

const instructions = `Evaluate Student Answer against Ground Truth for conceptual similarity and classify true or false: 
- False: No conceptual match and similarity
- True: Most or full conceptual match and similarity
- Key criteria: Concept should match, not exact wording.
`;

// Define context for the LLM judge evaluator
const context = `Ground Truth answer: {reference}; Student's Answer: {prediction}`;

// Define output schema for the LLM judge
const ResponseSchema = z.object({
  score: z
    .boolean()
    .describe(
      "Boolean that indicates whether the response is accurate relative to the reference answer",
    ),
});

async function accuracy({
  outputs,
  referenceOutputs,
}: {
  outputs?: Record<string, string>;
  referenceOutputs?: Record<string, string>;
}): Promise<EvaluationResult> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: instructions },
      {
        role: "user",
        content: context
          .replace("{prediction}", outputs?.answer || "")
          .replace("{reference}", referenceOutputs?.answer || ""),
      },
    ],
    response_format: zodResponseFormat(ResponseSchema, "response"),
  });

  return {
    key: "accuracy",
    score: ResponseSchema.parse(
      JSON.parse(response.choices[0].message.content || ""),
    ).score,
  };
}

async function runEval() {
  await evaluate(runGraph, {
    data: "Dataset update",
    experimentPrefix: "Ask Ollychat question",
    evaluators: [accuracy],
  });
}

runEval().catch(console.error);
