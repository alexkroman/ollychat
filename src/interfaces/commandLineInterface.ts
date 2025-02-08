import figlet from "figlet";
import { createInterface } from "node:readline";
import type { Interface } from "node:readline";
import { logger } from "../utils/logger.js";
import { answerQuestion } from "../ollychat.js";
import { marked } from "marked";
import { markedTerminal } from "marked-terminal";
import chalk from "chalk";
import { config } from "../config/config.js";
import readline from "readline";

const mkOptions = {
  tab: 2,
  reflowText: false,
  showSectionPrefix: false,
};

marked.use(markedTerminal(mkOptions) as never);

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

    console.log(chalk.green.bold("\n🔍 Querying..."));
    const result = await answerQuestion({ question: messageText });
    readline.moveCursor(process.stdout, 0, -1);
    readline.clearLine(process.stdout, 0);
    console.log(marked(`${result}`));
  }

  public async start() {
    console.clear();
    console.log(
      chalk.cyan(figlet.textSync("Ollychat", { horizontalLayout: "full" })),
    );

    console.log(chalk.bold("\n🚀 Running Ollychat\n"));

    console.log(
      chalk.bold("📖 Getting started guide: ") +
        chalk.green.underline("http://github.com/alexkroman/ollychat\n"),
    );

    console.log(
      chalk.bold("🔗 Connected to Prometheus at: ") +
        chalk.green.underline(config.prometheusUrl),
    );

    console.log(chalk.gray("\n" + "-".repeat(50) + "\n"));
    console.log(chalk.bold("💡 Here are some questions you can ask:\n"));
    console.log(chalk.green("✅ what's the health of my cluster?"));
    console.log(chalk.green("✅ which pods are consuming the most memory?"));
    console.log(chalk.green("✅ are there any open alerts?"));

    console.log(chalk.gray("\n" + "-".repeat(50) + "\n"));

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
