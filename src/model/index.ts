import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { config } from "../config/config.js";

export const model =
  config.modelProvider === "anthropic"
    ? new ChatAnthropic({
        anthropicApiKey: config.modelApiKey,
        model: config.model,
        temperature: 0,
      })
    : new ChatOpenAI({
        openAIApiKey: config.modelApiKey,
        model: config.model,
        temperature: 0,
      });