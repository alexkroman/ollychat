import { Chroma } from "@langchain/community/vectorstores/chroma";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import * as dotenv from 'dotenv';
dotenv.config();

const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-ada-002",
});

export const vectorStore = new Chroma(embeddings, {
    collectionName: process.env.CHROMA_INDEX || 'prometheus_examples-2',
    url: process.env.CHROMA_URL || "http://localhost:8000", // Optional, will default to this value
});
  
export const MetricsVectorStore = new Chroma(embeddings, {
    collectionName: process.env.CHROMA_METRICS_INDEX || 'prometheus_metrics',
    url: process.env.CHROMA_URL || "http://localhost:8000", // Optional, will default to this value
});