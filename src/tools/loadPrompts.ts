import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { PromptTemplate } from "@langchain/core/prompts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function loadPromptFromFile(filePath: string): PromptTemplate {
    const file = readFileSync(join(__dirname, "../prompts/" + filePath + ".txt"), "utf-8");
    return PromptTemplate.fromTemplate(file);
}