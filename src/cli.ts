import { createInterface } from 'node:readline';
import type { Interface } from 'node:readline';
import { answerQuestion } from "./ollychat.js";

interface Command {
    name: string;
    description: string;
    execute: (...args: string[]) => Promise<void>;
}

export class CLI {
    private rl: Interface;
    private prompt: string;
    private isRunning: boolean = true;

    constructor(promptText: string = '> ') {
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
            // Since we're using the entire input as a query
            const messageText = input.trim();
            if (!messageText) return;
            const result = await answerQuestion({ question: messageText });           
            console.log(result.answer);
        } catch (error) {
            console.error('Error processing input:', error);
        }
    }

    /**
     * Start the CLI
     */
    public async start() {
        console.log('OLLYCHAT is running!');
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