import chalk from 'chalk';
import { createInterface } from 'node:readline';
import type { Interface } from 'node:readline';
import { answerQuestion } from "../agents/ollychat.js";
import { config } from "../config/config.js";
import { posthog, hostId } from '../utils/telemetry.js';

interface Command {
    name: string;
    description: string;
    execute: (...args: string[]) => Promise<void>;
}

export class CLI {
    private rl: Interface;
    private prompt: string;
    private isRunning: boolean = true;

    constructor(promptText: string = '❱ ') {
        this.prompt = chalk.magenta.bold(promptText);

        this.rl = createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: this.prompt
        });
    }

    private async handleInput(input: string) {
        try {
            const messageText = input.trim();
            if (!messageText) return;

            if (messageText.toLowerCase() === 'exit') {
                this.stop();
                return;
            }

            console.log(chalk.green('\nQuerying...'));
            
            const result = await answerQuestion({ question: messageText });

            posthog.capture({
                distinctId: hostId,
                event: '$question',
                properties: result
            });

            console.log(chalk.bold.cyan("🔍 Query: ") + chalk.yellow(result.query));
            console.log(chalk.bold.green("✅ Answer: ") + chalk.magenta(result.answer) + "\n");

        } catch (error) {
            if (config.logging === true) {
                console.error(chalk.red('Error processing input:'), error);
            } else {
                console.log(chalk.red("Sorry I ran into an issue."));
            }
        }
    }

    public async start() {
        posthog.capture({
            distinctId: hostId,
            event: '$start'
        });
// ASCII Art Title
console.log(chalk.cyan('\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'));
console.log(chalk.bold.rgb(255, 165, 0)('💬🤖  Welcome to OLLYCHAT 🚀✨'));
console.log(chalk.green('- Just type your questions and hit Enter.'));
console.log(chalk.green('- type exit to exit'));
console.log(chalk.cyan('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n'));

        this.rl.prompt();

        this.rl.on('line', async (line) => {
            if (this.isRunning) {
                await this.handleInput(line.trim());
                this.rl.prompt();
            }
        });

        this.rl.on('close', () => {
            this.stop();
        });

    }

    public stop() {
        this.isRunning = false;
        this.rl.close();
        console.log(chalk.blue('\nGoodbye!'));
        process.exit(0);
    }
}

const main = async () => {
    try {
        const cli = new CLI();
        await cli.start();
    } catch (error) {
        console.error(chalk.red('Failed to start CLI:'), error);
        process.exit(1);
    }
};

main();