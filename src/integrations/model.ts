import { ChatOpenAI } from "@langchain/openai";
import { config } from "../config/config.js";
import { logger } from "../utils/logger.js";
import { z } from "zod";

const customHandler = {
  handleLLMStart: async (llm: unknown, prompts: string[]) => {
    if (config.logging) {
      logger.debug("Sending prompt");
      logger.debug(prompts.join("\n---\n"));
    }
  },
};

export const model = new ChatOpenAI({
  openAIApiKey: config.openAIApiKey,
  model: config.openAIModel,
  temperature: 0,
  callbacks: [customHandler],
});

const queryOutput = z.object({
  query: z.string().describe("Syntactically valid PromQL query."),
});

export const queryModel = model.withStructuredOutput(queryOutput);

const answerOutput = z.object({
  answer: z.string().describe("Answer to a user question."),
});

export const answerModel = model.withStructuredOutput(answerOutput);
