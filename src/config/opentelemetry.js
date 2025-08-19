// src/config/opentelemetry.js
const { NodeSDK } = require('@opentelemetry/sdk-node');
const {
  OTLPTraceExporter,
} = require('@opentelemetry/exporter-trace-otlp-http');
const {
  OTLPMetricExporter,
} = require('@opentelemetry/exporter-metrics-otlp-http');
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin');
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const { Resource } = require('@opentelemetry/resources');
const {
  SemanticResourceAttributes,
} = require('@opentelemetry/semantic-conventions');
const {
  BatchSpanProcessor,
  ConsoleSpanExporter,
} = require('@opentelemetry/sdk-trace-base');
const { BatchLogRecordProcessor } = require('@opentelemetry/sdk-logs');
const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');
const logger = require('../utils/logger');

// --- Configuration ---
const appName = process.env.NEW_RELIC_APP_NAME || 'tapi';
const isDev = process.env.NODE_ENV === 'development';
const serviceName = isDev ? `${appName}-dev` : appName;
const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
});

const newRelicOtlpEndpoint =
  process.env.NEW_RELIC_OTLP_ENDPOINT || 'https://otlp.nr-data.net';

const spanProcessors = [];
const logRecordProcessors = [];
let metricReader;

// --- New Relic Exporters ---
const newRelicLicenseKey = process.env.NEW_RELIC_LICENSE_KEY;
if (newRelicLicenseKey) {
  logger.info(
    `New Relic license key found. Configuring exporters for endpoint: ${newRelicOtlpEndpoint}`
  );
  const newRelicHeaders = { 'api-key': newRelicLicenseKey };

  // Configure the New Relic Metric Exporter
  metricReader = new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: `${newRelicOtlpEndpoint}/v1/metrics`,
      headers: newRelicHeaders,
    }),
    exportIntervalMillis: 5000, // Export metrics every 5 seconds
  });

  // Configure the New Relic Trace Exporter
  const newRelicExporter = new OTLPTraceExporter({
    url: `${newRelicOtlpEndpoint}/v1/traces`,
    headers: newRelicHeaders,
  });
  spanProcessors.push(new BatchSpanProcessor(newRelicExporter));

  // Configure the New Relic Log Exporter
  // This will send logs directly to New Relic, bypassing the need for a log forwarder.
  const newRelicLogExporter = new OTLPLogExporter({
    url: `${newRelicOtlpEndpoint}/v1/logs`,
    headers: newRelicHeaders,
  });
  logRecordProcessors.push(new BatchLogRecordProcessor(newRelicLogExporter));
  logger.info('New Relic OTLP Log exporter configured.');
} else {
  logger.warn('NEW_RELIC_LICENSE_KEY not set. New Relic exporter is disabled.');
}

// --- Zipkin Exporter ---
const zipkinEndpoint = process.env.OTEL_EXPORTER_ZIPKIN_ENDPOINT;
if (zipkinEndpoint) {
  const zipkinExporter = new ZipkinExporter({
    url: zipkinEndpoint,
    serviceName,
  });
  spanProcessors.push(new BatchSpanProcessor(zipkinExporter));
  logger.info(
    `Zipkin OpenTelemetry exporter configured for endpoint: ${zipkinEndpoint}`
  );
} else {
  logger.warn(
    'OTEL_EXPORTER_ZIPKIN_ENDPOINT not set. Zipkin exporter is disabled.'
  );
}

// --- Console Exporter (for development/debugging) ---
if (process.env.NODE_ENV === 'development') {
  spanProcessors.push(new BatchSpanProcessor(new ConsoleSpanExporter()));
  logger.info('Console span exporter enabled for development.');
}

// If no exporters are configured, don't start the SDK.
if (
  spanProcessors.length === 0 &&
  !metricReader &&
  logRecordProcessors.length === 0
) {
  logger.warn(
    'No OpenTelemetry exporters configured. Tracing, metrics, and logs will be disabled.'
  );
  return;
}

const sdk = new NodeSDK({
  resource,
  spanProcessors,
  logRecordProcessors,
  metricReader,
  instrumentations: [
    getNodeAutoInstrumentations({
      // Disable noisy instrumentations if necessary
      '@opentelemetry/instrumentation-fs': {
        enabled: false,
      },
    }),
  ],
});

// Gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => logger.info('OpenTelemetry terminated successfully.'))
    .catch((error) => logger.error('Error terminating OpenTelemetry', error))
    .finally(() => process.exit(0));
});

try {
  sdk.start();
  logger.info('OpenTelemetry SDK started successfully.');
} catch (error) {
  logger.error('Error starting OpenTelemetry SDK:', error);
  process.exit(1);
}
