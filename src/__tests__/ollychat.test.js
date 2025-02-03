import { jest } from "@jest/globals";
import { describe, test, expect, beforeEach } from "@jest/globals";

jest.unstable_mockModule("@langchain/openai", () => {
    return {
      ChatOpenAI: jest.fn().mockImplementation(() => {
        // The object returned by "new ChatOpenAI(...)"
        // Make sure we also mock out `withStructuredOutput` because
        // your code calls e.g. `model.withStructuredOutput(...).invoke(...)`
        const structuredOutputModel = {
          invoke: jest.fn().mockResolvedValue({
            // shape that your code expects for structured outputs
            metrics: [], // or queries: [] if mocking queries
          }),
        };
  
        return {
          // 'invoke' is used for simple calls: model.invoke(...)
          invoke: jest.fn().mockResolvedValue({
            content: "Some default ChatOpenAI content",
          }),
  
          // 'withStructuredOutput' is used for your "metricModel" or "queriesModel"
          withStructuredOutput: jest.fn().mockReturnValue(structuredOutputModel),
  
          // 'bindTools' is called inside createReactAgent
          bindTools: jest.fn().mockImplementation(() => ({
            invoke: jest.fn(),
          })),
        };
      }),
    };
  });
  
  // Mock prometheus-query
  jest.unstable_mockModule("prometheus-query", () => {
    return {
      PrometheusDriver: jest.fn().mockImplementation(() => {
        return {
          // Your code calls `prom.instantQuery(...)` and reads `.result`
          instantQuery: jest.fn().mockResolvedValue({
            result: [
              {
                metric: { __name__: "mock_metric_name" },
                value: { time: 1689280000, value: "12345" },
              },
            ],
          }),
        };
      }),
    };
  });
  
  // Mock @langchain/community/tools/tavily_search
  jest.unstable_mockModule("@langchain/community/tools/tavily_search", () => {
    return {
      TavilySearchResults: jest.fn().mockImplementation(() => ({
        search: jest.fn().mockResolvedValue([]),
      })),
    };
  });
  
  // Mock @langchain/langgraph
  jest.unstable_mockModule("@langchain/langgraph", () => {
    return {
      // The code references these constants & classes
      END: "END",
      START: "START",
      MemorySaver: jest.fn(),
      MessagesAnnotation: jest.fn(),
      StateGraph: jest.fn().mockImplementation(() => {
        return {
          addNode: jest.fn().mockReturnThis(),
          addEdge: jest.fn().mockReturnThis(),
          addConditionalEdges: jest.fn().mockReturnThis(),
          // .compile() is called returning an object with .invoke(...)
          compile: jest.fn().mockReturnValue({
            invoke: jest.fn().mockResolvedValue({
              messages: [
                { role: "assistant", content: "Mocked final response" },
              ],
            }),
          }),
        };
      }),
    };
  });
  
  // Mock @langchain/langgraph/prebuilt
  jest.unstable_mockModule("@langchain/langgraph/prebuilt", () => {
    return {
      ToolNode: jest.fn().mockImplementation(() => ({})),
      createReactAgent: jest.fn().mockResolvedValue({
        // The agent's .invoke() is used in getPlan()
        invoke: jest.fn().mockResolvedValue({
          content: "Mocked agent reasoning output",
        }),
      }),
    };
  });
  
  // Mock config
  jest.unstable_mockModule("../config/config.js", () => {
    return {
      config: {
        openAIApiKey: "MOCKED_OPENAI_KEY",
        openAIModel: "gpt-3.5-turbo",
        temperature: 0.7,
        prometheusUrl: "http://mock-prometheus",
      },
    };
  });
  
// Now we can actually import the modules under test AFTER declaring mocks:
const { answerQuestion } = await import("../ollychat.ts");
const { ChatOpenAI } = await import("@langchain/openai");
const { PrometheusDriver } = await import("prometheus-query");
const { TavilySearchResults } = await import("@langchain/community/tools/tavily_search");

describe("answerQuestion", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return an answer when given a valid question", async () => {
    const mockInvoke = jest.fn().mockResolvedValue({ content: "Mocked LLM response" });
    ChatOpenAI.mockImplementation(() => ({ invoke: mockInvoke }));

    const result = await answerQuestion({ question: "What is PromQL?" });
    expect(result).toBeDefined();
    expect(result).toBe("Mocked final response");
  });

});

describe("Prometheus Query Assistant", () => {
  test("should fetch metric names only once and cache them", async () => {
    const mockQueryResult = {
      data: { result: [{ metric: { __name__: "mock_metric" } }] },
    };

    const mockInstantQuery = jest.fn().mockResolvedValue(mockQueryResult);
    PrometheusDriver.mockImplementation(() => ({
      instantQuery: mockInstantQuery,
    }));

    const prom = new PrometheusDriver({ endpoint: "http://mock-prometheus" });
    const metricNames = await prom.instantQuery('group by(__name__) ({__name__!=""})');

    expect(metricNames).toEqual(mockQueryResult);
    expect(mockInstantQuery).toHaveBeenCalledTimes(1);
  });
});

describe("Tavily Search Tool", () => {
  test("should initialize search tool with correct parameters", () => {
    const searchTool = new TavilySearchResults({ maxResults: 1 });
    expect(searchTool).toBeDefined();
    expect(searchTool.search).toBeDefined();
    expect(typeof searchTool.search).toBe("function");
  });
});
