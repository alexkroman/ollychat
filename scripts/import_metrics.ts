import fs from 'fs';
import * as dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

import { createQueryExecutor, createMetricsFetcher } from '../src/prometheus.js';

const prometheusUrl = process.env.PROMETHEUS_URL || 'http://localhost:9090'

const getMetricsFetcher = createMetricsFetcher(prometheusUrl);

const results = await getMetricsFetcher();

const metricsArray = results.split(',').map(metric => {
    const name = metric.trim();
    const description = ``; 
    return { 
        name: name,
        description: description
    };
  });

// Create metrics.json file with the array of metrics

fs.writeFile('training_data/metrics/metrics.json', JSON.stringify(metricsArray, null, 2), (err) => {
  if (err) {
    console.error('Error writing to metrics.json:', err);
  } else {
    console.log('metrics.json file created successfully!');
  }
});