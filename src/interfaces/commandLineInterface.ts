import chalk from "chalk";
import figlet from "figlet";
import { createInterface } from "node:readline";
import type { Interface } from "node:readline";

import { logger } from "../utils/logger.js";
import { answerQuestion } from "../ollychat.js";

// Generate ASCII Art for "OLLYCHAT"
const asciiTitle = figlet.textSync("Olly", {
  font: "Colossal", // You can experiment with different fonts
  horizontalLayout: "default",
  verticalLayout: "default",
  whitespaceBreak: true,
});

export class CLI {
  private rl: Interface;
  private prompt: string;
  private isRunning: boolean = true;

  constructor(promptText: string = "❱ ") {
    this.prompt = chalk.magenta.bold(promptText);

    this.rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: this.prompt,
    });
  }

  private async handleInput(input: string) {
    const messageText = input.trim();
    if (!messageText) return;

    if (messageText.toLowerCase() === "exit") {
      this.stop();
      return;
    }

    console.log(chalk.green("\nQuerying...\n"));

    const result = await answerQuestion({ question: messageText });

    console.log(chalk.bold.green("✅ Answer: ") + chalk.magenta(result) + "\n");
  }

  public async start() {
    // ASCII Art Title
    console.log("\n");
    console.log(chalk.cyan(asciiTitle));
    console.log(chalk.bold("\nRunning Ollychat\n"));
    console.log(
      chalk.bold("Getting started guide: ") +
        chalk.green("http://github.com/alexkroman/ollychat\n\n"),
    );

    this.rl.prompt();

    this.rl.on("line", async (line) => {
      if (this.isRunning) {
        await this.handleInput(line.trim());
        this.rl.prompt();
      }
    });

    this.rl.on("close", () => {
      this.stop();
    });
  }

  public stop() {
    this.isRunning = false;
    this.rl.close();
    console.log(chalk.blue("\nGoodbye!"));
    process.exit(0);
  }
}

const main = async () => {
  try {
    const cli = new CLI();
    await cli.start();
  } catch (error) {
    logger.error("Failed to start CLI:", error);
    process.exit(1);
  }
};

main();
