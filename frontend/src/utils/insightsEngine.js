/**
 * Insights Engine Utility
 * Enriches alerts with severity levels, root cause analysis, and recommended actions.
 */

const INCIDENT_METADATA = {
  full_system_overload: {
    severity: 'critical',
    explanation: 'Simultaneous resource exhaustion across all system components suggests an unhandled traffic spike or runaway process.',
    recommendation: 'Identify and terminate resource-intensive processes; scale horizontally if traffic surge is confirmed; check for memory leaks in application services.'
  },
  resource_saturation: {
    severity: 'high',
    explanation: 'Co-elevation of CPU and memory utilization with increasing trends indicates potential resource saturation and memory leaks.',
    recommendation: 'Check memory usage per process; perform garbage collection analysis; restart container if memory exceeds critical threshold.'
  },
  service_overload: {
    severity: 'high',
    explanation: 'High CPU utilization coupled with response latency exceeding 500ms indicates service overload under high traffic.',
    recommendation: 'Scale service replicas; enable rate limiting/throttling; optimize slow database queries.'
  },
  downstream_dependency_failure: {
    severity: 'high',
    explanation: 'Elevated error rates with stable memory utilization indicate a failure in downstream external dependencies or database connections rather than local resource exhaustion.',
    recommendation: 'Check network connectivity to database/third-party APIs; inspect downstream service health; verify API credentials.'
  }
};

const SINGLE_METRIC_METADATA = {
  cpu: {
    severity: 'medium',
    explanation: 'CPU utilization has exceeded the 80% threshold. This might indicate a transient CPU spike or a heavy computation task.',
    recommendation: 'Monitor CPU utilization trends; check top resource-consuming processes.'
  },
  memory: {
    severity: 'medium',
    explanation: 'Memory utilization has exceeded the 85% threshold. Risk of Out-Of-Memory (OOM) killer terminating the service.',
    recommendation: 'Identify memory-intensive processes; prepare to scale memory capacity.'
  },
  latency: {
    severity: 'medium',
    explanation: 'HTTP response latency has exceeded the 500ms threshold. User experience is degraded.',
    recommendation: 'Check database query execution plans; monitor network latency; review server load.'
  },
  error: {
    severity: 'critical', // Error rate above 5% is critical as per Chapter 5.1
    explanation: 'Application error rate has exceeded the 5% threshold. Users are experiencing failures.',
    recommendation: 'Inspect application error logs; roll back recent deployments if errors started after a release.'
  }
};

export function getPredictiveInsights(history) {
  if (!history || history.length < 6) return [];

  const metricsToTrack = {
    cpu: { key: 'cpu_usage_percent', threshold: 80, name: 'CPU Utilization', unit: '%' },
    memory: { key: 'memory_usage_percent', threshold: 85, name: 'Memory Utilization', unit: '%' },
    latency: { key: 'http_response_latency_ms', threshold: 500, name: 'Response Latency', unit: 'ms' },
    error: { key: 'application_error_rate_percent', threshold: 5, name: 'Application Error Rate', unit: '%' }
  };

  const predictions = [];

  Object.keys(metricsToTrack).forEach(key => {
    const config = metricsToTrack[key];
    const n = history.length;
    
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    history.forEach((point, idx) => {
      const x = idx;
      const y = point[config.key] || 0;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
    });

    const denominator = n * sumXX - sumX * sumX;
    if (denominator === 0) return;

    const slope = (n * sumXY - sumX * sumY) / denominator;

    // Current value is the last point
    const currentVal = history[n - 1][config.key] || 0;

    // If slope is positive and current value is below threshold, calculate when it will breach
    if (slope > 0 && currentVal < config.threshold) {
      const stepsToBreach = (config.threshold - currentVal) / slope;
      const secondsToBreach = Math.round(stepsToBreach * 5); // 5s scrape interval

      // If it is predicted to breach within the next 60 seconds
      if (secondsToBreach > 0 && secondsToBreach <= 60) {
        predictions.push({
          id: `predictive-${key}-${Date.now()}`,
          title: `Predictive Warning: ${config.name}`,
          metric: key,
          severity: 'low',
          isPredictive: true,
          secondsToBreach,
          timestamp: new Date(),
          explanation: `Mathematical linear regression forecasting projects that ${config.name} (currently ${currentVal}${config.unit}) will breach its threshold of ${config.threshold}${config.unit} in approximately ${secondsToBreach} seconds based on the active trend (Slope: +${Math.round(slope * 100) / 100}/sec).`,
          recommendation: `Pre-emptively scale resources or check logs for resource leakage. Anomaly correlation engine has queued this trend for proactive remediation.`,
          affectedMetrics: [key]
        });
      }
    }
  });

  return predictions;
}

export function enrichAlert(alert, isPredictive = false) {
  // If it's a predictive warning (approaching threshold)
  if (isPredictive) {
    return {
      ...alert,
      severity: 'low',
      type: `${alert.name} Approaching`,
      explanation: `Metric is trending steadily upward and is predicted to breach the threshold of ${alert.threshold}${alert.unit} soon.`,
      recommendation: `Investigate potential causes early; check log files for warnings; optimize resource usage.`
    };
  }

  // If it's a correlated incident
  if (alert.type && INCIDENT_METADATA[alert.type]) {
    const meta = INCIDENT_METADATA[alert.type];
    return {
      id: `${alert.type}-${Date.now()}`,
      title: alert.name,
      severity: meta.severity,
      explanation: meta.explanation,
      recommendation: meta.recommendation,
      affectedMetrics: alert.affectedMetrics,
      timestamp: new Date()
    };
  }

  // If it's a single metric breach
  if (alert.metric && SINGLE_METRIC_METADATA[alert.metric]) {
    const meta = SINGLE_METRIC_METADATA[alert.metric];
    return {
      id: `${alert.metric}-${Date.now()}`,
      title: alert.alertType,
      severity: meta.severity,
      explanation: meta.explanation,
      recommendation: meta.recommendation,
      affectedMetrics: [alert.metric],
      timestamp: new Date(),
      value: alert.value,
      threshold: alert.threshold,
      unit: alert.unit
    };
  }

  return {
    id: `unknown-${Date.now()}`,
    title: 'System Alert',
    severity: 'medium',
    explanation: 'An unexpected system anomaly has been detected.',
    recommendation: 'Inspect system dashboards and logs.',
    affectedMetrics: [],
    timestamp: new Date()
  };
}
