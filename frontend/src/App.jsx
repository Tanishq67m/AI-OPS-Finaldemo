import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useMetricsPoller } from './hooks/useMetricsPoller';
import { detectAnomalies } from './utils/anomalyDetector';
import { correlateAnomalies } from './utils/correlationEngine';
import { enrichAlert } from './utils/insightsEngine';
import { MetricCard } from './components/MetricCard';
import { ControlPanel } from './components/ControlPanel';
import { AlertPanel } from './components/AlertPanel';
import { TopologyMap } from './components/TopologyMap';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { 
  Cpu, 
  Layers, 
  Activity, 
  AlertTriangle, 
  Database, 
  Server, 
  TrendingUp,
  Radio,
  LogOut,
  ShieldCheck,
  User as UserIcon,
  Wrench,
  Info
} from 'lucide-react';

// Verification Hub Modal Component
function VerificationModal({ isOpen, onClose, metrics, isPrometheusConnected, selectedSystem }) {
  if (!isOpen) return null;

  const promqlQueries = {
    production: {
      cpu: 'cpu_usage_percent',
      memory: 'memory_usage_percent',
      latency: 'http_response_latency_ms',
      error: 'application_error_rate_percent'
    },
    host: {
      cpu: '100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[1m])) * 100)',
      memory: '100 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes * 100)',
      load: 'node_load1',
      processes: 'node_procs_running'
    }
  };

  const queries = selectedSystem === 'host' ? promqlQueries.host : promqlQueries.production;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-[#0b0e1a] p-6 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-500" />
              Telemetry Verification Hub
            </h3>
            <button onClick={onClose} className="text-slate-500 hover:text-white font-bold text-xs transition-colors">✕ Close</button>
          </div>

          <div className="mt-6 space-y-4 overflow-y-auto pr-2 max-h-[55vh]">
            {/* Status Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-[#070a14] border border-slate-900 p-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active DataSource</p>
                <p className={`text-xs font-black mt-1 ${isPrometheusConnected ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isPrometheusConnected ? 'Prometheus TSDB (Genuine)' : 'Express REST API (Fallback)'}
                </p>
              </div>
              <div className="rounded-xl bg-[#070a14] border border-slate-900 p-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Monitored PC</p>
                <p className="text-xs font-black mt-1 text-white">
                  {selectedSystem === 'host' ? 'Local Host Workstation' : 'Simulated Application Cluster'}
                </p>
              </div>
            </div>

            {/* Proof of Legitimacy Guide */}
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-xs text-slate-300 space-y-2">
              <p className="font-bold text-white flex items-center gap-1">🛡️ How to Prove Genuineness to an Examiner:</p>
              <ul className="list-disc list-inside space-y-2 text-[11px] text-slate-400">
                <li><span className="text-white font-semibold">Live System Sync:</span> Open your Mac Activity Monitor (CPU/Memory). Switch to the "Host Workstation" tab here and observe that they match.</li>
                <li><span className="text-white font-semibold">Stress Testing:</span> Run <code className="bg-[#03050a] px-1.5 py-0.5 rounded text-rose-400 font-mono">yes &gt; /dev/null &amp;</code> in your terminal. You will immediately see the CPU utilization circular gauge spike on this dashboard. Kill the process to see it cool down.</li>
                <li><span className="text-white font-semibold">Direct TSDB Verification:</span> Copy the PromQL queries below and run them directly at <a href="http://localhost:9090" target="_blank" rel="noreferrer" className="text-blue-400 underline">http://localhost:9090</a>.</li>
              </ul>
            </div>

            {/* PromQL Queries */}
            <div className="space-y-2.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active PromQL Queries for this view:</p>
              {Object.keys(queries).map(key => (
                <div key={key} className="rounded-xl bg-[#03050a] border border-slate-900 p-3 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase">
                    <span>{key} metric</span>
                    <span className="text-emerald-400 font-mono">value: {metrics?.[key === 'cpu' ? 'cpu_usage_percent' : key === 'memory' ? 'memory_usage_percent' : key === 'load' ? 'system_load' : key === 'processes' ? 'running_processes' : key] ?? 'N/A'}</span>
                  </div>
                  <code className="text-[10px] text-blue-400 font-mono select-all break-all">{queries[key]}</code>
                </div>
              ))}
            </div>

            {/* Raw JSON Payload */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Raw Scraping JSON Payload:</p>
              <pre className="rounded-xl bg-[#03050a] border border-slate-900 p-4 font-mono text-[10px] text-emerald-400 overflow-x-auto max-h-[150px] leading-relaxed">
                {JSON.stringify(metrics, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 rounded-xl bg-slate-800 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-700 transition-all"
        >
          Acknowledge & Close
        </button>
      </div>
    </div>
  );
}

// Dashboard View Component containing the core dashboard logic
function DashboardView({ user, onLogout }) {
  const [selectedSystem, setSelectedSystem] = useState(user.defaultSystem);
  const [forceDegraded, setForceDegraded] = useState(false);
  const { metrics, history, loading, error, isPrometheusConnected } = useMetricsPoller(5000, selectedSystem);
  const [activeIncident, setActiveIncident] = useState(null);
  const [activeAlert, setActiveAlert] = useState(null);
  const [alertHistory, setAlertHistory] = useState([]);
  const [showVerification, setShowVerification] = useState(false);
  const [logs, setLogs] = useState([
    { time: new Date().toLocaleTimeString(), type: 'info', message: 'Initializing AI-OPS Observability Client...' },
    { time: new Date().toLocaleTimeString(), type: 'info', message: 'Rule-based anomaly detection engine loaded.' }
  ]);
  
  const previousMetricsRef = useRef(null);
  const lastAlertIdRef = useRef(null);

  const getActiveMetrics = () => {
    if (!metrics) return null;

    if (forceDegraded && selectedSystem === 'production') {
      return {
        cpu_usage_percent: 96.8,
        memory_usage_percent: 98.1,
        http_response_latency_ms: 987,
        application_error_rate_percent: 11.2,
        system_load: 6.8,
        anomaly_score: 0.97,
        running_processes: 210
      };
    }

    return metrics;
  };

  const activeMetrics = getActiveMetrics();

  // Helper: Append a new log to the terminal
  const addLog = (type, message) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { time, type, message }].slice(-100));
  };

  // Log connection status changes
  useEffect(() => {
    if (isPrometheusConnected) {
      addLog('info', `Successfully connected to Prometheus TSDB scraping pipeline for ${selectedSystem === 'host' ? 'Host Workstation' : 'Application Cluster'}.`);
    } else {
      addLog('warn', 'Prometheus API unreachable. Switched to direct backend polling fallback.');
    }
  }, [isPrometheusConnected, selectedSystem]);

  // Run Anomaly Detection and Correlation on every metric update
  useEffect(() => {
    if (!activeMetrics) return;

    // 1. Detect individual anomalies
    const { states: anomalyStates, list: anomalyList } = detectAnomalies(activeMetrics);

    // Log the scrape event and any individual breaches
    addLog('info', `[${selectedSystem.toUpperCase()}] Scraped telemetry. CPU: ${activeMetrics.cpu_usage_percent}%, Latency: ${activeMetrics.http_response_latency_ms}ms, Errors: ${activeMetrics.application_error_rate_percent}%`);
    anomalyList.forEach(anomaly => {
      addLog('warn', `[${selectedSystem.toUpperCase()}] THRESHOLD BREACH: ${anomaly.name} is ${anomaly.value}${anomaly.unit} (Threshold: ${anomaly.threshold}${anomaly.unit})`);
    });

    // 2. Correlate anomalies
    const correlation = correlateAnomalies(anomalyStates, activeMetrics, previousMetricsRef.current);

    let currentAlert = null;

    if (correlation.type) {
      currentAlert = enrichAlert(correlation);
      if (lastAlertIdRef.current !== correlation.type) {
        addLog('error', `[${selectedSystem.toUpperCase()}] CORRELATION ENGINE: Grouped ${correlation.affectedMetrics.join(' & ').toUpperCase()} anomalies into [${correlation.name}] event.`);
      }
    } else if (anomalyList.length > 0) {
      const primaryAnomaly = anomalyList.find(a => a.metric === 'error') || anomalyList[0];
      currentAlert = enrichAlert(primaryAnomaly);
    }

    // 3. Update active alert state and history
    if (currentAlert) {
      setActiveAlert(currentAlert);
      
      const alertKey = currentAlert.title || currentAlert.id;
      if (lastAlertIdRef.current !== alertKey) {
        setAlertHistory(prev => [currentAlert, ...prev].slice(0, 50));
        lastAlertIdRef.current = alertKey;
      }
    } else {
      if (activeAlert) {
        addLog('info', `[${selectedSystem.toUpperCase()}] System metrics returned to normal. Clearing active alert.`);
      }
      setActiveAlert(null);
      lastAlertIdRef.current = null;
    }

    previousMetricsRef.current = activeMetrics;
  }, [activeMetrics, selectedSystem]);

  // Handle state changes from the Control Panel
  const handleIncidentStateChange = (type) => {
    setActiveIncident(type);
    if (type) {
      addLog('info', `FAULT INJECTION: Triggered incident simulation profile [${type.toUpperCase()}].`);
    } else {
      setForceDegraded(false);
      addLog('info', 'SYSTEM RESET: Triggered recovery. Gradual cooldown phase initiated.');
    }
  };

  // Render Loading state
  if (loading || !activeMetrics) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-dark-900 text-slate-100">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        <p className="mt-4 text-sm text-slate-400 font-medium">Loading Command Center Telemetry...</p>
        {error && <p className="mt-2 text-xs text-rose-400 max-w-md text-center">{error}</p>}
      </div>
    );
  }

  const THRESHOLDS = {
    cpu: 80,
    memory: 85,
    latency: 500,
    error: 5,
    load: 4.0,
    anomaly: 0.7
  };

  const anomalyStates = activeMetrics ? detectAnomalies(activeMetrics).states : {};

  return (
    <div className="min-h-screen bg-dark-900 pb-12 text-slate-100">
      {/* Verification Hub Modal */}
      <VerificationModal 
        isOpen={showVerification} 
        onClose={() => setShowVerification(false)} 
        metrics={activeMetrics} 
        isPrometheusConnected={isPrometheusConnected} 
        selectedSystem={selectedSystem} 
      />

      {/* Top Header Navigation */}
      <header className="border-b border-slate-800/80 bg-dark-800/40 backdrop-blur-md sticky top-0 z-50 shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                <Layers className="h-6 w-6" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-extrabold tracking-wider text-white leading-none">AI-OPS</h1>
                <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-widest">Command Center</p>
              </div>
            </div>

            {/* System Selector Tabs */}
            <div className="flex bg-slate-950/80 border border-slate-800/60 rounded-xl p-1 text-xs">
              <button
                onClick={() => { setSelectedSystem('production'); addLog('info', 'Switched view to system: Application Server (Simulated).'); }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${selectedSystem === 'production' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                Application Server (Simulated)
              </button>
              <button
                onClick={() => { setSelectedSystem('host'); addLog('info', 'Switched view to system: Host Workstation (Real Telemetry).'); }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${selectedSystem === 'host' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                Host Workstation (Real Telemetry)
              </button>
            </div>

            {/* Header Controls & Status */}
            <div className="flex items-center gap-3">
              {isPrometheusConnected ? (
                <div className="hidden md:flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
                  <Server className="h-3.5 w-3.5" />
                  Prometheus
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-[10px] font-bold tracking-wider text-amber-400 uppercase animate-pulse">
                  <Database className="h-3.5 w-3.5" />
                  API Fallback
                </div>
              )}

              {/* Verify Telemetry Button */}
              <button
                onClick={() => setShowVerification(true)}
                className="flex items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/25 px-3 py-2 text-xs font-bold text-blue-400 transition-all"
              >
                <ShieldCheck className="h-4 w-4" />
                Verify Telemetry
              </button>

              {/* User Badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/85 border border-slate-800/80 text-xs">
                {user.username === 'admin' ? (
                  <UserIcon className="h-4 w-4 text-blue-400" />
                ) : (
                  <Wrench className="h-4 w-4 text-emerald-400" />
                )}
                <div>
                  <p className="text-[10px] text-slate-400 font-bold leading-none">{user.role}</p>
                  <p className="text-[9px] text-slate-500 mt-0.5 font-mono">@{user.username}</p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-dark-700/40 hover:bg-rose-950/30 hover:border-rose-500/30 hover:text-rose-400 px-3 py-2 text-xs font-bold text-slate-300 transition-all"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        
        {/* Core Metric Cards Grid */}
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard 
            name="CPU Utilization"
            value={activeMetrics.cpu_usage_percent}
            unit="%"
            icon={Cpu}
            history={history}
            dataKey="cpu_usage_percent"
            threshold={THRESHOLDS.cpu}
            isAnomaly={anomalyStates.cpu}
          />
          <MetricCard 
            name="Memory Utilization"
            value={activeMetrics.memory_usage_percent}
            unit="%"
            icon={Database}
            history={history}
            dataKey="memory_usage_percent"
            threshold={THRESHOLDS.memory}
            isAnomaly={anomalyStates.memory}
          />
          <MetricCard 
            name="Response Latency"
            value={activeMetrics.http_response_latency_ms}
            unit="ms"
            icon={Activity}
            history={history}
            dataKey="http_response_latency_ms"
            threshold={THRESHOLDS.latency}
            isAnomaly={anomalyStates.latency}
          />
          <MetricCard 
            name="Application Error Rate"
            value={activeMetrics.application_error_rate_percent}
            unit="%"
            icon={AlertTriangle}
            history={history}
            dataKey="application_error_rate_percent"
            threshold={THRESHOLDS.error}
            isAnomaly={anomalyStates.error}
          />
        </section>

        {/* Topology Map and Secondary Metrics Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Topology Map (2/3 width) */}
          <div className="lg:col-span-2">
            <TopologyMap anomalyStates={anomalyStates} activeIncident={activeIncident} selectedSystem={selectedSystem} />
          </div>

          {/* Auxiliary Stats + Fault Control Panel (1/3 width) */}
          <div className="space-y-6 flex flex-col justify-between">
            {/* Aux Metrics Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* System Load Card */}
              <div className="rounded-xl border border-slate-800/80 bg-dark-800/50 p-4 flex items-center gap-3">
                <div className="rounded-lg bg-slate-800 p-2 text-slate-400">
                  <Server className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">System Load</p>
                  <p className="text-sm font-black text-white mt-0.5">{activeMetrics.system_load}</p>
                </div>
              </div>

              {/* Anomaly Score Card */}
              <div className="rounded-xl border border-slate-800/80 bg-dark-800/50 p-4 flex items-center gap-3">
                <div className="rounded-lg bg-slate-800 p-2 text-slate-400">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Anomaly Score</p>
                  <p className={`text-sm font-black mt-0.5 ${activeMetrics.anomaly_score > THRESHOLDS.anomaly ? 'text-rose-400' : 'text-white'}`}>
                    {activeMetrics.anomaly_score}
                  </p>
                </div>
              </div>
            </div>

            {/* Active Processes Card */}
            <div className="rounded-xl border border-slate-800/80 bg-dark-800/50 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-slate-800 p-2 text-slate-400">
                  <Radio className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Running Processes</p>
                  <p className="text-sm font-black text-white mt-0.5">{activeMetrics.running_processes}</p>
                </div>
              </div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Normal: 120</span>
            </div>

            {/* Control Panel */}
            <div className="flex-grow flex flex-col">
              <ControlPanel 
                activeIncident={activeIncident}
                onStateChange={handleIncidentStateChange}
                forceDegraded={forceDegraded}
                setForceDegraded={(val) => {
                  setForceDegraded(val);
                  if (val) {
                    addLog('error', 'CRITICAL DEGRADATION: Forced system failure mode active.');
                  } else {
                    addLog('info', 'DEGRADATION CLEARED: Reverted to standard telemetry.');
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Alert Correlation & Live Terminal Section */}
        <section>
          <AlertPanel 
            activeAlert={activeAlert}
            alertHistory={alertHistory}
            logs={logs}
          />
        </section>

      </main>
    </div>
  );
}

// Router and Authentication Guard Wrapper
export function AppContent() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('aiops_user');
    return saved ? JSON.parse(saved) : null;
  });

  return (
    <Routes>
      <Route path="/" element={<LandingPage onLaunch={() => navigate('/login')} />} />
      <Route path="/login" element={
        <LoginPage 
          onLogin={(userData) => {
            setUser(userData);
            localStorage.setItem('aiops_user', JSON.stringify(userData));
            navigate('/dashboard');
          }} 
          onBack={() => navigate('/')} 
        />
      } />
      <Route path="/dashboard" element={
        user ? (
          <DashboardView 
            user={user} 
            onLogout={() => {
              setUser(null);
              localStorage.removeItem('aiops_user');
              navigate('/');
            }} 
          />
        ) : (
          <Navigate to="/login" replace />
        )
      } />
    </Routes>
  );
}

export function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
