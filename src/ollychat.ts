import { HumanMessage, ToolMessage } from "@langchain/core/messages";
import { app } from "./workflow/index.js";
import { config } from "./config/config.js";

export const answerQuestion = async (inputs: { question: string }) => {
  const messages = [new HumanMessage({ content: inputs.question })];
  const result = await app.invoke({ messages }, config);
  return result.messages.at(-1)?.content;
};
