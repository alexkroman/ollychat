import fs from "fs";
import path from "path";
import { allMetricNames } from "../utils/metricsFetcher.js";
import { extractPromQLMetrics } from "../utils/extractPromMetrics.js";

const allMetrics = allMetricNames;

allMetrics.forEach((name, index) => {
  console.log(`${index + 1}: ${name}`);
});

const inputDir = "data/raw"; // Directory containing JSON files
const outputDir = "data/processed"; // Directory to save processed files

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Interface for vector database entries
interface QueryEntry {
  name: string;
  description: string;
  query: string;
  metrics: string[];
}

// Function to modify a PromQL query
function modifyPromQLQuery(query: string): string {
  query = query.replace(/\[\$__rate_interval\]/g, "[30m]");
  query = query.replace(/\{[^}]*\}/g, "");
  return query;
}

// Function to transform a single file
function transformFile(inputPath: string, outputPath: string): void {
  const rawData = fs.readFileSync(inputPath, "utf-8");
  const grafanaData = JSON.parse(rawData);
  const dashboardDescription = grafanaData.description || "";

  const queryData: QueryEntry[] = [];

  (grafanaData.panels || []).forEach(
    (panel: {
      title: string;
      description?: string;
      targets?: { expr: string }[];
    }) => {
      const name = panel.title + "";
      const description = panel.description || dashboardDescription || "";

      (panel.targets || []).forEach((target: { expr: string }) => {
        if (typeof target.expr === "string") {
          const query = modifyPromQLQuery(target.expr);
          const metrics = extractPromQLMetrics(query);

          const missingMetrics = metrics.filter(
            (metric) => !allMetrics.includes(metric),
          );
          if (missingMetrics.length > 0) {
            //console.warn(`Skipping because metrics don't exist in installation: ${missingMetrics.join(', ')}`);
          }

          if (
            query.trim() !== "" &&
            metrics.length > 0 &&
            missingMetrics.length === 0
          ) {
            console.log(`Adding query: ${name} ${description} Query:${query}`);
            queryData.push({ name, description, query, metrics });
          }
        }
      });
    },
  );

  if (queryData.length > 0) {
    fs.writeFileSync(outputPath, JSON.stringify(queryData, null, 2), "utf-8");
    console.log(`File written successfully to ${outputPath}`);
  } else {
    //console.warn(`No valid query data to write. Skipping file creation.`);
  }
}

// Process all JSON files in the input directory
fs.readdir(inputDir, (err, files) => {
  if (err) {
    console.error("Error reading input directory:", err);
    return;
  }

  files.forEach((file) => {
    const inputFilePath = path.join(inputDir, file);
    const outputFilePath = path.join(outputDir, file);

    if (path.extname(file).toLowerCase() === ".json") {
      try {
        transformFile(inputFilePath, outputFilePath);
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    }
  });
});
