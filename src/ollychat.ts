import {
  END,
  START,
  StateGraph,
  MemorySaver,
  MessagesAnnotation,
} from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { DynamicTool } from "@langchain/core/tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { config } from "./config/config.js";
import { ollySystemMessage } from "./prompts/systemMessage.js";
import { trimMessages } from "@langchain/core/messages";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { model } from "./model/index.js";
import {
  getMetricNamesTool,
  queryGeneratorTool,
  alertsFetcherTool,
  rangeQueryExecutorTool,
  metricDetailsTool,
  instantQueryExecutorTool,
} from "./tools/prometheus.js";
import { searchTool } from "./tools/search.js";

const agentCheckpointer = new MemorySaver();

const llmReasoningTool = new DynamicTool({
  name: "llmReasoningTool",
  description:
    "A general-purpose reasoning tool that queries an advanced language model to generate insights, analyze data, or assist with open-ended questions.",
  func: async (_input: string) => {
    const result = await model.invoke(_input, config);
    return result.content;
  },
});

const tools = [
  llmReasoningTool,
  getMetricNamesTool,
  queryGeneratorTool,
  rangeQueryExecutorTool,
  alertsFetcherTool,
  metricDetailsTool,
  instantQueryExecutorTool,
  searchTool,
].filter((tool) => tool !== null);

const agent = createReactAgent({
  llm: model,
  tools,
  stateModifier: async (state: typeof MessagesAnnotation.State) => {
    return [new SystemMessage(ollySystemMessage)].concat(state.messages);
  },
});

const getPlan = async (state: typeof MessagesAnnotation.State) => {
  const trimmedMessages = await trimMessages(state.messages, {
    maxTokens: 1000,
    tokenCounter: (msgs) => msgs.length,
    strategy: "last",
    includeSystem: true,
  });
  const result = await agent.invoke({ messages: trimmedMessages }, config);
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

export const app = workflow.compile({
  checkpointer: agentCheckpointer,
});

export const answerQuestion = async (inputs: { question: string }) => {
  const messages = [new HumanMessage({ content: inputs.question })];
  const result = await app.invoke({ messages }, config);
  const lastMessage = result.messages[result.messages.length - 1];
  return lastMessage.content;
};
