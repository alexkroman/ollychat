import { config } from "../config/config.js";
import pino from "pino";

const level = config.logging ? "debug" : "info";

export const logger = pino({
  level: level,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      ignore: "pid,hostname",
    },
  },
});
