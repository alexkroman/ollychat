import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { z } from "zod";
import { FewShotPromptTemplate, PromptTemplate } from "@langchain/core/prompts";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { SemanticSimilarityExampleSelector } from "@langchain/core/example_selectors";
import { examples } from "./training.js";
import { Annotation } from "@langchain/langgraph";
import { createQueryExecutor, createMetadataFetcher } from './prometheus.js';
import * as dotenv from 'dotenv';

dotenv.config();

const InputStateAnnotation = Annotation.Root({
  question: Annotation<string>,
});

const StateAnnotation = Annotation.Root({
  question: Annotation<string>,
  query: Annotation<string>,
  result: Annotation<string>,
  answer: Annotation<string>,
});

const prometheusUrl = process.env.PROMETHEUS_URL || 'http://localhost:9090'

// Initialize Prometheus clients
const getPromMetadata = createMetadataFetcher(prometheusUrl);

const exampleSelector = await SemanticSimilarityExampleSelector.fromExamples<typeof MemoryVectorStore>(
  examples,
  new OpenAIEmbeddings(),
  MemoryVectorStore, {
  k: 5,
  inputKeys: ['question']
}
);

const examplePrompt = PromptTemplate.fromTemplate(
  `Question: {question}\nPromQL: {query}`
);

const queryPromptTemplate = new FewShotPromptTemplate({
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
    
    User question: {question}

    Below are a number of examples of questions and their corresponding PromQL queries.`,
  suffix: "Input: {question}\nPromQL query: ",
  inputVariables: ["metadata", "question"]
});

const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  model: "gpt-3.5-turbo",
  temperature: 0
});

const queryOutput = z.object({
  explanation: z.string().describe("Description of what the PromQL query does."),
  query: z.string().describe("Syntactically valid PromQL query."),
});

const structuredModel = model.withStructuredOutput(queryOutput);

const writeQuery = async (state: typeof InputStateAnnotation.State) => {
  const promptValue = await queryPromptTemplate.invoke({
    metadata: await getPromMetadata(),
    question: state.question,
  });
  const result = await structuredModel.invoke(promptValue);
  return { query: result.query, explanation: result.explanation };
};

export {
  writeQuery
};