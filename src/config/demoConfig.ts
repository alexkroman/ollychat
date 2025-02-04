import { requireEnv } from "../utils/config.js";

import * as dotenv from "dotenv";

dotenv.config();

export const slackConfig = {
  demoEmail: requireEnv("DEMO_EMAIL"),
  clusterName: requireEnv("CLUSTER_NAME"),
  region: requireEnv("REGION"),
};
