import {
  END,
  START,
  StateGraph,
  MemorySaver,
  MessagesAnnotation,
} from "@langchain/langgraph";

import { agent } from "../agent/index.js";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { tools } from "../tools/index.js";
import { trimMessages } from "@langchain/core/messages";
import { config } from "../config/config.js";

const agentCheckpointer = new MemorySaver();

const toolNodeForGraph = new ToolNode(tools);

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

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", getPlan)
  .addNode("tools", toolNodeForGraph)
  .addEdge(START, "agent")
  .addConditionalEdges("agent", shouldContinue, ["tools", END])
  .addEdge("tools", "agent");

export const app = workflow.compile({
  checkpointer: agentCheckpointer,
});
