import fs from 'fs';
import path from 'path';

// Directories
const inputDir = 'training_data/exports/grafana_dashboards'; // Directory containing JSON files
const outputDir = 'training_data/enriched/grafana_dashboards'; // Directory to save processed files

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Interface for vector database entries
interface EnrichedEntry {
  name: string;
  description: string;
  questions: Array<string>;
  queries: string[];
}

// Function to transform a single file
function transformFile(inputPath: string, outputPath: string): void {
  const rawData = fs.readFileSync(inputPath, 'utf-8');
  const inputData = JSON.parse(rawData);

  const vectorData: EnrichedEntry[] = inputData.map((entry: any) => {
    const name = entry.name || '';
    const description = entry.description || ''; 
    const query = entry.query || '';
    
    return {
      name,
      description,
      query,
    };
  });

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