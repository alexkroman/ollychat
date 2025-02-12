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
import { config } from "../config/config.js";
import { HumanMessage } from "@langchain/core/messages";
import _ from "lodash";

const agentCheckpointer = new MemorySaver();
const toolNodeForGraph = new ToolNode(tools);

const getPlan = async (state: typeof MessagesAnnotation.State) => {
  const { messages } = state;

  const humanMessageIndexes = _.chain(messages)
    .map((msg, index) => ({ msg, index }))
    .filter(({ msg }) => msg instanceof HumanMessage) // Correctly check for HumanMessage type
    .map("index")
    .value();

  const cutoffIndex =
    humanMessageIndexes.length > 2
      ? humanMessageIndexes[humanMessageIndexes.length - 2]
      : 0;

  const updatedMessages = _.slice(messages, cutoffIndex);

  const result = await agent.invoke({ messages: updatedMessages }, config);
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
