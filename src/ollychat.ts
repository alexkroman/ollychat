import {
  END,
  START,
  StateGraph,
  MemorySaver,
  MessagesAnnotation,
} from "@langchain/langgraph";
import { Runnable } from "@langchain/core/runnables";

import { v4 as uuidv4 } from "uuid";

import { model } from "./integrations/model.js";
import { prometheusQueryTool } from "./integrations/prometheus.js";
import { loadPromptFromFile } from "./utils/promptLoader.js";
//import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { queryModel } from "./integrations/model.js";
import { DynamicTool } from "@langchain/core/tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

import {
  metricsExampleSelector,
  labelsExampleSelector,
  valuesExampleSelector,
  exampleSelector,
} from "./integrations/vectorStore.js";

//const searchTool = new TavilySearchResults().asTool;

const agentCheckpointer = new MemorySaver();

const config = { configurable: { thread_id: uuidv4() } };

interface ExampleItem {
  metadata?: Record<string, string | undefined>;
}

export async function getExamples(
  input: string,
  selector: Runnable<string, ExampleItem[]>,
  key: string,
): Promise<Array<Record<string, string | undefined>>> {
  const examples = await selector.invoke(input, config);
  return examples.map((ex) => ({
    [key]: ex.metadata?.[key],
  }));
}

const promQLTool = new DynamicTool({
  name: "PromQL",
  description: "A tool for querying Prometheus.",
  func: async (_input: string) => {
    const queryPromptTemplate = loadPromptFromFile("query");

    const metrics = await getExamples(_input, metricsExampleSelector, "metric");
    const labels = await getExamples(_input, labelsExampleSelector, "label");
    const queries = await getExamples(_input, exampleSelector, "query");
    const values = await getExamples(_input, valuesExampleSelector, "value");

    const promptValue = await queryPromptTemplate.invoke({
      input: _input,
      metrics,
      queries,
      values,
      labels,
    });

    const result = await queryModel.invoke(promptValue, config);
    return prometheusQueryTool.invoke({ query: result.query });
  },
});

const LLMTool = new DynamicTool({
  name: "LLM",
  description: "A tool for querying the language model.",
  func: async (_input: string) => {
    const result = await model.invoke(_input, config);
    return result.content;
  },
});

const tools = [LLMTool, promQLTool];

const getPlan = async (state: typeof MessagesAnnotation.State) => {
  const agent = await createReactAgent({
    llm: model,
    tools,
    checkpointSaver: agentCheckpointer,
  });

  const result = await agent.invoke({ messages: state.messages }, config);

  return result;
};

const shouldContinue = (state: typeof MessagesAnnotation.State) => {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1];
  if (
    "tool_calls" in lastMessage &&
    Array.isArray(lastMessage.tool_calls) &&
    lastMessage.tool_calls?.length
  ) {
    return "tools";
  }
  return END;
};

const toolNodeForGraph = new ToolNode(tools);

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", getPlan)
  .addNode("tools", toolNodeForGraph)
  .addEdge(START, "agent")
  .addConditionalEdges("agent", shouldContinue, ["tools", END])
  .addEdge("tools", "agent");

const app = workflow.compile({
  checkpointer: agentCheckpointer,
});

export const answerQuestion = async (inputs: { question: string }) => {
  const input = [
    {
      role: "user",
      content: inputs.question,
    },
  ];
  return await app.invoke({ messages: input }, config);
};
