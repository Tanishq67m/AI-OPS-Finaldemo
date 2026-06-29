/**
 * Anomaly Detector Utility
 * Evaluates raw metrics against defined threshold rules and statistical Z-Scores.
 */

export const THRESHOLDS = {
  cpu: 80,         // CPU Usage > 80%
  memory: 85,      // Memory Usage > 85%
  latency: 500,    // Response Latency > 500ms
  error: 5,        // Error Rate > 5%
};

// Helper: Calculate Mean
function getMean(values) {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

// Helper: Calculate Standard Deviation
function getStdDev(values, mean) {
  if (values.length <= 1) return 0.001; // Avoid division by zero
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (values.length - 1);
  return Math.sqrt(variance) || 0.001;
}

export function detectAnomalies(metrics, history = []) {
  if (!metrics) return { states: {}, list: [], zScores: {} };

  const states = { cpu: false, memory: false, latency: false, error: false };
  const zScores = { cpu: 0, memory: 0, latency: 0, error: 0 };
  const list = [];

  const keys = {
    cpu: 'cpu_usage_percent',
    memory: 'memory_usage_percent',
    latency: 'http_response_latency_ms',
    error: 'application_error_rate_percent'
  };

  const names = {
    cpu: 'CPU Utilization',
    memory: 'Memory Utilization',
    latency: 'Response Latency',
    error: 'Application Error Rate'
  };

  const units = {
    cpu: '%',
    memory: '%',
    latency: 'ms',
    error: '%'
  };

  const alertTypes = {
    cpu: 'High Load Alert (Z-Score)',
    memory: 'Memory Pressure Alert (Z-Score)',
    latency: 'Performance Alert (Z-Score)',
    error: 'Failure Alert (Z-Score)'
  };

  // Perform statistical Z-score detection if we have history
  Object.keys(keys).forEach(key => {
    const val = metrics[keys[key]] || 0;
    const limit = THRESHOLDS[key];
    
    // Extract past values from history
    const pastValues = history.map(h => h[keys[key]]).filter(v => v !== undefined && v !== null);

    let isAnomaly = val > limit; // Hard threshold fallback
    let zScore = 0;

    if (pastValues.length >= 5) {
      const mean = getMean(pastValues);
      const stdDev = getStdDev(pastValues, mean);
      zScore = (val - mean) / stdDev;
      zScores[key] = Math.round(zScore * 100) / 100;

      // If metric is 2.5 standard deviations away from the running average, flag it
      if (Math.abs(zScore) > 2.5 && val > mean) {
        isAnomaly = true;
      }
    }

    states[key] = isAnomaly;

    if (isAnomaly) {
      list.push({
        metric: key,
        name: names[key],
        value: val,
        threshold: limit,
        unit: units[key],
        zScore: zScores[key],
        alertType: zScore > 2.5 ? alertTypes[key] : `${names[key]} Threshold Breach`
      });
    }
  });

  return { states, list, zScores };
}
export default detectAnomalies;
