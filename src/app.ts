import slack from '@slack/bolt';
const { App } = slack;
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { FewShotPromptTemplate, PromptTemplate } from "@langchain/core/prompts";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { SemanticSimilarityExampleSelector } from "@langchain/core/example_selectors";
import { examples } from "./training.js";
import { Annotation } from "@langchain/langgraph";
import { createQueryExecutor,createMetadataFetcher } from './prometheus.js';

import * as dotenv from 'dotenv';
dotenv.config();

const PROMETHEUS_URL = process.env.PROMETHEUS_URL || 'http://localhost:9090';
const getPromMetadata = createMetadataFetcher(PROMETHEUS_URL);

const InputStateAnnotation = Annotation.Root({
  question: Annotation<string>,
});

const StateAnnotation = Annotation.Root({
  question: Annotation<string>,
  query: Annotation<string>,
  result: Annotation<string>,
  answer: Annotation<string>,
});

const exampleSelector = await SemanticSimilarityExampleSelector.fromExamples<typeof MemoryVectorStore>(examples, new OpenAIEmbeddings(), MemoryVectorStore, {
  k: 5,
  inputKeys: ["question"],
});

const examplePrompt = PromptTemplate.fromTemplate(
  `Question: {input}\nPromQLQuery: {query}`
);

const prompt = new FewShotPromptTemplate({
  exampleSelector,
  examplePrompt,
  prefix: `
  You are a PromQL expert. 
  Given an input question, first create a syntactically correct PromQL query to run, 
  then look at the results of the query and return the answer to the input question.
  You must query only the metadata that are needed to answer the question. 
  Pay attention to use only the metadata you can see in the metadata below. 
  Be careful to not query for metadata that do not exist.

  Use the following format:

  Question: "Question here"
  PromQLQuery: "PromQL Query to run"
  PromQLResult: "Result of the PromQLQuery"
  Answer: "Final answer here"

  Only use the following metadata:
  {metadata}

  Question: {input}
  
  Below are a number of examples of questions and their corresponding PromQL queries.`,
  suffix: "Question: {input}\nPromQL query: ",
  inputVariables: ["input", "metadata"],
});

const queryOutput = z.object({
  query: z.string().describe("Syntactically valid PromQL query."),
});

const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4o-mini",
  temperature: 0,
});

const structuredModel = model.withStructuredOutput(queryOutput);

const writeQuery = async (state: typeof InputStateAnnotation.State) => {
  const promptValue = await prompt.invoke({
    metadata: await getPromMetadata(),
    input: state.question,
  });
  const result = await structuredModel.invoke(promptValue);
  return { query: result.query };
};

// Initialize Bolt app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

app.event('app_mention', async ({ event, say }) => {
  try {
    const messageText = (event as { text: string }).text;
    console.log('Received a message event:', messageText); 
    const results = await writeQuery({ question: messageText });
    await say(results.query);

  } catch (error: unknown) {
    console.error('An error occurred:', error);
    await say('Sorry, I encountered an error while generating the PromQL query. Please try again later.');
  }
});

// Start your app
(async () => {
  const port = process.env.PORT || 3000;
  await app.start(port);
  console.log(`⚡️ Bolt app is running on port ${port}!`);
})();