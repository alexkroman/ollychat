import fs from 'fs';
import path from 'path';
import { allMetricNames } from '../utils/metricsFetcher.js';

const allMetrics = allMetricNames;

allMetrics.forEach((name, index) => {
  console.log(`${index + 1}: ${name}`);
});

const inputDir = 'data/raw'; // Directory containing JSON files
const outputDir = 'data/processed'; // Directory to save processed files

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

function extractPromQLMetrics(query: string): string[] {
  const metricRegex = /[a-zA-Z_:][a-zA-Z0-9_:]*/g;
  const promQLFunctions = new Set([
      "sum", "avg", "min", "max", "count", "rate", "irate", "delta", "increase", "topk", "bottomk",
      "quantile", "sort", "sort_desc", "sort_asc", "stddev", "stdvar", "abs", "clamp_max", "clamp_min",
      "by", "m", "oninstance", "job", "__range", "count_over_time", "sum_over_time", "avg_over_time","__interval",
      "or", "histogram_quantile", "label_replace", "label_join", "receiver", "instance", "job", "namespace","exporter",
      "grouping", "le","exp","service_name","title","name","pod","s","method","path","h","type","level","location",
      "and","realm","kind","ref","unless","node","code","interval","requestKind","controller","d","on","group_left","interval",
      "time","changes","d:1d","d:1h","d:1m","d:1s","d:1w","d:1y","d:2d","d:2h","d:2m","d:2s","d:2w","d:2y","d:3d","d:3h",
      "Identifier","OR","info","proto","type","zone","service","container_name","pod_name","pod_namespace","pod_uid",
      "interval","mount","vector","time","volume","project","version","task_execution_id","task_name","cluster","predict_linear",
      "status", "gpu","Interval","datname","i","searchable_pattern","job_name","query","verb","policy_name","stream",
      "flag","value","round","status","verb","BY",
  ]);

  const metrics = new Set<string>();
  const matches = query.match(metricRegex);
  if (matches) {
      matches.forEach(metric => {
          if (!promQLFunctions.has(metric) && !metric.includes("(")) {
              metrics.add(metric);
          }
      });
  }
  return Array.from(metrics).sort();
}

// Function to modify a PromQL query
function modifyPromQLQuery(query: string): string {
  query = query.replace(/\[\$__rate_interval\]/g, '[30m]');
  query = query.replace(/\{[^}]*\}/g, '');
  return query;
}

// Function to transform a single file
function transformFile(inputPath: string, outputPath: string): void {
  const rawData = fs.readFileSync(inputPath, 'utf-8');
  const grafanaData = JSON.parse(rawData);

  const queryData: QueryEntry[] = [];

  (grafanaData.panels || []).forEach((panel: any) => {
    const name = panel.title || '';
    const description = panel.description || ''; 

    (panel.targets || []).forEach((target: any) => {
      if (typeof target.expr === 'string') {
        const query = modifyPromQLQuery(target.expr);
        const metrics = extractPromQLMetrics(query);

        const missingMetrics = metrics.filter(metric => !allMetrics.includes(metric));
        if (missingMetrics.length > 0) { 
          console.warn(`Skipping because metrics don't exist in installation: ${missingMetrics.join(', ')}`);
        }

        if (query.trim() !== "" && metrics.length > 0 && missingMetrics.length === 0) {
          queryData.push({ name, description, query, metrics });
        }
      }
    });
  });

  if (queryData.length > 0) {
    fs.writeFileSync(outputPath, JSON.stringify(queryData, null, 2), 'utf-8');
    console.log(`File written successfully to ${outputPath}`);
  } else {
    console.warn(`No valid query data to write. Skipping file creation.`);
  }
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

    if (path.extname(file).toLowerCase() === '.json') {
      try {
        transformFile(inputFilePath, outputFilePath);
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    }
  });
});