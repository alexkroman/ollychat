import {
  END,
  START,
  StateGraph,
  MemorySaver,
  MessagesAnnotation,
} from "@langchain/langgraph";

import { loadPromptFromFile } from "./utils/promptLoader.js";
import { DynamicTool } from "@langchain/core/tools";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { config } from "./config/config.js";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
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

const metricSchema = z.object({
  name: z.string().describe("The name of the PromQL Metric"),
  description: z
    .string()
    .describe(
      "A description of the PromQL metric that an LLM can use to determine how to best create a promQL query",
    ),
});

const metricOutput = z.object({
  metrics: z.array(metricSchema),
});

const metricModel = model.withStructuredOutput(metricOutput);

const queriesSchema = z.object({
  query: z.string().describe("A snytatically valid PromQL query"),
  description: z.string().describe("A description of the PromQL query"),
});

const queriesOutput = z.object({
  queries: z.array(queriesSchema),
});

const queriesModel = model.withStructuredOutput(queriesOutput);

const agentCheckpointer = new MemorySaver();

const prometheusQueryAssistant = new DynamicTool({
  name: "systemAssistant",
  description:
    "A tool that turns user input into prometheus results about infrastructure and services. Use this whenever a user has input that an AI who knows everything about a system, infrastructure, and services could answer.",
  func: async (_input: string): Promise<Record<string, unknown>> => {
    try {
      const getMetricsPromptTemplate = loadPromptFromFile("getMetrics");

      const metricQuery = await prom.instantQuery(
        'group by(__name__) ({__name__!=""})',
      );

      const metricNames = metricQuery.result
        .map((entry: { metric: { name: string } }) => entry.metric.name)
        .join(", ");

      const promptValue = await getMetricsPromptTemplate.invoke({
        input: _input,
        metricNames,
      });

      const metricResults = (await metricModel.invoke(promptValue, config))
        .metrics;

      const getQueriesPromptTemplate = loadPromptFromFile("getQueries");

      const queryPromptValue = await getQueriesPromptTemplate.invoke({
        input: _input,
        metricResults,
      });

      const queryResults = await queriesModel.invoke(queryPromptValue, config);

      const queryPromises = queryResults.queries.map(
        async ({
          query,
          description,
        }: {
          query: string;
          description: string;
        }) => {
          let result = "";
          await prom.instantQuery(query).then((res) => {
            const series = res.result;
            series.forEach((serie) => {
              result += "Metric:" + serie.metric.toString() + "\n";
              result += "Timestamp:" + serie.value.time + "\n";
              result += "Value:" + serie.value.value + "\n";
            });
          });
          return { query, description, result };
        },
      );

      const results: Record<string, unknown> = {};
      const resolvedQueries = await Promise.all(queryPromises);

      resolvedQueries.forEach(({ query, description, result }) => {
        results[query] = { description, result };
      });

      console.log("Final results:", results);
      return results;
    } catch (error) {
      console.error("Error in systemAssistant tool:", error);
      return { error: (error as Error).message || "An unknown error occurred" };
    }
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
