import fs from 'fs/promises';
import { createMetricsFetcher } from '../integrations/prometheusIntegration.js';
import { config } from '../config/config.js';


interface RawMetric {
  metricName: string;
  metadata: Array<{
    type: string;
    help: string;
    unit?: string;
  }>;
  labels: Array<{
    labelKey: string;
    values: string[];
  }>;
}

// Our final output shape.
// We still flatten each entry in `metadata` into a separate record.
// Now, `labels` is preserved as an array of objects with key/values.
interface OutputData {
  name: string;
  help: string;
  type: string;
  unit: string;
  labels: Array<{
    labelKey: string;
    values: string[];
  }>;
}

const prometheusUrl: string = config.prometheusUrl;

async function fetchAndSaveMetrics(): Promise<void> {
  try {
    // 1) Fetch the metrics from Prometheus
    const metricsFetcher = createMetricsFetcher(prometheusUrl);
    const rawData: RawMetric[] = JSON.parse(await metricsFetcher());

    // 2) Transform data into desired format
    //    - Flatten out each `metadata` entry.
    //    - Carry over the full labels array (labelKey => values).
    const formattedMetrics: OutputData[] = rawData.flatMap((rm) => {
      return rm.metadata.map((m) => ({
        name: rm.metricName,
        help: m.help,
        type: m.type,
        unit: m.unit ?? '',
        labels: rm.labels,
      }));
    });

    // 3) Ensure directory exists
    const dirPath = 'data/metrics';
    await fs.mkdir(dirPath, { recursive: true });

    // 4) Write data to metrics.json
    const filePath = `${dirPath}/metrics.json`;
    await fs.writeFile(filePath, JSON.stringify(formattedMetrics, null, 2));

    console.log(`Metrics successfully saved to ${filePath}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Failed to fetch and save metrics:', errorMessage);
    throw error; // Re-throw if you want to handle it further up
  }
}

// Execute with proper error handling
fetchAndSaveMetrics().catch((error) => {
  console.error('Script execution failed:', error);
  process.exit(1);
});
