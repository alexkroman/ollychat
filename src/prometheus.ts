import axios, { AxiosError } from 'axios';

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
  data: Record<string, Array<{
    type: string;
    help: string;
    unit?: string;
  }>>;
}

interface QueryConfig {
  query: string;
  prometheusUrl: string;
  timeout?: number;
}

type QueryExecutor = () => Promise<string>;

class PrometheusError extends Error {
  constructor(
    message: string,
    public readonly status?: string,
    public readonly originalError?: AxiosError
  ) {
    super(message);
    this.name = 'PrometheusError';
  }
}

export function createQueryExecutor(config: QueryConfig): QueryExecutor {
  let cachedResult: Promise<string> | null = null;
  const { query, prometheusUrl, timeout = 5000 } = config;

  return async function executeQuery(): Promise<string> {
    if (!cachedResult) {
      cachedResult = axios
        .get<PrometheusQueryResponse>(`${prometheusUrl}/api/v1/query`, {
          params: { query },
          timeout,
        })
        .then((response) => {
          if (response.data.status !== 'success') {
            throw new PrometheusError(
              'Query failed',
              response.data.status
            );
          }

          return response.data.data.result
            .map((item) => Object.keys(item.metric))
            .flat()
            .filter((value, index, self) => self.indexOf(value) === index)
            .join(', ');
        })
        .catch((error: AxiosError) => {
          console.error('Failed to fetch Prometheus metadata:', error);
          cachedResult = null;
          throw new PrometheusError(
            'Failed to fetch Prometheus metadata',
            undefined,
            error
          );
        });
    }

    return cachedResult;
  };
}

export function createMetadataFetcher(prometheusUrl: string, timeout: number = 5000): () => Promise<string> {
  let cachedResult: Promise<string> | null = null;

  return async function getMetadata(): Promise<string> {
    if (!cachedResult) {
      cachedResult = axios
        .get<PrometheusMetadataResponse>(`${prometheusUrl}/api/v1/metadata`, {
          timeout,
        })
        .then((response) => {
          if (response.data.status !== 'success') {
            throw new PrometheusError(
              'Metadata fetch failed',
              response.data.status
            );
          }
          return Object.keys(response.data.data).join(', ');
        })
        .catch((error: AxiosError) => {
          console.error('Failed to fetch Prometheus metadata:', error);
          cachedResult = null;
          throw new PrometheusError(
            'Failed to fetch Prometheus metadata',
            undefined,
            error
          );
        });
    }

    return cachedResult;
  };
}

export function createUncachedQueryExecutor(config: QueryConfig): QueryExecutor {
  const { query, prometheusUrl, timeout = 5000 } = config;

  return async function executeQuery(): Promise<string> {
    try {
      const response = await axios.get<PrometheusQueryResponse>(
        `${prometheusUrl}/api/v1/query`,
        {
          params: { query },
          timeout,
        }
      );

      if (response.data.status !== 'success') {
        throw new PrometheusError(
          'Query failed',
          response.data.status
        );
      }

      return response.data.data.result
        .map((item) => Object.keys(item.metric))
        .flat()
        .filter((value, index, self) => self.indexOf(value) === index)
        .join(', ');
    } catch (error) {
      if (error instanceof Error) {
        throw new PrometheusError(
          'Failed to fetch Prometheus metadata',
          undefined,
          error instanceof AxiosError ? error : undefined
        );
      }
      throw error;
    }
  };
}