import { z } from "zod";
import { model } from "../models/openai.js";

const queryOutput = z.object({
  explanation: z
    .string()
    .describe("Description of what the PromQL query does."),
  query: z.string().describe("Syntactically valid PromQL query."),
});

export const promModel = model.withStructuredOutput(queryOutput);
