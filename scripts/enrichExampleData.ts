import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';
import { OpenAI } from 'openai';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Directories
const inputDir = 'data/processed'; // Directory containing JSON files
const outputDir = 'data/enriched'; // Directory to save processed files

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
  metrics: string[];
  questions: string[];
}

// Function to enrich metric data using a single OpenAI call
async function enrichMetricData(
  name: string,
  currentDescription: string,
  query: string
): Promise<EnrichmentResponse> {
  const prompt = `
  Given a Grafana dashboard query with the following details:
Name: ${name}
Current Description: ${currentDescription}
PromQL query: ${query}

1. Extract all metric names from the PromQL query. 
   - A metric name is typically the string that appears before any '{', '(', or other operators (e.g., "node_cpu_seconds_total" in rate(node_cpu_seconds_total[5m])).
   - It can be surrounded by functions, filters, or time ranges.
   - If multiple metrics are found, include them all. If none are found, return an empty array.

2. Generate 3 different questions that this query might be used to answer.
  - Be concise (fewer than 20 words)
  - Avoid referencing time (e.g., do not include phrases like “over the last hour”)
  - Not say “This query is answering…” or provide explanations
  - Reflect different, distinct angles or perspectives of how someone might ask about this data
  - Contain enough context to uniquely match relevant information in a vector store (i.e., each question should hint at a different dimension of the query)
  - Return them as simple strings in an array, e.g. ["Question 1", "Question 2", "Question 3"]

3. Return the result as **valid JSON** with exactly these two keys:
   - "metrics": an array of metric names
   - "questions": an array of questions

4. **Output Format**:
   - Do not include any additional text, explanations, or keys.
   - The output must be a single JSON object, for example:

   {
     "metrics": ["metric1", "metric2"],
     "questions": ["Question 1", "Question 2", "Question 3"]
   }
`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that creates questions from PromQL queries. Always respond with valid JSON."
      },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7
  });

  try {
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content in response');
    }
    const parsedResponse = JSON.parse(content) as EnrichmentResponse;

    // Validate response format
    if (!Array.isArray(parsedResponse.metrics) || !Array.isArray(parsedResponse.questions)) {
      throw new Error('Invalid response format');
    }
    return parsedResponse;
  } catch (error) {
    console.error('Error parsing OpenAI response:', error);
    return {
      questions: [],
      metrics: []

    };
  }
}

async function transformFile(inputPath: string, outputPath: string): Promise<void> {
  const rawData = fs.readFileSync(inputPath, 'utf-8');
  const inputData = JSON.parse(rawData);

  const vectorData: EnrichedEntry[] = [];

  for (const entry of inputData) {
    try {
      for (const query of entry.queries) { 
        const enriched = await enrichMetricData(entry.name, entry.description, query);

        for (const question of enriched.questions) {
          vectorData.push({
            id: uuidv4(),
            name: entry.name,
            question: question,
            query: query,
            metrics: enriched.metrics,
          });
        }
      }
    } catch (error) {
      console.error(`Error processing entry "${entry.name}":`, error);
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(vectorData, null, 2), 'utf-8');
  console.log(`Processed: ${inputPath} -> ${outputPath}`);
}

fs.readdir(inputDir, (err, files) => {
  if (err) {
    console.error('Error reading input directory:', err);
    return;
  }

  files.forEach((file) => {
    const inputFilePath = path.join(inputDir, file);
    const outputFilePath = path.join(outputDir, file);

    // Process only .json files
    if (path.extname(file).toLowerCase() === '.json') {
      try {
        transformFile(inputFilePath, outputFilePath);
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    }
  });
});