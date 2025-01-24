import fs from "fs/promises";
import {
  fetchPrometheusMetrics,
  fetchPrometheusLabels,
  fetchAllPrometheusLabelValues,
} from "../integrations/prometheus.js";

async function fetchAndSaveMetrics(): Promise<void> {
  try {
    const metrics: string[] = await fetchPrometheusMetrics();
    await saveToFile("metrics.json", metrics);
  } catch (error) {
    console.error("Failed to fetch and save metrics:", getErrorMessage(error));
  }
}

async function fetchAndSaveLabels(): Promise<void> {
  try {
    const labels: string[] = await fetchPrometheusLabels();
    await saveToFile("labels.json", labels);
  } catch (error) {
    console.error("Failed to fetch and save labels:", getErrorMessage(error));
  }
}

async function fetchAndSaveLabelValues(): Promise<void> {
  try {
    const labelValues = await fetchAllPrometheusLabelValues();
    await saveToFile("values.json", labelValues);
  } catch (error) {
    console.error(
      "Failed to fetch and save label values:",
      getErrorMessage(error),
    );
    throw error;
  }
}

async function saveToFile(fileName: string, data: unknown): Promise<void> {
  const dirPath = "data/metrics";
  await fs.mkdir(dirPath, { recursive: true });

  const filePath = `${dirPath}/${fileName}`;
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));

  console.log(`${fileName} successfully saved to ${filePath}`);
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "An unknown error occurred";
}

// Execute all fetch-and-save operations in parallel
(async () => {
  try {
    await Promise.all([
      fetchAndSaveMetrics(),
      fetchAndSaveLabels(),
      fetchAndSaveLabelValues(),
    ]);
  } catch (error) {
    console.error("Script execution failed:", getErrorMessage(error));
    process.exit(1);
  }
})();
