import { config } from "../config/config.js";

export class Logger {
  static log(message: string, ...optionalParams: any[]) {
    if (config.logging) {
      console.log(message, ...optionalParams);
    }
  }
}