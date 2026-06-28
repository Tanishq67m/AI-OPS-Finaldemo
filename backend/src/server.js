const express = require('express');
const cors = require('cors');
const client = require('prom-client');
const metricsGen = require('./metricsGen');

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS for frontend integration
app.use(cors());
app.use(express.json());

// Custom Logging Middleware
app.use((req, reqRes, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Create a Prometheus Registry
const register = new client.Registry();

// Enable default metrics collection (e.g., node process metrics)
client.collectDefaultMetrics({ register });

// Define custom gauges to expose the generated system metrics
const gauges = {
  cpu_usage_percent: new client.Gauge({
    name: 'cpu_usage_percent',
    help: 'CPU utilization percentage',
    labelNames: ['instance']
  }),
  memory_usage_percent: new client.Gauge({
    name: 'memory_usage_percent',
    help: 'Memory utilization percentage',
    labelNames: ['instance']
  }),
  http_response_latency_ms: new client.Gauge({
    name: 'http_response_latency_ms',
    help: 'HTTP response latency in milliseconds',
    labelNames: ['instance']
  }),
  application_error_rate_percent: new client.Gauge({
    name: 'application_error_rate_percent',
    help: 'Application error rate as a percentage',
    labelNames: ['instance']
  }),
  system_load: new client.Gauge({
    name: 'system_load',
    help: 'System load factor',
    labelNames: ['instance']
  }),
  disk_usage_percent: new client.Gauge({
    name: 'disk_usage_percent',
    help: 'Disk space utilization percentage',
    labelNames: ['instance']
  }),
  network_in_bytes: new client.Gauge({
    name: 'network_in_bytes',
    help: 'Network traffic received in bytes per second',
    labelNames: ['instance']
  }),
  network_out_bytes: new client.Gauge({
    name: 'network_out_bytes',
    help: 'Network traffic sent in bytes per second',
    labelNames: ['instance']
  }),
  running_processes: new client.Gauge({
    name: 'running_processes',
    help: 'Number of active running processes',
    labelNames: ['instance']
  }),
  disk_read_bytes: new client.Gauge({
    name: 'disk_read_bytes',
    help: 'Disk read speed in bytes per second',
    labelNames: ['instance']
  }),
  disk_write_bytes: new client.Gauge({
    name: 'disk_write_bytes',
    help: 'Disk write speed in bytes per second',
    labelNames: ['instance']
  }),
  anomaly_score: new client.Gauge({
    name: 'anomaly_score',
    help: 'Current computed system anomaly score',
    labelNames: ['instance']
  })
};

// Register all gauges
Object.values(gauges).forEach(gauge => register.registerMetric(gauge));

// Helper: Update all Prometheus gauges with the latest generated metrics
function updatePrometheusMetrics() {
  const data = metricsGen.generate();
  const instance = 'aiops-backend-node';

  gauges.cpu_usage_percent.set({ instance }, data.cpu_usage_percent);
  gauges.memory_usage_percent.set({ instance }, data.memory_usage_percent);
  gauges.http_response_latency_ms.set({ instance }, data.http_response_latency_ms);
  gauges.application_error_rate_percent.set({ instance }, data.application_error_rate_percent);
  gauges.system_load.set({ instance }, data.system_load);
  gauges.disk_usage_percent.set({ instance }, data.disk_usage_percent);
  gauges.network_in_bytes.set({ instance }, data.network_in_bytes);
  gauges.network_out_bytes.set({ instance }, data.network_out_bytes);
  gauges.running_processes.set({ instance }, data.running_processes);
  gauges.disk_read_bytes.set({ instance }, data.disk_read_bytes);
  gauges.disk_write_bytes.set({ instance }, data.disk_write_bytes);
  gauges.anomaly_score.set({ instance }, data.anomaly_score);
}

// Generate initial metrics and start the 5-second polling loop
updatePrometheusMetrics();
setInterval(updatePrometheusMetrics, 5000);

// --- REST API Endpoints ---

// 1. Prometheus Metrics Endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 2. Simulate Incident Endpoint
app.post('/api/simulate', (req, res) => {
  const { type } = req.body;
  const validTypes = ['full_overload', 'cpu_spike', 'cpu_latency', 'dependency_failure', 'gradual_cpu'];
  
  if (!type || !validTypes.includes(type)) {
    return res.status(400).json({ 
      error: `Invalid incident type. Must be one of: ${validTypes.join(', ')}` 
    });
  }

  metricsGen.setIncident(type);
  console.log(`[STATE CHANGE] Incident triggered: ${type}`);
  res.json({ 
    message: `Incident '${type}' successfully injected.`, 
    state: metricsGen.state 
  });
});

// 3. Reset System Endpoint
app.post('/api/reset', (req, res) => {
  metricsGen.reset();
  console.log(`[STATE CHANGE] System reset triggered. Initiating recovery phase.`);
  res.json({ 
    message: 'System reset command received. Initiating recovery phase.', 
    state: metricsGen.state 
  });
});

// 4. Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date(),
    incidentType: metricsGen.state.incidentType,
    isRecovering: metricsGen.state.recoveryStepsRemaining > 0,
    metrics: metricsGen.getCurrentMetrics()
  });
});

// Start server
app.listen(port, () => {
  console.log(`AI-OPS Backend listening on port ${port}`);
  console.log(`Prometheus metrics available at http://localhost:${port}/metrics`);
});
