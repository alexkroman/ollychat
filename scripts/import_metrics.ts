import fs from 'fs/promises';
import * as dotenv from 'dotenv';
import { createMetricsFetcher } from '../src/prometheus.js';

// Load environment variables
dotenv.config();

// Define interfaces instead of types for better object modeling
interface Metric {
    type: string;
    unit: string;
    help: string;
}

interface OutputData {
    name: string;
    help: string;
}

interface MetricsResult {
    [key: string]: Metric[];
}

// Set Prometheus URL with type safety
const prometheusUrl: string = process.env.PROMETHEUS_URL || 'http://localhost:9090';

async function fetchAndSaveMetrics(): Promise<void> {
    try {
        // Fetch metrics from Prometheus
        const metricsFetcher = createMetricsFetcher(prometheusUrl);
        const results: MetricsResult = JSON.parse(await metricsFetcher());

        // Transform data into desired format with type safety
        const formattedMetrics: OutputData[] = Object.entries(results).flatMap(
            ([key, metrics]) => 
                metrics.map((metric: Metric) => ({
                    name: key,
                    help: metric.help
                }))
        );

        // Ensure directory exists
        const dirPath = 'training_data/metrics';
        await fs.mkdir(dirPath, { recursive: true });

        // Write to metrics.json file
        const filePath = `${dirPath}/metrics.json`;
        await fs.writeFile(
            filePath, 
            JSON.stringify(formattedMetrics, null, 2)
        );

        console.log(`Metrics successfully saved to ${filePath}`);
    } catch (error) {
        // Proper error handling with type casting
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('Failed to fetch and save metrics:', errorMessage);
        throw error; // Re-throw to allow handling by caller if needed
    }
}

// Execute with proper error handling
fetchAndSaveMetrics()
    .catch((error) => {
        console.error('Script execution failed:', error);
        process.exit(1);
    });