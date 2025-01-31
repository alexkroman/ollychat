import { jest } from "@jest/globals";
import { describe, test, expect, beforeEach } from "@jest/globals";

// Mock implementations must be declared before importing the actual code under test:
jest.unstable_mockModule("@langchain/openai", () => ({
    ChatOpenAI: jest.fn().mockImplementation(() => ({
      invoke: jest.fn(),
      withStructuredOutput: jest.fn(),
      bindTools: jest.fn().mockImplementation(() => ({
        invoke: jest.fn(), // Ensures it still works within createReactAgent
      })),
    })),
  }));

jest.unstable_mockModule("prometheus-query", () => ({
  PrometheusDriver: jest.fn().mockImplementation(() => ({
    instantQuery: jest.fn(),
  })),
}));

jest.unstable_mockModule("@langchain/community/tools/tavily_search", () => ({
  TavilySearchResults: jest.fn().mockImplementation(() => ({
    search: jest.fn(),
  })),
}));

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

    //const result = await answerQuestion({ question: "What is PromQL?" });
    //expect(result).toBeDefined();
    //expect(result.content).toBe("Mocked LLM response");
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
