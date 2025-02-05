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
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { PrometheusDriver } from "prometheus-query";
import { PromptTemplate } from "@langchain/core/prompts";
import { parser } from "@prometheus-io/lezer-promql";
import { getQueries } from "./prompts/getQueries.js";
import { trimMessages } from "@langchain/core/messages";

const memory = new BufferMemory({
  inputKey: "input",
  outputKey: "output",
});

memory.clear();

const prom = new PrometheusDriver({
  endpoint: config.prometheusUrl,
  baseURL: "/api/v1",
});

export const model = new ChatOpenAI({
  openAIApiKey: config.openAIApiKey,
  model: config.openAIModel,
  temperature: 0,
});

const searchTool = new TavilySearchResults({
  maxResults: 1,
});

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

const queryGeneratorTool = new DynamicTool({
  name: "queryGeneratorTool",
  description:
    "Generates PromQL queries based on user input and available metric names.",
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

const queryExecutorTool = new DynamicTool({
  name: "queryExecutorTool",
  description: "Executes a PromQL query and returns the results.",
  func: async (input: string): Promise<string> => {
    let result = "";
    const response = await prom.instantQuery(input);
    const series = response.result;
    series.forEach((serie) => {
      result += "Metric: " + serie.metric + "\n";
      result += "Timestamp: " + serie.value.time + "\n";
      result += "Value: " + serie.value.value + "\n";
    });
    return result;
  },
});

const prometheusQueryAssistant = new DynamicTool({
  name: "prometheusQueryAssistant",
  description:
    "This tool transforms user input into Prometheus queries and results about infrastructure, services, and system performance. It is invoked when a user asks a question answerable by an engineer or observability tool, such as queries about CPU usage, storage, disk, error rates, latency, or other metrics. By leveraging Prometheus data, it provides real-time, actionable insights into system health and performance.",
  func: async (input: string): Promise<string> => {
    const queries = await queryGeneratorTool.func(input);
    const results = await queryExecutorTool.func(queries);
    return results;
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
  prometheusQueryAssistant,
  searchTool,
  getMetricNamesTool,
  queryGeneratorTool,
  queryExecutorTool,
];

const agent = createReactAgent({
  llm: model,
  tools,
});

const getPlan = async (state: typeof MessagesAnnotation.State) => {
  const trimmedMessages = await trimMessages(state.messages, {
    maxTokens: 1000,
    tokenCounter: model,
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
  const input = [
    {
      role: "user",
      content: inputs.question,
    },
  ];

  const result = await app.invoke({ messages: input }, config);
  const lastMessage = result.messages[result.messages.length - 1];
  return lastMessage.content;
};
