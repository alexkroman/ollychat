import {
  END,
  START,
  Annotation,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";
import { RunnableConfig } from "@langchain/core/runnables";

import { v4 as uuidv4 } from "uuid";

import { model } from "./integrations/model.js";
import { prometheusQueryTool } from "./integrations/prometheus.js";
import { loadPromptFromFile } from "./utils/promptLoader.js";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";

const search = new TavilySearchResults();

const config = { configurable: { thread_id: uuidv4() } };

const regexPattern = new RegExp(
  "Plan\\s*\\d*:\\s*([^#]+)\\s*(#E\\d+)\\s*=\\s*(\\w+)\\s*\\<(.*?)\\>",
  "g",
);

async function getPlan(
  state: typeof GraphState.State,
  config?: RunnableConfig,
) {
  console.log("---GET PLAN---");
  const task = state.task;
  const plannerTemplate = loadPromptFromFile("plan");

  const planner = plannerTemplate.pipe(model);

  let result;
  const steps: string[][] = [];

  try {
    result = await planner.invoke({ task }, config);
    if (!result || !result.content) {
      throw new Error(
        "Planner invocation failed: result or content is undefined.",
      );
    }

    const matches = result.content.toString().matchAll(regexPattern);

    for (const match of matches) {
      if (!match || match.length < 5) {
        console.warn("Skipping invalid match:", match);
        continue;
      }

      const item = [match[1], match[2], match[3], match[4], match[0]];
      console.log("ITEM: " + item);
      if (item.some((i) => i === undefined)) {
        console.warn("Skipping incomplete match:", item);
        continue;
      }

      steps.push(item as string[]);
    }
  } catch (error) {
    console.error("Error in getPlan:", error);
    return { steps: [], planString: "" };
  }

  return {
    steps,
    planString: result?.content?.toString() || "",
  };
}

const _getCurrentTask = (state: typeof GraphState.State) => {
  console.log("_getCurrentTask", state);
  if (!state.results) {
    return 1;
  }
  if (Object.entries(state.results).length === state.steps.length) {
    return null;
  }
  return Object.entries(state.results).length + 1;
};

const _parseResult = (input: unknown): string => {
  if (typeof input === "string") {
    const parsedInput = JSON.parse(input);
    if (
      Array.isArray(parsedInput) &&
      parsedInput.every(
        (item) =>
          typeof item === "object" && item !== null && "content" in item,
      )
    ) {
      return parsedInput.map(({ content }) => String(content)).join("\n");
    }
  } else if (input && typeof input === "object" && "content" in input) {
    return String((input as { content: unknown }).content);
  }
  return String(input);
};

async function toolExecution(
  state: typeof GraphState.State,
  config?: RunnableConfig,
) {
  console.log("---EXECUTE TOOL---");

  const stepIndex = _getCurrentTask(state);
  if (stepIndex === null) throw new Error("No current task found");

  const steps = state.steps;
  if (!Array.isArray(steps) || stepIndex > steps.length) {
    throw new Error("Invalid step index or malformed steps");
  }

  const [, stepName, tool, toolInputTemplate] = steps[stepIndex - 1];
  if (!stepName || !tool || !toolInputTemplate) {
    throw new Error("Malformed step data: missing required fields");
  }

  let toolInput = toolInputTemplate;
  const results = state.results || {};

  Object.entries(results).forEach(([key, value]) => {
    toolInput = toolInput.replace(key, String(value));
  });

  const toolExecutors: Record<
    string,
    (input: string, config?: RunnableConfig) => Promise<unknown>
  > = {
    Google: async (input, config) => {
      console.log("---EXECUTE GOOGLE---");
      return search.invoke(input, config);
    },
    LLM: async (input, config) => {
      console.log("---EXECUTE LLM---");
      return model.invoke(input, config);
    },
    PromQL: async (input) => {
      console.log("---EXECUTE PromQL---");
      return prometheusQueryTool.invoke({ query: input });
    },
  };

  if (!(tool in toolExecutors)) console.log(`Invalid tool specified: ${tool}`);

  const result = await toolExecutors[tool](toolInput, config);
  if (!result) throw new Error(`Execution failed for tool: ${tool}`);

  results[stepName] = JSON.stringify(_parseResult(result), null, 2);
  return { results };
}

const solvePrompt = loadPromptFromFile("solve");

async function solve(state: typeof GraphState.State, config?: RunnableConfig) {
  console.log("---SOLVE---");
  const _results = state.results || {};
  let plan = "";

  // Iterate through steps and generate the plan
  for (const [toolInput, key] of state.steps) {
    let value = _results[key]; // Retrieve the result for the key (e.g., #E1, #E2)

    // If no result found for the key, find the matching step
    if (!value) {
      const matchingStep = state.steps.find((step) => step.includes(key));
      value = matchingStep ? matchingStep[0] : null; // Replace #E1 with the first element of the matching step, if any
    }

    plan += `Plan: ${toolInput}\n`;

    if (value) {
      plan += `Evidence: ${value}\n`;
    }
  }

  // Invoke the prompt and get the result
  const result = await solvePrompt
    .pipe(model)
    .invoke({ plan, task: state.task }, config);

  // Store the result in state
  state.result = JSON.stringify(result.content);

  return {
    result: result.content.toString(),
  };
}

const _route = (state: typeof GraphState.State) => {
  console.log("---ROUTE TASK---");
  const _step = _getCurrentTask(state);
  if (_step === null) {
    // We have executed all tasks
    return "solve";
  }
  // We are still executing tasks, loop back to the "tool" node
  return "tool";
};

const GraphState = Annotation.Root({
  task: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  planString: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  steps: Annotation<string[][]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  results: Annotation<Record<string, unknown>>({
    reducer: (x, y) => ({ ...x, ...y }),
    default: () => ({}),
  }),
  result: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
});

const workflow = new StateGraph(GraphState)
  .addNode("plan", getPlan)
  .addNode("tool", toolExecution)
  .addNode("solve", solve)
  .addEdge("plan", "tool")
  .addEdge("solve", END)
  .addConditionalEdges("tool", _route)
  .addEdge(START, "plan");

const app = workflow.compile({ checkpointer: new MemorySaver() });

export const answerQuestion = async (inputs: {
  question: string;
  chat_history?: string[];
}) => {
  const result = await app.invoke(
    {
      task: inputs.question,
    },
    config,
  );
  return result;
};
