import { trace } from '@opentelemetry/api'

if (!process.env.OTEL_SERVICE_NAME) {
    throw new Error("BROKER_URL must be configured.")
}

export const tracer = trace.getTracer(process.env.OTEL_SERVICE_NAME)