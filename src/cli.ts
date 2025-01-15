import { createInterface } from 'node:readline';
import type { Interface } from 'node:readline';
import { answerQuestion } from "./ollychat.js";

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

    constructor(promptText: string = '     you >> ') {
        this.prompt = promptText;
        // Initialize readline interface
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
            const result = await answerQuestion({ question: messageText });           
            console.log("ollychat >> " + result.answer.replaceAll('\n', '\n         >> '));
        } catch (error) {
            if (logging === true) {
                console.error('Error processing input:', error);
            } else {
                console.log("ollychat >> Sorry I ran into an issue.");
            }
        }
    }

    /**
     * Start the CLI
     */
    public async start() {
        console.log('\n\n--------------------');
        console.log('Welcome to OLLYCHAT!');
        console.log('Ctrl-C to Quit');

        console.log('--------------------\n\n');

        this.rl.prompt();

        this.rl.on('line', async (line) => {
            if (this.isRunning) {
                await this.handleInput(line.trim());
                this.rl.prompt();
            }
        });

        this.rl.on('close', () => {
            if (this.isRunning) {
                console.log('\nGoodbye!');
                process.exit(0);
            }
        });
    }

    /**
     * Stop the CLI
     */
    public stop() {
        this.isRunning = false;
        this.rl.close();
    }
}

// Start your app
const main = async () => {
    try {
        const cli = new CLI();
        await cli.start();
    } catch (error) {
        console.error('Failed to start CLI:', error);
        process.exit(1);
    }
};

main();