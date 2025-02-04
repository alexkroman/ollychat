import figlet from "figlet";
import { createInterface } from "node:readline";
import type { Interface } from "node:readline";
import { logger } from "../utils/logger.js";
import { answerQuestion } from "../ollychat.js";
import { marked } from "marked";
import { markedTerminal } from "marked-terminal";
import chalk from "chalk";

const mkOptions = {
  tab: 2,
  reflowText: false,
  showSectionPrefix: false,
  listitem: (text: string) => text.trim(),
};

marked.use(markedTerminal(mkOptions) as never);

const asciiTitle = figlet.textSync("Olly", {
  font: "Colossal",
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
    console.log(chalk.bold.cyanBright(`✅ Answer:\n`));
    console.log(marked(`${result}`));
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
