import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import type { EvaluationResult } from "langsmith/evaluation";
import { evaluate } from "langsmith/evaluation";
import OpenAI from "openai";
import { config } from "../config/config.js";
import { answerQuestion } from "../ollychat.js";

const openai = new OpenAI({ apiKey: config.openAIApiKey });

// Define instructions for the LLM judge evaluator
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

// Define LLM judge that grades the accuracy of the response relative to reference output
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

// After running the evaluation, a link will be provided to view the results in langsmith
await evaluate(
  (exampleInput) => {
    return answerQuestion(exampleInput.question);
  },
  {
    data: "Sample dataset",
    evaluators: [
      accuracy,
      // can add multiple evaluators here
    ],
    experimentPrefix: "first-eval-in-langsmith",
    maxConcurrency: 2,
  },
);
