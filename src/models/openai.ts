import { ChatOpenAI } from "@langchain/openai";
import { config } from "../config/config.js";

const customHandler = {
  handleLLMStart: async (llm: unknown, prompts: string[]) => {
    if (config.logging) {
      console.log("Prompt sent to LLM:", prompts.join("\n---\n"));
    }
  },
};

export const model = new ChatOpenAI({
  openAIApiKey: config.openAIApiKey,
  model: config.openAIModel,
  temperature: 0,
  callbacks: [customHandler],
});
