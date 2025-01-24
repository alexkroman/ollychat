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

interface PrometheusQueryResponse {
  status: string;
  data: {
    result: PrometheusMetric[];
  };
}

interface PrometheusMetric {
  metric: Record<string, string>;
  value: [number, string];
}

type PrometheusMetricFormatted = {
  metric: {
    __name__: string;
    env: string;
    id: string;
    instance: string;
    job: string;
  };
  value: [number, string];
};

interface PrometheusSeriesResponse {
  status: string;
  data: Array<Record<string, string>>;
}

export type QueryExecutor = (query: string) => Promise<string>;

export function metricsToStructuredJSON(data: PrometheusMetricFormatted[]): object {
  if (data.length === 0) return [];

  return data.map(({ metric, value }) => ({
    metricName: metric.__name__,
    serviceId: metric.id,
    instance: metric.instance,
    job: metric.job,
    timestamp: value[0],
    value: parseFloat(value[1])
    }));
  }

export function createQueryExecutor(
  prometheusUrl: string,
  timeout: number = 5000): QueryExecutor {
  return async function executeQuery(query: string): Promise<string> {
    const response = await axios.get<PrometheusQueryResponse>(
      `${prometheusUrl}/api/v1/query`,
      {
        params: { query },
        timeout,
      }
    );
    const result = response.data.data.result;
    
    if (Array.isArray(result) && result.length > 0 && 'metric' in result[0]) {
      return JSON.stringify(metricsToStructuredJSON(result as PrometheusMetricFormatted[]));
    }
    
    return JSON.stringify(result);
  };
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
