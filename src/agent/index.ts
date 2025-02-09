import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { SystemMessage } from "@langchain/core/messages";
import { model } from "../model/index.js";
import { tools } from "../tools/index.js";
import { ollySystemMessage } from "../prompts/systemMessage.js";
import { MessagesAnnotation } from "@langchain/langgraph";

export const agent = createReactAgent({
  llm: model,
  tools,
  stateModifier: async (state: typeof MessagesAnnotation.State) => {
    return [new SystemMessage(ollySystemMessage)].concat(state.messages);
  },
});
