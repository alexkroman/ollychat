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

import { loadPromptFromFile } from "./utils/promptLoader.js";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";

const search = new TavilySearchResults();

const config = { configurable: { thread_id: uuidv4() } };

const regexPattern = new RegExp(
  "Plan\\s*\\d*:\\s*([^#]+)\\s*(#E\\d+)\\s*=\\s*(\\w+)\\s*\\[([^\\]]+)\\]",
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

const _parseResult = (input: unknown) => {
  if (typeof input === "string") {
    const parsedInput = JSON.parse(input);
    if (Array.isArray(parsedInput) && "content" in parsedInput[0]) {
      // This means it is a tool result.
      return parsedInput.map(({ content }) => content).join("\n");
    }
  }

  if (input && typeof input === "object" && "content" in input) {
    // If it's not a tool, we know it's an LLM result.
    const { content } = input;
    return content;
  }
  throw new Error("Invalid input received");
};

async function toolExecution(
  state: typeof GraphState.State,
  config?: RunnableConfig,
) {
  try {
    console.log("---EXECUTE TOOL---");

    const _step = _getCurrentTask(state);
    if (_step === null) {
      throw new Error("No current task found");
    }

    if (
      !state.steps ||
      !Array.isArray(state.steps) ||
      _step > state.steps.length
    ) {
      throw new Error("Invalid step index or state.steps is malformed");
    }

    const [, stepName, tool, toolInputTemplate] = state.steps[_step - 1];

    if (!stepName || !tool || !toolInputTemplate) {
      throw new Error("Malformed step data: missing required fields");
    }

    let toolInput = toolInputTemplate;
    const _results = state.results || {};

    for (const [k, v] of Object.entries(_results)) {
      toolInput = toolInput.replace(k, String(v));
    }

    let result;

    if (tool === "Google") {
      console.log("---EXECUTE GOOGLE---");
      result = await search.invoke(toolInput, config);
    } else if (tool === "LLM") {
      console.log("---EXECUTE LLM---");
      result = await model.invoke(toolInput, config);
    } else {
      throw new Error(`Invalid tool specified: ${tool}`);
    }

    if (!result) {
      throw new Error(`Execution failed for tool: ${tool}`);
    }

    _results[stepName] = JSON.stringify(_parseResult(result), null, 2);

    return { results: _results };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in toolExecution:", error.message);
    } else {
      console.error("Error in toolExecution:", error);
    }
    if (error instanceof Error) {
      throw new Error(`toolExecution failed: ${error.message}`);
    } else {
      throw new Error("toolExecution failed with an unknown error");
    }
  }
}

const solvePrompt = loadPromptFromFile("solve");

async function solve(state: typeof GraphState.State, config?: RunnableConfig) {
  console.log("---SOLVE---");
  let plan = "";
  const _results = state.results || {};

  for (const [toolInput, key] of state.steps) {
    let value = _results[key]; // Retrieve the result for the key (e.g., #E1, #E2)

    if (!value) {
      // Find the first matching step that contains the same key (#E1, #E2)
      const matchingStep = state.steps.find((step) => step.includes(key));
      if (matchingStep) {
        value = matchingStep[0]; // Replace #E1 with the first element of the matching step
      }
    }

    plan += `Plan: ${toolInput}\n`;

    if (value) {
      plan += `Evidence: ${value}\n`;
    }
  }

  const result = await solvePrompt
    .pipe(model)
    .invoke({ plan, task: state.task }, config);
  return {
    answer: result.toString(),
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
  let finalResult;
  const stream = await app.stream(
    {
      task: inputs.question,
    },
    config,
  );
  for await (const item of stream) {
    console.log(item);
    console.log("-----");
    finalResult = item;
  }

  return finalResult;
};
