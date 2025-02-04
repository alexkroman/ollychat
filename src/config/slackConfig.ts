import { requireEnv } from "../utils/config.js";

import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  slackBotToken: requireEnv("SLACK_BOT_TOKEN"),
  slackSigningSecret: requireEnv("SLACK_SIGNING_SECRET"),
  slackAppToken: requireEnv("SLACK_APP_TOKEN"),
  port: Number(requireEnv("PORT")),
};
