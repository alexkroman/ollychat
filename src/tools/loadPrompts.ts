import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { PromptTemplate } from "@langchain/core/prompts";

import * as dotenv from 'dotenv';
dotenv.config();

const logging = !process.execArgv.includes('--no-warnings');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function loadFile(filePath: string) {
    const file = readFileSync(join(__dirname, "../prompts/" + filePath + ".txt"), "utf-8");
    if (logging === true) {
        console.log(file);
    }
    return file;
}

export function loadPromptFromFile(filePath: string): PromptTemplate {
    return PromptTemplate.fromTemplate(loadFile(filePath));
}