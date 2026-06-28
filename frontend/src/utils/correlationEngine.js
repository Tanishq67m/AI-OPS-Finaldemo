/**
 * Correlation Engine Utility
 * Groups individual anomalies into correlated incidents based on defined rules.
 */

export function correlateAnomalies(anomalyStates, current, previous) {
  const { cpu, memory, latency, error } = anomalyStates;

  // Calculate trends (deltas) for Resource Saturation rule
  const deltaCpu = previous ? (current.cpu_usage_percent - previous.cpu_usage_percent) : 0;
  const deltaMem = previous ? (current.memory_usage_percent - previous.memory_usage_percent) : 0;

  // 1. Full System Overload (All 4 metrics breached)
  if (cpu && memory && latency && error) {
    return {
      type: 'full_system_overload',
      name: 'Full System Overload',
      affectedMetrics: ['cpu', 'memory', 'latency', 'error'],
      suppress: ['cpu', 'memory', 'latency', 'error']
    };
  }

  // 2. Resource Saturation: CPU + Memory co-elevation with increasing trends
  if (cpu && memory && deltaCpu >= 0 && deltaMem >= 0) {
    return {
      type: 'resource_saturation',
      name: 'Resource Saturation',
      affectedMetrics: ['cpu', 'memory'],
      suppress: ['cpu', 'memory']
    };
  }

  // 3. Service Overload: CPU + Latency co-occurrence
  if (cpu && latency) {
    return {
      type: 'service_overload',
      name: 'Service Overload',
      affectedMetrics: ['cpu', 'latency'],
      suppress: ['cpu', 'latency']
    };
  }

  // 4. Downstream Dependency Failure: High error rate + stable memory
  if (error && !memory) {
    return {
      type: 'downstream_dependency_failure',
      name: 'Downstream Dependency Failure',
      affectedMetrics: ['error'],
      suppress: ['error']
    };
  }

  return {
    type: null,
    name: null,
    affectedMetrics: [],
    suppress: []
  };
}
