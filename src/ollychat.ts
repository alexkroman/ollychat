import { HumanMessage } from "@langchain/core/messages";
import { app } from "./workflow/index.js";
import { config } from "./config/config.js";

export const answerQuestion = async (inputs: { question: string }) => {
  const messages = [new HumanMessage({ content: inputs.question })];
  const result = await app.invoke({ messages }, config);
  const lastMessage = result.messages[result.messages.length - 1];
  return lastMessage.content;
};
