import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import * as dotenv from 'dotenv';
dotenv.config();

export const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  model: "gpt-3.5-turbo",
  temperature: 0
});