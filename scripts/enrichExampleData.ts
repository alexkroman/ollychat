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
  metrics: string[];
  description: string;
  query: string;
  question: string;
}

interface EnrichmentResponse {
    metrics: string[];
    description: string;
    questions: string[];
  }

// Function to enrich metric data using a single OpenAI call
async function enrichMetricData(
    name: string, 
    currentDescription: string, 
    query: string
  ): Promise<EnrichmentResponse> {
    const prompt = `Given a Grafana dashboard query with the following details:
  Name: ${name}
  Current Description: ${currentDescription}
  PromQL query: ${query}
  
  Provide the following information in JSON format:
  
  1. description: A comprehensive but concise description that explains what the PromQL query measures
  
  2. metrics: Identify and extract all metric names from the query. A metric name is typically a string that:
    - Appears before any {, (, or other operators (e.g., node_cpu_seconds_total in rate(node_cpu_seconds_total[5m])).
    - Can be surrounded by functions, filters, or time ranges.

  3. questions: Guess 3 different questions that this PromQL query is answering.
    - Return just the questions without any additional explanation
    - Do not say "This Prom query is answering..." or similar phrases
    - Do not reference time in the question
  
Format the response as a JSON object with these exact keys: description, and questions (as an array).`;
  
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are a helpful assistant that analyzes monitoring metrics. Always respond with valid JSON."
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
      if ( !parsedResponse.description || !Array.isArray(parsedResponse.metrics) || !Array.isArray(parsedResponse.questions)) {
        throw new Error('Invalid response format');
      }
 
      return parsedResponse;
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      // Return fallback values if parsing fails
      return {
        description: currentDescription || name,
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
      const id = uuidv4();
      const { name = '', description = '', query = '' } = entry;
  
      try {
        const enriched = await enrichMetricData(name, description, query);
        enriched.questions.forEach((question) => {
          vectorData.push({
            id: uuidv4(),
            name,
            description: enriched.description,
            question,
            query,
            metrics: enriched.metrics,
          });
        });
      } catch (error) {
        console.error(`Error processing metric "${name}":`, error);
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