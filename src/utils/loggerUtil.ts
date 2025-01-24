import { config } from "../config/config.js";

export class Logger {
  static log(message: string, ...optionalParams: unknown[]) {
    if (config.logging) {
      console.log(message, ...optionalParams);
    }
  }
}
