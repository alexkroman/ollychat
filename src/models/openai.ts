import { ChatOpenAI } from "@langchain/openai";
import { config } from "../config/config.js";
import { logger } from "../utils/logger.js";

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
