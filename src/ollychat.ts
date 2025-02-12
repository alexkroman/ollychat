import _ from "lodash";
import { HumanMessage, ToolMessage } from "@langchain/core/messages";
import { app } from "./workflow/index.js";
import { config } from "./config/config.js";

export const answerQuestion = async (inputs: { question: string }) => {
  const messages = [new HumanMessage({ content: inputs.question })];
  const result = await app.invoke({ messages }, config);
  const lastHumanIndex = _.findLastIndex(
    result.messages,
    (msg) => msg instanceof HumanMessage,
  );
  const queries = _.chain(result.messages)
    .slice(lastHumanIndex + 1)
    .filter(
      (msg) =>
        msg instanceof ToolMessage &&
        _.has(msg, "artifact.query") &&
        !_.isEmpty(_.get(msg, "content", "")),
    )
    .map((msg) => _.get(msg, "artifact.query", null))
    .compact()
    .value();

  const formattedQueries = queries.length
    ? queries.map((query) => `- ${query}`).join("\n") + "\n\n"
    : "";

  const lastMessage = result.messages.at(-1)?.content || "";
  return formattedQueries + lastMessage;
};
