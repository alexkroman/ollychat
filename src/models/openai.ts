import { ChatOpenAI } from "@langchain/openai";
import { config } from "../tools/config.js";

const customHandler = {
  handleLLMStart: async (llm: any, prompts: string[]) => {
    if (config.logging) {
      console.log("Prompt sent to LLM:", prompts.join("\n---\n"));
    }
  },
};

export const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  model: process.env.OPENAI_MODEL,
  temperature: 0,
  callbacks: [customHandler]
});

