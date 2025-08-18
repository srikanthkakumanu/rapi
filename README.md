# RAPI

A simple RESTful API that uses the below mentioned tech stack:

- **Framework**: Node.js, Express.js
- **Database**: PostgreSQL (via Neon serverless)
- **Logging**: Winston
- **Observability**: OpenTelemetry for traces and metrics, with exporters for:
  - **New Relic**: For production monitoring, APM, and log correlation.
  - **Zipkin**: For local or open-source tracing.

## Observability

This application is instrumented with OpenTelemetry, providing traces, metrics, and context-enriched logs.

- **Tracing**: Traces are exported to New Relic and/or Zipkin, depending on the environment configuration.
- **Logging**: Logs are enriched with `trace_id` and `span_id` and are written in JSON format to `logs/app.log`. These can be forwarded to a log aggregator like New Relic Logs using a log forwarder (e.g., New Relic's infrastructure agent). Console logs remain in a human-readable format for development.
- **Logging**: The application uses `winston` for logging. When a New Relic license key is provided, logs are automatically enriched with `trace_id` and `span_id` and sent directly to New Relic Logs via OTLP. This enables automatic log-to-trace correlation in the New Relic UI. For local development, logs are also printed to the console.

## Environment Variables

To run this application, you will need to create a `.env` file in the root and add the following environment variables:

```
PORT=3333
DATABASE_URL="your_neon_database_connection_string"
JWT_SECRET="your_jwt_secret"

# OpenTelemetry & Exporter Configuration
NEW_RELIC_APP_NAME="rapi" # In development mode, "-dev" will be appended to this name.
NEW_RELIC_LICENSE_KEY="your_new_relic_license_key" # Enables New Relic exporter
NEW_RELIC_OTLP_ENDPOINT="https://otlp.eu01.nr-data.net" # Optional: Use "https://otlp.nr-data.net" for US accounts.
OTEL_EXPORTER_ZIPKIN_ENDPOINT="http://localhost:9411/api/v2/spans" # Enables Zipkin exporter
```

## Running zipkin locally with Docker

`bash docker run -d -p 9411:9411 openzipkin/zipkin`
