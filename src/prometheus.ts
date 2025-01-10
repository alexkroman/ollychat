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
  timeout: number = 5000
): QueryExecutor {
  return async function executeQuery(query: string): Promise<string> {
    const response = await axios.get<PrometheusQueryResponse>(
      `${prometheusUrl}/api/v1/query`,
      {
        params: { query },
        timeout,
      }
    );
    // Return the raw JSON string of the result array
    return JSON.stringify(response.data.data.result);
  };
}

export function createMetadataFetcher(
  prometheusUrl: string,
  timeout: number = 5000
): () => Promise<string> {
  return async function getMetadata(): Promise<string> {
    const response = await axios.get<PrometheusMetadataResponse>(
      `${prometheusUrl}/api/v1/metadata`,
      {
        timeout,
      }
    );
    // Return a simple comma-separated list of all metric names
    return Object.keys(response.data.data).join(', ');
  };
}