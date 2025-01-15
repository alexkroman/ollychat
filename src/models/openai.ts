import { ChatOpenAI } from "@langchain/openai";
import { awaitAllCallbacks } from "@langchain/core/callbacks/promises";

import * as dotenv from 'dotenv';
dotenv.config();

const logging = !process.execArgv.includes('--no-warnings');

const customHandler = {
  handleLLMStart: async (llm: any, prompts: string[]) => {
    if (logging) {
      // Log the exact prompt text sent to the LLM
      //console.log("Prompt sent to LLM:", prompts.join("\n---\n"));
    }
  },
};

export const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  model: process.env.OPENAI_MODEL,
  temperature: 0,
  callbacks: [customHandler]
});

