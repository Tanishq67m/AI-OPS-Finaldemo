/**
 * Stateful Metrics Generator for AI-OPS
 * Simulates system metrics with Gaussian noise under normal conditions,
 * and allows injecting specific incident profiles with realistic recovery phases.
 */

// Helper: Box-Muller transform for generating normally distributed random numbers
function randomNormal(mean, stdDev) {
  let u = 0, v = 0;
  while(u === 0) u = Math.random(); // Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return num * stdDev + mean;
}

class MetricsGenerator {
  constructor() {
    this.state = {
      incidentType: null, // null, 'full_overload', 'cpu_spike', 'cpu_latency', 'dependency_failure', 'gradual_cpu'
      step: 0,
      recoveryStepsRemaining: 0,
      // Store previous values for trend calculation (Delta M)
      previous: {},
      current: {}
    };

    // Initialize metrics
    this.generate();
  }

  setIncident(type) {
    this.state.incidentType = type;
    this.state.step = 0;
    this.state.recoveryStepsRemaining = 0;
  }

  reset() {
    if (this.state.incidentType !== null) {
      // Transition to recovery phase instead of abrupt drop
      this.state.incidentType = null;
      this.state.recoveryStepsRemaining = 5; // Recover over 5 cycles
    }
    this.state.step = 0;
  }

  generate() {
    this.state.previous = { ...this.state.current };
    const cur = {};

    const isIncident = this.state.incidentType;
    const isRecovering = this.state.recoveryStepsRemaining > 0;
    
    // Scale factor for recovery (goes from 1.0 down to 0.0)
    let recoveryScale = 0;
    if (isRecovering) {
      recoveryScale = this.state.recoveryStepsRemaining / 5;
      this.state.recoveryStepsRemaining--;
    }

    // 1. CPU Usage (%) - Normal: Mean 28%, StdDev 6%. Threshold: 80%
    if (isIncident === 'full_overload' || isIncident === 'cpu_spike' || isIncident === 'cpu_latency') {
      cur.cpu_usage_percent = randomNormal(91, 3);
    } else if (isIncident === 'gradual_cpu') {
      // Step-wise increase over 5 cycles: 35% -> 50% -> 65% -> 82% -> 93%
      const steps = [35, 50, 65, 82, 93];
      const val = steps[Math.min(this.state.step, steps.length - 1)];
      cur.cpu_usage_percent = randomNormal(val, 2);
      this.state.step++;
    } else if (isRecovering) {
      // Blend incident value (~91%) and normal value (~28%)
      const normalVal = randomNormal(28, 6);
      cur.cpu_usage_percent = normalVal + (91 - normalVal) * recoveryScale;
    } else {
      cur.cpu_usage_percent = Math.max(5, Math.min(78, randomNormal(28, 6)));
    }

    // 2. Memory Usage (%) - Normal: Mean 42%, StdDev 5%. Threshold: 85%
    if (isIncident === 'full_overload') {
      cur.memory_usage_percent = randomNormal(92, 2);
    } else if (isRecovering) {
      const normalVal = randomNormal(42, 5);
      cur.memory_usage_percent = normalVal + (92 - normalVal) * recoveryScale;
    } else {
      cur.memory_usage_percent = Math.max(10, Math.min(83, randomNormal(42, 5)));
    }

    // 3. HTTP Response Latency (ms) - Normal: 85ms, StdDev 15ms. Threshold: 500ms
    if (isIncident === 'full_overload' || isIncident === 'cpu_latency') {
      cur.http_response_latency_ms = randomNormal(740, 50);
    } else if (isRecovering) {
      const normalVal = randomNormal(85, 15);
      cur.http_response_latency_ms = normalVal + (740 - normalVal) * recoveryScale;
    } else {
      cur.http_response_latency_ms = Math.max(20, randomNormal(85, 15));
    }

    // 4. Application Error Rate (%) - Normal: 0.3%, StdDev 0.1%. Threshold: 5%
    if (isIncident === 'full_overload' || isIncident === 'dependency_failure') {
      cur.application_error_rate_percent = randomNormal(11, 1.5);
    } else if (isRecovering) {
      const normalVal = randomNormal(0.3, 0.1);
      cur.application_error_rate_percent = normalVal + (11 - normalVal) * recoveryScale;
    } else {
      cur.application_error_rate_percent = Math.max(0, randomNormal(0.3, 0.1));
    }

    // 5. System Load - Normal: 1.2, StdDev 0.2. Threshold: 4.0
    if (isIncident === 'full_overload' || isIncident === 'cpu_spike' || isIncident === 'cpu_latency') {
      cur.system_load = randomNormal(6.2, 0.5);
    } else if (isRecovering) {
      const normalVal = randomNormal(1.2, 0.2);
      cur.system_load = normalVal + (6.2 - normalVal) * recoveryScale;
    } else {
      cur.system_load = Math.max(0.1, randomNormal(1.2, 0.2));
    }

    // 6. Disk Usage (%) - Normal: 45%, slowly increasing. Threshold: 90%
    cur.disk_usage_percent = 45.2 + (Date.now() % 100000) / 10000;

    // 7. Network In Bytes - Normal: ~1200, StdDev 200. Threshold: 9000
    if (isIncident === 'full_overload') {
      cur.network_in_bytes = randomNormal(9800, 500);
    } else {
      cur.network_in_bytes = Math.max(100, randomNormal(1200, 200));
    }

    // 8. Network Out Bytes - Normal: ~1500, StdDev 250. Threshold: 9000
    if (isIncident === 'full_overload') {
      cur.network_out_bytes = randomNormal(10500, 600);
    } else {
      cur.network_out_bytes = Math.max(100, randomNormal(1500, 250));
    }

    // 9. Running Processes - Normal: 120, StdDev 10. Threshold: 180
    if (isIncident === 'full_overload' || isIncident === 'cpu_spike') {
      cur.running_processes = Math.floor(randomNormal(195, 10));
    } else {
      cur.running_processes = Math.floor(Math.max(50, randomNormal(120, 10)));
    }

    // 10. Disk Read Bytes - Normal: ~2200. Threshold: 4500
    cur.disk_read_bytes = Math.max(50, randomNormal(2200, 300));

    // 11. Disk Write Bytes - Normal: ~1800. Threshold: 4500
    cur.disk_write_bytes = Math.max(50, randomNormal(1800, 250));

    // 12. Anomaly Score - Normal: ~0.15. Threshold: 0.7
    if (isIncident) {
      cur.anomaly_score = randomNormal(0.85, 0.05);
    } else if (isRecovering) {
      cur.anomaly_score = 0.15 + (0.85 - 0.15) * recoveryScale;
    } else {
      cur.anomaly_score = Math.max(0.01, randomNormal(0.15, 0.03));
    }

    // Round values to 2 decimal places for clean formatting
    for (const key in cur) {
      if (key !== 'running_processes') {
        cur[key] = Math.round(cur[key] * 100) / 100;
      }
    }

    this.state.current = cur;
    return cur;
  }

  getCurrentMetrics() {
    return this.state.current;
  }
}

module.exports = new MetricsGenerator();
