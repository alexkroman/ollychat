import axios from 'axios';

interface PrometheusMetric {
  metric: Record<string, string>;
  value: [number, string];
}

interface PrometheusQueryResponse {
  status: string;
  data: {
    result: PrometheusMetric[];
  };
}

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

export type QueryExecutor = (query: string) => Promise<string>;

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
  timeout: number = 5000): () => Promise<string> {
  return async function getMetrics(): Promise<string> {
    const response = await axios.get<PrometheusMetadataResponse>(
      `${prometheusUrl}/api/v1/metadata`,
      {
        timeout,
      }
    );
    return JSON.stringify(response.data.data);
  };
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
