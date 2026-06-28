/**
 * Anomaly Detector Utility
 * Evaluates raw metrics against defined threshold rules.
 */

export const THRESHOLDS = {
  cpu: 80,         // CPU Usage > 80%
  memory: 85,      // Memory Usage > 85%
  latency: 500,    // Response Latency > 500ms
  error: 5,        // Error Rate > 5%
};

export function detectAnomalies(metrics) {
  if (!metrics) return { states: {}, list: [] };

  const states = {
    cpu: (metrics.cpu_usage_percent || 0) > THRESHOLDS.cpu,
    memory: (metrics.memory_usage_percent || 0) > THRESHOLDS.memory,
    latency: (metrics.http_response_latency_ms || 0) > THRESHOLDS.latency,
    error: (metrics.application_error_rate_percent || 0) > THRESHOLDS.error,
  };

  const list = [];

  if (states.cpu) {
    list.push({
      metric: 'cpu',
      name: 'CPU Utilization',
      value: metrics.cpu_usage_percent,
      threshold: THRESHOLDS.cpu,
      unit: '%',
      alertType: 'High Load Alert'
    });
  }

  if (states.memory) {
    list.push({
      metric: 'memory',
      name: 'Memory Utilization',
      value: metrics.memory_usage_percent,
      threshold: THRESHOLDS.memory,
      unit: '%',
      alertType: 'Memory Pressure Alert'
    });
  }

  if (states.latency) {
    list.push({
      metric: 'latency',
      name: 'Response Latency',
      value: metrics.http_response_latency_ms,
      threshold: THRESHOLDS.latency,
      unit: 'ms',
      alertType: 'Performance Alert'
    });
  }

  if (states.error) {
    list.push({
      metric: 'error',
      name: 'Application Error Rate',
      value: metrics.application_error_rate_percent,
      threshold: THRESHOLDS.error,
      unit: '%',
      alertType: 'Failure Alert'
    });
  }

  return { states, list };
}
