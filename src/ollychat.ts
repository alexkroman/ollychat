import {
  END,
  START,
  Annotation,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";
import { Runnable, RunnableConfig } from "@langchain/core/runnables";

import { v4 as uuidv4 } from "uuid";

import { model } from "./integrations/model.js";
import { prometheusQueryTool } from "./integrations/prometheus.js";
import { loadPromptFromFile } from "./utils/promptLoader.js";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { queryModel } from "./integrations/model.js";

import {
  metricsExampleSelector,
  labelsExampleSelector,
  valuesExampleSelector,
  exampleSelector,
} from "./integrations/vectorStore.js";

import { z } from "zod";

const search = new TavilySearchResults();

const config = { configurable: { thread_id: uuidv4() } };

interface ExampleItem {
  metadata?: Record<string, string | undefined>;
}

export async function getExamples(
  input: string,
  selector: Runnable<string, ExampleItem[]>,
  key: string,
): Promise<Array<Record<string, string | undefined>>> {
  const examples = await selector.invoke(input);
  return examples.map((ex) => ({
    [key]: ex.metadata?.[key],
  }));
}

async function getPlan(
  state: typeof GraphState.State,
  config?: RunnableConfig,
) {
  console.log("---GET PLAN---");
  const task = state.task;

  const plannerTemplate = loadPromptFromFile("plan");

  const promptValue = await plannerTemplate.invoke({
    task: task,
  });

  const stepSchema = z.object({
    plan: z.string(),
    step_id: z.string(),
    variable: z.string(),
    tool: z.string(),
    command: z.string(),
  });

  const dataSchema = z.object({
    plan_steps: z.array(stepSchema),
  });

  const plannerModel = model.withStructuredOutput(dataSchema);

  const result = await plannerModel.invoke(promptValue, config);

  const steps = result.plan_steps.map((step) => [
    step.plan,
    step.step_id,
    step.variable,
    step.tool,
    step.command,
  ]);

  return {
    steps: steps,
  };
}

const _getCurrentTask = (state: typeof GraphState.State) => {
  if (!state.results) {
    return 1;
  }

  if (Object.entries(state.results).length === state.steps.length) {
    return null;
  }
  return Object.entries(state.results).length + 1;
};

async function toolExecution(
  state: typeof GraphState.State,
  config?: RunnableConfig,
) {
  console.log("---EXECUTE TOOL---");

  const stepIndex = _getCurrentTask(state) || 0;

  const step = state.steps[stepIndex - 1];
  const [plan /* stepId (unused) */, , stepName, tool, toolInputTemplate] =
    step;

  const toolExecutors: Record<
    string,
    (input: string, config?: RunnableConfig) => Promise<unknown>
  > = {
    Google: async (input, config) => {
      const response = await search.invoke(input, config);
      return response;
    },
    LLM: async (input, config) => {
      const response = await model.invoke(input, config);
      return response.content;
    },
    PromQL: async (input) => {
      const queryPromptTemplate = loadPromptFromFile("query");
      const metrics = getExamples(input, metricsExampleSelector, "metric");
      const labels = getExamples(input, labelsExampleSelector, "label");
      const queries = getExamples(input, exampleSelector, "query");
      const values = getExamples(input, valuesExampleSelector, "value");
      const promptValue = await queryPromptTemplate.invoke({
        guessed_query: input,
        plan: plan,
        task: state.task,
        metrics: metrics,
        queries: queries,
        values: values,
        labels: labels,
      });
      const result = await queryModel.invoke(promptValue, config);
      return prometheusQueryTool.invoke({ query: result.query });
    },
  };

  if (!(tool in toolExecutors)) {
    throw new Error(`Invalid tool specified: ${tool}`);
  }

  try {
    const parsedInput = await parseToolInput(state, toolInputTemplate);

    const result = await toolExecutors[tool](parsedInput, config);

    if (!result) {
      throw new Error(`Execution failed for tool: ${tool}`);
    }

    const updatedResults = {
      ...state.results, // Preserve previous results
      [stepName]: JSON.stringify(result, null, 2), // Store new result
    };

    console.log(updatedResults);

    return { results: updatedResults }; // Merge into state via the reducer
  } catch (error) {
    console.error(`Error executing tool ${tool}:`, error);
    throw error;
  }
}

async function parseToolInput(
  state: typeof GraphState.State,
  input: string,
): Promise<string> {
  if (!state?.results || typeof state.results !== "object") return input; // Ensure state.results is defined and is an object

  return input.replace(/#E(\d+)/g, (match: string): string => {
    const result = (state.results as Record<string, string>)[match];
    return typeof result === "string" ? result : match; // Fallback to original placeholder if not found
  });
}

const solvePrompt = loadPromptFromFile("solve");

async function solve(state: typeof GraphState.State, config?: RunnableConfig) {
  console.log("---SOLVE---");

  const results = state.results || {};
  const plan = state.steps.map(([planDesc, , stepName]) => {
    const value =
      results[stepName] ||
      state.steps.find((step) => step.includes(stepName))?.[0] ||
      null;
    return value ? { plan: planDesc, results: value } : { plan: planDesc };
  });

  const planJSON = JSON.stringify(plan, null, 2);

  const { content } = await solvePrompt
    .pipe(model)
    .invoke({ plan: planJSON, task: state.task }, config);

  state.result = JSON.stringify(content);

  return { result: content.toString() };
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

const app = workflow.compile({
  checkpointer: new MemorySaver(),
});

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
