import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { config } from "../config/appConfig.js";

const embeddings = new OpenAIEmbeddings({
    model: config.openAIEmbeddings,
});

export const vectorStore = new Chroma(embeddings, {
    collectionName: config.chromaIndex,
    url: config.chromaUrl
});
  
export const MetricsVectorStore = new Chroma(embeddings, {
    collectionName: config.chromaMetricsIndex,
    url: config.chromaUrl
});