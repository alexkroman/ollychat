import {
  END,
  START,
  StateGraph,
  MemorySaver,
  MessagesAnnotation,
} from "@langchain/langgraph";
import { Runnable } from "@langchain/core/runnables";

import { loadPromptFromFile } from "./utils/promptLoader.js";
import { DynamicTool } from "@langchain/core/tools";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { config } from "./config/config.js";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { parser } from "@prometheus-io/lezer-promql";

import {
  metricsExampleSelector,
  labelsExampleSelector,
  valuesExampleSelector,
  exampleSelector,
} from "./integrations/vectorStore.js";

import { PrometheusDriver } from "prometheus-query";

const prom = new PrometheusDriver({
  endpoint: config.prometheusUrl,
  baseURL: "/api/v1",
});

export const model = new ChatOpenAI({
  openAIApiKey: config.openAIApiKey,
  model: config.openAIModel,
  temperature: 0.7,
});

const searchTool = new TavilySearchResults({
  maxResults: 1,
});

const queryOutput = z.object({
  query: z
    .string()
    .min(1, "PromQL query cannot be empty.")
    .refine((query) => {
      try {
        const tree = parser.parse(query);
        return tree?.length > 0; // Ensure there's a valid parse tree
      } catch {
        return false;
      }
    }, "Invalid PromQL syntax.")
    .describe("Syntactically valid PromQL (Prometheus) query."),
});

export const queryModel = model.withStructuredOutput(queryOutput);

const agentCheckpointer = new MemorySaver();

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

const prometheusQueryAssistant = new DynamicTool({
  name: "prometheusQueryAssistant",
  description:
    "A tool that queries Prometheus with natural language input. This is helpful whenever a user is asking a question that a an engineer who can effectively query Prometheus could answer",
  func: async (_input: string) => {
    const queryPromptTemplate = loadPromptFromFile("query");
    const [metrics, labels, queries, values, searchContext] = await Promise.all(
      [
        getExamples(_input, metricsExampleSelector, "metric"),
        getExamples(_input, labelsExampleSelector, "label"),
        getExamples(_input, exampleSelector, "query"),
        getExamples(_input, valuesExampleSelector, "value"),
        searchTool.invoke("PromQL syntax to: " + _input),
      ],
    );

    const promptValue = await queryPromptTemplate.invoke({
      input: _input,
      metrics,
      queries,
      values,
      labels,
      searchContext, // Add search context
    });
    console.log(promptValue);
    const promQL = await queryModel.invoke(promptValue, config);
    return prom.instantQuery(promQL.query);
  },
});

const llmReasoningTool = new DynamicTool({
  name: "llmReasoningTool",
  description:
    "A general-purpose reasoning tool that queries an advanced language model to generate insights, analyze data, or assist with open-ended questions.",
  func: async (_input: string) => {
    const result = await model.invoke(_input, config);
    return result.content;
  },
});

const tools = [llmReasoningTool, prometheusQueryAssistant, searchTool];

const agent = await createReactAgent({
  llm: model,
  tools,
  checkpointSaver: agentCheckpointer,
});

const getPlan = async (state: typeof MessagesAnnotation.State) => {
  return agent.invoke({ messages: state.messages }, config);
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
