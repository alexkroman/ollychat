import fs from "fs";
import path from "path";
import { OpenAI } from "openai";
import { v4 as uuidv4 } from "uuid";
import { config } from "../config/config.js";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: config.openAIApiKey,
});

// Directories
const inputDir = "data/processed"; // Directory containing JSON files
const outputDir = "data/enriched"; // Directory to save processed files

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Interface for vector database entries
interface EnrichedEntry {
  id: string;
  name: string;
  question: string;
  query: string;
  metrics: string[];
}

interface EnrichmentResponse {
  questions: string[];
}

// Function to enrich metric data using a single OpenAI call
async function enrichMetricData(
  name: string,
  currentDescription: string,
  query: string,
): Promise<EnrichmentResponse> {
  const prompt = `
You are a world-class prompt generator. Given the following information about a PromQL query:

- Name: ${name}
- Current Description: ${currentDescription}
- PromQL Query: ${query}

Generate exactly 3 concise, natural-language descriptions of what this query retrieves. Each description must adhere to the following rules:

1. Do not begin with question words (e.g., "What", "How", "Which").
2. Use fewer than 10 words per description.
3. Make each description unique and semantically different.
4. Exclude any time-related words.
5. Do not include time units like milliseconds, seconds, or minutes.
5. Focus on the key metric, scope, and aggregation.

Return the result as a valid JSON object with exactly one key "questions" whose value is the array of three descriptions. 
No additional text, explanations, or keys should be included.

Example:
- PromQL Query: sum(rate(container_cpu_usage_seconds_total[5m]))
- Possible Output:
{
  "questions": [
    "Total CPU usage rate across containers",
    "Aggregated container CPU utilization rate",
    "Summed CPU consumption rate for containers"
  ]
}

Now generate your output in the same JSON format, following all of the above rules.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that creates statements describing PromQL queries. Always respond with valid JSON.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  try {
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content in response");
    }
    const parsedResponse = JSON.parse(content) as EnrichmentResponse;

    // Validate response format
    if (!Array.isArray(parsedResponse.questions)) {
      throw new Error("Invalid response format");
    }
    return parsedResponse;
  } catch (error) {
    console.error("Error parsing OpenAI response:", error);
    return {
      questions: [],
    };
  }
}

async function transformFile(
  inputPath: string,
  outputPath: string,
): Promise<void> {
  const rawData = fs.readFileSync(inputPath, "utf-8");
  const inputData = JSON.parse(rawData);

  const vectorData: EnrichedEntry[] = [];

  for (const entry of inputData) {
    try {
      const enriched = await enrichMetricData(
        entry.name,
        entry.description,
        entry.query,
      );

      for (const question of enriched.questions) {
        vectorData.push({
          id: uuidv4(),
          name: entry.name,
          question: question,
          query: entry.query,
          metrics: entry.metrics,
        });
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Error processing entry "${entry.name}":`, error);
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(vectorData, null, 2), "utf-8");
  console.log(`Processed: ${inputPath} -> ${outputPath}`);
  await new Promise((resolve) => setTimeout(resolve, 500));
}

fs.readdir(inputDir, (err, files) => {
  if (err) {
    console.error("Error reading input directory:", err);
    return;
  }

  files.forEach((file) => {
    const inputFilePath = path.join(inputDir, file);
    const outputFilePath = path.join(outputDir, file);

    // Process only .json files
    if (path.extname(file).toLowerCase() === ".json") {
      if (fs.existsSync(outputFilePath)) {
        console.log(`Skipping existing file: ${outputFilePath}`);
        return;
      }
      try {
        transformFile(inputFilePath, outputFilePath);
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    }
  });
});
