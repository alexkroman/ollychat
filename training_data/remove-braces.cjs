#!/usr/bin/env node

const fs = require('fs').promises;
const readline = require('readline');

/**
 * Process a single line, escaping braces if it starts with 'query'
 * @param {string} line - Input line to process
 * @returns {string} - Processed line
 */
function processLine(line) {
    if (line.toLowerCase().includes('query')) {
        return line.replace(/{/g, '{{').replace(/}/g, '}}');
    }
    return line;
}

/**
 * Process input from a readable stream
 * @param {readline.Interface} rl - Readline interface
 * @param {WriteStream} outputStream - Stream to write output
 * @returns {Promise<void>}
 */
async function processStream(rl, outputStream) {
    for await (const line of rl) {
        outputStream.write(processLine(line) + '\n');
    }
}

async function main() {
    try {
        const args = process.argv.slice(2);
        let inputStream = process.stdin;
        let outputStream = process.stdout;

        // If input file is specified
        if (args[0]) {
            try {
                const fd = await fs.open(args[0], 'r');
                inputStream = fd.createReadStream();
            } catch (err) {
                console.error(`Error opening input file: ${err.message}`);
                process.exit(1);
            }
        }

        // If output file is specified
        if (args[1]) {
            try {
                outputStream = await fs.open(args[1], 'w').then(fd => fd.createWriteStream());
            } catch (err) {
                console.error(`Error opening output file: ${err.message}`);
                process.exit(1);
            }
        }

        const rl = readline.createInterface({
            input: inputStream,
            crlfDelay: Infinity
        });

        await processStream(rl, outputStream);

        // Close streams if they're not stdin/stdout
        if (inputStream !== process.stdin) {
            inputStream.destroy();
        }
        if (outputStream !== process.stdout) {
            outputStream.end();
        }

    } catch (err) {
        console.error(`An error occurred: ${err.message}`);
        process.exit(1);
    }
}

// Run the script if it's being executed directly
if (require.main === module) {
    main();
}