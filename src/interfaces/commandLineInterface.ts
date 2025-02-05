import figlet from "figlet";
import { createInterface } from "node:readline";
import type { Interface } from "node:readline";
import { logger } from "../utils/logger.js";
import { answerQuestion } from "../ollychat.js";
import { marked } from "marked";
import { markedTerminal } from "marked-terminal";
import chalk from "chalk";
import { config } from "../config/config.js";

const mkOptions = {
  tab: 2,
  reflowText: false,
  showSectionPrefix: false,
  firstHeading: chalk.bold.underline,
  heading: chalk.bold,
  strong: chalk.bold.whiteBright,
  em: chalk.italic.cyanBright,
  codespan: (text: string) => chalk.bgBlackBright.white(` ${text} `),
  blockquote: (text: string) => chalk.gray.italic(`\n> ${text}\n`),
  listitem: (text: string) =>
    chalk.green(
      `• ${text
        .replace(/\*\s*$/, "")
        .replace(/\*\s*/g, "\n")
        .trim()}`,
    ), // Convert * to newlines
  paragraph: (text: string) => text.trim(),
  list: (body: string) =>
    body
      .replace(/\*\s*/g, "")
      .replace(/\n+/g, "") // Convert all newlines to spaces
      .split("• ")
      .join("\n• "), // Ensure lists stay on new lines
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

    console.log(chalk.green.bold("\n🔍 Querying...\n"));
    const result = await answerQuestion({ question: messageText });
    console.log(chalk.bold.cyanBright("\n✅ Answer...\n"));
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
    console.log(chalk.green("✅ What is the memory usage of my nodes?"));
    console.log(chalk.green("✅ Is my cluster healthy?"));

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
