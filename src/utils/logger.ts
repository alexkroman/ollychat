import { config } from "../config/config.js";
import pino from "pino";

const level = config.logging ? "debug" : "error";

export const logger = pino({
  level,
  ...(config.logging
    ? {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            ignore: "pid,hostname",
          },
        },
      }
    : {}),
});
