import chalk from 'chalk';
import { createInterface } from 'node:readline';
import type { Interface } from 'node:readline';
import { answerQuestion } from "../agents/ollychat.js";
import ora from 'ora';

interface Command {
    name: string;
    description: string;
    execute: (...args: string[]) => Promise<void>;
}

const logging = !process.execArgv.includes('--no-warnings');

export class CLI {
    private rl: Interface;
    private prompt: string;
    private isRunning: boolean = true;

    constructor(promptText: string = 'you >> ') {
        this.prompt = chalk.blue(promptText);

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

            chalk.green('Processing your input...')
            
            const result = await answerQuestion({ question: messageText });

            console.log(chalk.magenta("ollychat >> ") + chalk.cyan(result.answer));

        } catch (error) {
            if (logging === true) {
                console.error(chalk.red('Error processing input:'), error);
            } else {
                console.log(chalk.magenta("ollychat >> ") + chalk.red("Sorry I ran into an issue."));
            }
        }
    }

    public async start() {
        console.log(chalk.cyan('══════════════════════════════════════════════'));
        console.log(chalk.bold.rgb(255, 165, 0)('💬🤖  Welcome to OLLYCHAT 🚀✨'));
        console.log(chalk.cyan('══════════════════════════════════════════════'));
        
        console.log(chalk.green('\n💡 Tips:'));
        console.log(chalk.green('- Type your questions below and press Enter'));
        console.log(chalk.green('- Ctrl-C to quit'));
        
        console.log(chalk.magentaBright('\n🔥🐶🔥 Everything is Fine 🔥🐶🔥'));
        
        console.log(chalk.cyan('\n══════════════════════════════════════════════'));

        this.rl.prompt();

        this.rl.on('line', async (line) => {
            if (this.isRunning) {
                await this.handleInput(line.trim());
                this.rl.prompt();
            }
        });

        this.rl.on('close', () => {
            if (this.isRunning) {
                console.log(chalk.blue('\nGoodbye!'));
                process.exit(0);
            }
        });
    }

    public stop() {
        this.isRunning = false;
        this.rl.close();
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