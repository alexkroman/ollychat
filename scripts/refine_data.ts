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
const inputDir = 'training_data/exports/grafana_dashboards'; // Directory containing JSON files
const outputDir = 'training_data/enriched/grafana_dashboards'; // Directory to save processed files



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
  unit: string;
  unit_description: string;
  example_value: string;
  question: string;
}

interface EnrichmentResponse {
    metrics: string[];
    unit: string;
    unit_description: string;
    example_value: string;
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
  Query: ${query}
  
  Provide the following information in JSON format:
  
  1. unit: The unit of measurement for this metric. Choose from:
     - percentage (for metrics measuring percentages or ratios)
     - time (for durations, latency, or time periods)
     - bytes (for memory, storage, or data size)
     - count (for counting events, requests, or errors)
     - requests_per_second (for throughput metrics)
     - bytes_per_second (for bandwidth metrics)
     - currency (for financial metrics)
     - temperature (for system temperature metrics)
     - voltage (for power-related metrics)
     - unknown (if unit cannot be determined)
  
    2. unit_description: A concise explanation of the unit. This should clarify:
    - What the unit represents
    - How it relates to the metric (e.g., if the unit is time, describe whether it represents duration, latency, etc.).
    - Any additional context that helps interpret the metric's values.

    3. example_value: A realistic example value for this metric. The example value should:
    - Be representative of typical values for this metric.
    - Include the unit for clarity (e.g., 85%, 120 ms, 500 MB, 15 requests/second).
    - Use a format that aligns with the unit type, as outlined below:
        - percentage: A value between 0% and 100%.
        - time: A value in seconds, milliseconds, or minutes.
        - bytes: A value in KB, MB, GB, or TB.
        - count: A whole number (e.g., number of events, requests, errors).
        - requests_per_second: A positive number, typically between 1 and 10,000.
        - bytes_per_second: A value in KB/s, MB/s, or GB/s.
        - currency: A value in USD or other currencies, with a typical range for financial metrics.
        - temperature: A value in degrees Celsius or Fahrenheit.
        - voltage: A value in volts (e.g., 3.3V, 12V).
        - unknown: Provide a reasonable number if no unit-specific context is available.

  4. description: A comprehensive but concise description that explains:
     - What this metric measures
     - Why it's important
     - What insights it provides
     (If the current description is over 100 characters, return it unchanged)
  
  5. metrics: Identify and extract all metric names from the query. A metric name is typically a string that:
    - Appears before any {, (, or other operators (e.g., node_cpu_seconds_total in rate(node_cpu_seconds_total[5m])).
    - Can be surrounded by functions, filters, or time ranges.

  5. questions: Generate 3-5 relevant questions that this query could answer, focusing on operational insights.
  
  Format the response as a JSON object with these exact keys: unit, description, and questions (as an array).`;
  
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
      if (!parsedResponse.unit || !parsedResponse.unit_description || !parsedResponse.example_value || !parsedResponse.description || !Array.isArray(parsedResponse.metrics) || !Array.isArray(parsedResponse.questions)) {
        throw new Error('Invalid response format');
      }
 
      return parsedResponse;
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      // Return fallback values if parsing fails
      return {
        unit: 'unknown',
        unit_description: 'Unit could not be determined',
        example_value: '0',
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
            unit: enriched.unit,
            unit_description: enriched.unit_description,
            example_value: enriched.example_value,
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
  


// Process all JSON files in the input directory
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