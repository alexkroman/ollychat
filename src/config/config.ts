import { requireEnv } from "../utils/config.js";

import { v4 as uuidv4 } from "uuid";
import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  AIApiKey: process.env.CLAUDE_API_KEY || requireEnv("OPENAI_API_KEY"),
  AIModel: process.env.CLAUDE_MODEL || requireEnv("OPENAI_MODEL"),
  prometheusUrl: requireEnv("PROMETHEUS_URL"),
  langSmithEndpoint: requireEnv("LANGSMITH_ENDPOINT"),
  langSmithApiKey: requireEnv("LANGSMITH_API_KEY"),
  langSmithProject: requireEnv("LANGSMITH_PROJECT"),
  logging: !process.execArgv.includes("--no-warnings"),
  configurable: { thread_id: uuidv4(), recursion_limit: 5 },
};
