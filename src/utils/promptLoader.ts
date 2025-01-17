import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { PromptTemplate } from "@langchain/core/prompts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadFile(filePath: string) {
    return readFileSync(join(__dirname, "../templates/" + filePath + ".txt"), "utf-8");
}

export function loadPromptFromFile(filePath: string): PromptTemplate {
    return PromptTemplate.fromTemplate(loadFile(filePath));
}