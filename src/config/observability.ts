import winston from 'winston';
import * as promClient from 'prom-client';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

// Winston Logger
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Prometheus Registry
export const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

// Custom Metrics
export const metrics = {
  httpRequestDuration: new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'] as const,
    registers: [register]
  }),

  urlShortenerCounter: new promClient.Counter({
    name: 'url_shortener_requests_total',
    help: 'Total number of URL shortening requests',
    labelNames: ['status'] as const,
    registers: [register]
  })
};

// OpenTelemetry SDK
export const sdk = new NodeSDK({
  instrumentations: [getNodeAutoInstrumentations()],
  serviceName: 'url-shortener',
});

if (process.env.ENABLE_TELEMETRY === 'true') {
  sdk.start();
} 