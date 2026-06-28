import React, { useState, useEffect, useRef } from 'react';
import { useMetricsPoller } from './hooks/useMetricsPoller';
import { detectAnomalies } from './utils/anomalyDetector';
import { correlateAnomalies } from './utils/correlationEngine';
import { enrichAlert } from './utils/insightsEngine';
import { MetricCard } from './components/MetricCard';
import { ControlPanel } from './components/ControlPanel';
import { AlertPanel } from './components/AlertPanel';
import { 
  Cpu, 
  Layers, 
  Activity, 
  AlertTriangle, 
  Database, 
  Server, 
  TrendingUp,
  Radio,
  CheckCircle2
} from 'lucide-react';

export function App() {
  const { metrics, history, loading, error, isPrometheusConnected } = useMetricsPoller(5000);
  const [activeIncident, setActiveIncident] = useState(null);
  const [activeAlert, setActiveAlert] = useState(null);
  const [alertHistory, setAlertHistory] = useState([]);
  
  const previousMetricsRef = useRef(null);
  const lastAlertIdRef = useRef(null);

  // Sync active incident type from backend health checks
  useEffect(() => {
    if (metrics && metrics.anomaly_score !== undefined) {
      // We can infer the incident state from the metrics or check if we need to update it
      // Let's check if the anomaly score is high to set the incident state
    }
  }, [metrics]);

  // Run Anomaly Detection and Correlation on every metric update
  useEffect(() => {
    if (!metrics) return;

    // 1. Detect individual anomalies
    const { states: anomalyStates, list: anomalyList } = detectAnomalies(metrics);

    // 2. Correlate anomalies
    const correlation = correlateAnomalies(anomalyStates, metrics, previousMetricsRef.current);

    let currentAlert = null;

    if (correlation.type) {
      // We have a correlated incident
      currentAlert = enrichAlert(correlation);
    } else if (anomalyList.length > 0) {
      // No correlation, but we have individual metric breaches
      // Enrich the highest priority one (e.g. error, then cpu, then others)
      const primaryAnomaly = anomalyList.find(a => a.metric === 'error') || anomalyList[0];
      currentAlert = enrichAlert(primaryAnomaly);
    }

    // 3. Update active alert state and history
    if (currentAlert) {
      setActiveAlert(currentAlert);
      
      // If this is a new alert, push to history
      const alertKey = currentAlert.title || currentAlert.id;
      if (lastAlertIdRef.current !== alertKey) {
        setAlertHistory(prev => [currentAlert, ...prev].slice(0, 50));
        lastAlertIdRef.current = alertKey;
      }
    } else {
      setActiveAlert(null);
      lastAlertIdRef.current = null;
    }

    previousMetricsRef.current = metrics;
  }, [metrics]);

  // Handle state changes from the Control Panel
  const handleIncidentStateChange = (type) => {
    setActiveIncident(type);
  };

  if (loading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-dark-900 text-slate-100">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        <p className="mt-4 text-sm text-slate-400">Loading AI-OPS Observability Data...</p>
      </div>
    );
  }

  // Define thresholds to display on cards
  const THRESHOLDS = {
    cpu: 80,
    memory: 85,
    latency: 500,
    error: 5,
    load: 4.0,
    anomaly: 0.7
  };

  const anomalyStates = metrics ? detectAnomalies(metrics).states : {};

  return (
    <div className="min-h-full bg-dark-900 pb-12">
      {/* Top Header Navigation */}
      <header className="border-b border-slate-800 bg-dark-800/40 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Layers className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white leading-none">AI-OPS</h1>
                <p className="text-[10px] text-slate-400 mt-1">Intelligent Monitoring & Anomaly Detection</p>
              </div>
            </div>

            {/* Connection Status Badges */}
            <div className="flex items-center gap-3">
              {isPrometheusConnected ? (
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                  <Server className="h-3.5 w-3.5" />
                  PROMETHEUS CONNECTED
                </div>
              ) : (
                <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 animate-pulse">
                  <Database className="h-3.5 w-3.5" />
                  BACKEND FALLBACK ACTIVE
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        
        {/* Connection/Data Error Warning */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Core Metric Cards Grid */}
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard 
            name="CPU Utilization"
            value={metrics.cpu_usage_percent}
            unit="%"
            icon={Cpu}
            history={history}
            dataKey="cpu_usage_percent"
            threshold={THRESHOLDS.cpu}
            isAnomaly={anomalyStates.cpu}
          />
          <MetricCard 
            name="Memory Utilization"
            value={metrics.memory_usage_percent}
            unit="%"
            icon={Database}
            history={history}
            dataKey="memory_usage_percent"
            threshold={THRESHOLDS.memory}
            isAnomaly={anomalyStates.memory}
          />
          <MetricCard 
            name="Response Latency"
            value={metrics.http_response_latency_ms}
            unit="ms"
            icon={Activity}
            history={history}
            dataKey="http_response_latency_ms"
            threshold={THRESHOLDS.latency}
            isAnomaly={anomalyStates.latency}
          />
          <MetricCard 
            name="Application Error Rate"
            value={metrics.application_error_rate_percent}
            unit="%"
            icon={AlertTriangle}
            history={history}
            dataKey="application_error_rate_percent"
            threshold={THRESHOLDS.error}
            isAnomaly={anomalyStates.error}
          />
        </section>

        {/* Auxiliary Metrics Row */}
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* System Load Card */}
          <div className="rounded-xl border border-slate-800 bg-dark-800/40 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-800 p-2.5 text-slate-300">
                <Server className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">System Load</p>
                <p className="text-lg font-bold text-white mt-0.5">{metrics.system_load}</p>
              </div>
            </div>
            <span className="text-[10px] text-slate-500">Threshold: {THRESHOLDS.load}</span>
          </div>

          {/* Anomaly Score Card */}
          <div className="rounded-xl border border-slate-800 bg-dark-800/40 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-800 p-2.5 text-slate-300">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Anomaly Score</p>
                <p className="text-lg font-bold text-white mt-0.5">{metrics.anomaly_score}</p>
              </div>
            </div>
            <span className="text-[10px] text-slate-500">Threshold: {THRESHOLDS.anomaly}</span>
          </div>

          {/* Active Processes Card */}
          <div className="rounded-xl border border-slate-800 bg-dark-800/40 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-800 p-2.5 text-slate-300">
                <Radio className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Running Processes</p>
                <p className="text-lg font-bold text-white mt-0.5">{metrics.running_processes}</p>
              </div>
            </div>
            <span className="text-[10px] text-slate-500">Normal: 120</span>
          </div>
        </section>

        {/* Control Panel Section */}
        <ControlPanel 
          activeIncident={activeIncident}
          onStateChange={handleIncidentStateChange}
        />

        {/* Alert Correlation & Insights Section */}
        <AlertPanel 
          activeAlert={activeAlert}
          alertHistory={alertHistory}
        />

      </main>
    </div>
  );
}
export default App;
