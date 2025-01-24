import axios from 'axios';

interface PrometheusMetadataResponse {
  status: string;
  data: Record<
    string,
    Array<{
      type: string;
      help: string;
      unit?: string;
    }>
  >;
}

interface PrometheusSeriesResponse {
  status: string;
  data: Array<Record<string, string>>;
}

export function createMetricsFetcher(
  prometheusUrl: string,
  timeout: number = 5000
): () => Promise<string> {
  return async function getMetrics(): Promise<string> {
    // 1. Fetch metadata
    const metadataResponse = await axios.get<PrometheusMetadataResponse>(
      `${prometheusUrl}/api/v1/metadata`,
      {
        timeout,
      }
    );
    const metadata = metadataResponse.data.data;

    // 2. Fetch all series
    const seriesResponse = await axios.get<PrometheusSeriesResponse>(
      `${prometheusUrl}/api/v1/series`,
      {
        timeout,
        params: { 'match[]': '{__name__=~".+"}' },
      }
    );
    const allSeries = seriesResponse.data.data;

    const metricLabelsMap: Record<
      string,
      Record<string, Set<string>>
    > = {};

    // 3. Build up the label key/value sets per metric
    for (const series of allSeries) {
      const metricName = series['__name__'];
      if (!metricName) continue;

      if (!metricLabelsMap[metricName]) {
        metricLabelsMap[metricName] = {};
      }

      // For each label key-value in this series, track them
      for (const [labelKey, labelValue] of Object.entries(series)) {
        // Skip __name__ if you don't want to treat it as a normal label
        if (labelKey === '__name__') continue;

        if (!metricLabelsMap[metricName][labelKey]) {
          metricLabelsMap[metricName][labelKey] = new Set<string>();
        }
        metricLabelsMap[metricName][labelKey].add(labelValue);
      }
    }

    // 4. Combine the metadata and label sets into a final structure
    const combinedData = Object.keys(metadata).map((metricName) => {
      // All metadata entries for this metric name
      const metaEntries = metadata[metricName] || [];

      // All label keys and their possible values for this metric
      const labelsRecord = metricLabelsMap[metricName] || {};
      // Convert that record into an array of { key, values[] }
      const labels = Object.entries(labelsRecord).map(
        ([labelKey, labelValuesSet]) => ({
          labelKey,
          values: Array.from(labelValuesSet),
        })
      );

      return {
        metricName,
        metadata: metaEntries,
        labels,
      };
    });

    // 5. Return JSON
    return JSON.stringify(combinedData, null, 2);
  };
}
