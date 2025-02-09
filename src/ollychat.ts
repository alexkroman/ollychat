import {
  END,
  START,
  StateGraph,
  MemorySaver,
  MessagesAnnotation,
} from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { DynamicTool } from "@langchain/core/tools";
import { BufferMemory } from "langchain/memory";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { config } from "./config/config.js";
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { z } from "zod";
import { PrometheusDriver } from "prometheus-query";
import { PromptTemplate } from "@langchain/core/prompts";
import { parser } from "@prometheus-io/lezer-promql";
import { getQueries } from "./prompts/getQueries.js";
import { ollySystemMessage } from "./prompts/systemMessage.js";
import * as chrono from "chrono-node";
import { trimMessages } from "@langchain/core/messages";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { StackExchangeAPI } from "@langchain/community/tools/stackexchange";
import { Calculator } from "@langchain/community/tools/calculator";

const memory = new BufferMemory({
  inputKey: "input",
  outputKey: "output",
});

memory.clear();

export const model =
  config.modelProvider == "anthropic"
    ? new ChatAnthropic({
        anthropicApiKey: config.modelApiKey,
        model: config.model,
        temperature: 0,
      })
    : new ChatOpenAI({
        openAIApiKey: config.modelApiKey,
        model: config.model,
        temperature: 0,
      });

const prom = new PrometheusDriver({
  endpoint: config.prometheusUrl,
  baseURL: "/api/v1",
});

const searchTool = config.tavilyEnabled
  ? new TavilySearchResults({
      maxResults: 1,
      apiKey: config.tavilyApiKey ?? "",
    })
  : null;

const stackExchangeTool = new StackExchangeAPI();

const calculatorTool = new Calculator();

const queriesSchema = z.object({
  query: z
    .string()
    .describe("Syntactically valid PromQL query")
    .refine((query) => {
      try {
        const tree = parser.parse(query);
        return tree?.length > 0; // Ensure there's a valid parse tree
      } catch {
        return false;
      }
    }, "Invalid PromQL syntax."),
});

const queriesOutput = z.object({
  queries: z.array(queriesSchema),
});

const queriesModel = model.withStructuredOutput(queriesOutput);

const agentCheckpointer = new MemorySaver();

let metricNamesCache: string | null = null;

const getMetricNamesTool = new DynamicTool({
  name: "getMetricNames",
  description: "Fetches and caches the list of metric names from Prometheus.",
  func: async (): Promise<string> => {
    if (!metricNamesCache) {
      const metricQuery = await prom.instantQuery(
        'count by (__name__)({__name__!=""}) > 100',
      );
      metricNamesCache = metricQuery.result
        .map((entry: { metric: { name: string } }) => entry.metric.name)
        .join(", ");
    }
    return metricNamesCache;
  },
});

const alertsFetcherTool = new DynamicTool({
  name: "alertsFetcherTool",
  description:
    "Fetches current active alerts from Prometheus to provide insights on ongoing incidents.",
  func: async (): Promise<string> => {
    const response = await prom.alerts();
    return JSON.stringify(response);
  },
});

const queryGeneratorTool = new DynamicTool({
  name: "queryGeneratorTool",
  description:
    "This tool transforms user input into Prometheus queries and results about infrastructure, services, and system performance. It is invoked when a user asks a question answerable by an engineer or observability tool, such as queries about CPU usage, storage, disk, error rates, latency, or other metrics. By leveraging Prometheus data, it provides real-time, actionable insights into system health and performance.",
  func: async (input: string): Promise<string> => {
    const getQueriesPromptTemplate = PromptTemplate.fromTemplate(getQueries);
    const queryPromptValue = await getQueriesPromptTemplate.invoke({
      input,
      metricResults: await getMetricNamesTool.func(""),
    });
    const queryResults = await queriesModel.invoke(queryPromptValue, config);
    return JSON.stringify(queryResults.queries);
  },
});

const metricDetailsTool = new DynamicTool({
  name: "metricDetailsTool",
  description:
    "Retrieves detailed information for a specified metric, including its labels and recent data points. The input should be a Prometheus Metric Name",
  func: async (input: string): Promise<string> => {
    const query = `group by (__name__) ({__name__="${input}"})`;
    const response = await prom.instantQuery(query);
    const series = response.result;
    let result = "";
    series.forEach((serie) => {
      result += "Metric: " + serie.metric + "\n";
      result += "Timestamp: " + serie.value.time + "\n";
      result += "Value: " + serie.value.value + "\n";
    });
    return result;
  },
});

const instantQueryExecutorTool = new DynamicTool({
  name: "instantQueryExecutorTool",
  description:
    "Executes a PromQL instant query (no from and to timestamps) and returns the results.",
  func: async (input: string): Promise<string> => {
    let result = "";
    const response = await prom.instantQuery(input);
    const series = response.result;
    series.forEach((serie) => {
      result += "Metric: " + serie.metric.toString() + "\n";
      result += "Timestamp: " + serie.value.time + "\n";
      result += "Value: " + serie.value.value + "\n";
    });
    return result;
  },
});

const rangeQueryExecutorTool = new DynamicTool({
  name: "rangeQueryExecutorTool",
  description:
    "Executes a PromQL ranged query. Requires query, from time (as text parseable by chrono-time), and to time (as text parseable by chrono-time).",
  func: async (input: string): Promise<string> => {
    const [query, startString, endString] = input
      .split(",")
      .map((s) => s.trim());
    const start: Date =
      chrono.parseDate(startString) ||
      chrono.parseDate("30 minutes ago") ||
      new Date();
    const end: Date = chrono.parseDate(endString) || new Date();

    const step: number = 6 * 60 * 60;
    const response = await prom.rangeQuery(query, start, end, step);

    let result = "";
    response.result.forEach((serie) => {
      result += "Serie:" + serie.metric.toString();
      result += "Values:\n" + serie.values.join("\n");
    });
    return result;
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

const tools = [
  llmReasoningTool,
  getMetricNamesTool,
  queryGeneratorTool,
  rangeQueryExecutorTool,
  alertsFetcherTool,
  metricDetailsTool,
  instantQueryExecutorTool,
  stackExchangeTool,
  calculatorTool,
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
