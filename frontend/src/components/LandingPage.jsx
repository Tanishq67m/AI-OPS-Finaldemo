import React, { useState } from 'react';
import { 
  Layers, 
  Cpu, 
  ShieldAlert, 
  Terminal, 
  ArrowRight, 
  Activity, 
  Database, 
  Server, 
  HelpCircle, 
  CheckCircle2, 
  Info,
  Laptop,
  ArrowUpRight,
  ChevronDown
} from 'lucide-react';

export function LandingPage({ onLaunch }) {
  const [activeFaq, setActiveFaq] = useState(null);

  const team = [
    { name: 'Tanishq Mohod', id: 'B400780331', role: 'Lead Architect & Backend', desc: 'Designed container orchestration and Express telemetry pipelines.' },
    { name: 'Vaishnavi Landge', id: 'B400780292', role: 'Frontend & UI Designer', desc: 'Crafted the premium glassmorphic UI and Recharts telemetry panels.' },
    { name: 'Gayatri Parkhe', id: 'B400780302', role: 'DevOps & Observability', desc: 'Configured Prometheus targets, alert rules, and Grafana dashboards.' },
    { name: 'Atharv Bhalerao', id: 'B400780272', role: 'QA Lead & AIOps Logic', desc: 'Developed client-side anomaly detection and correlation engines.' },
  ];

  const capabilities = [
    {
      icon: Cpu,
      title: 'Stateful Telemetry Scraping',
      desc: 'Polls real-time CPU, memory, load, and processes. Auto-detects Prometheus status and falls back to backend REST scraping.'
    },
    {
      icon: ShieldAlert,
      title: 'Intelligent Alert Correlation',
      desc: 'Correlates multiple resource anomalies into single high-level operational incidents, reducing alert noise by up to 80%.'
    },
    {
      icon: Terminal,
      title: 'Natural Language Insights',
      desc: 'Generates instant root cause explanations and step-by-step remediation plans tailored to the active system failure profile.'
    },
    {
      icon: Activity,
      title: 'Multi-Tenant System Views',
      desc: 'Supports multiple operator credentials (Admin / Field Engineer) displaying distinct, isolated system health dashboards.'
    }
  ];

  const faqs = [
    {
      q: 'How do I prove that the metrics displayed on the dashboard are 100% genuine?',
      a: 'Switch to the "Host Workstation" tab and log in as "operator". You can verify the data by: (1) Comparing the CPU, Memory, and Process count directly with your OS Activity Monitor/Task Manager. (2) Querying Prometheus directly at http://localhost:9090. (3) Running a CPU stress command on your host machine (e.g., yes > /dev/null &) and watching the dashboard CPU gauge instantly spike in real-time.'
    },
    {
      q: 'What is the exact purpose of Docker in this project?',
      a: 'Docker ensures a highly reproducible, isolated, and production-ready deployment. It packages Prometheus, Grafana, Node Exporter, Alertmanager, and Pushgateway into standardized containers. This prevents dependency conflicts (like Node version mismatches or database port clashes) and allows a multi-service monitoring stack to spin up anywhere with a single command.'
    },
    {
      q: 'How can we host this to monitor a home PC from anywhere?',
      a: 'To monitor a remote home PC: (1) Host the AI-OPS dashboard and Prometheus server on a public cloud VM (e.g., AWS EC2, GCP). (2) Run the Node Exporter container on your home PC. (3) Securely expose the home PC\'s Node Exporter port using a secure VPN (like Tailscale or WireGuard) or a reverse SSH tunnel. (4) Configure the cloud Prometheus instance to scrape your home PC\'s VPN IP address.'
    },
    {
      q: 'How does the dashboard know if Prometheus is offline?',
      a: 'The frontend poller (useMetricsPoller) sends a heartbeat query to Prometheus every 5 seconds. If the request times out or returns a connection error, the dashboard immediately switches the status badge to "API Fallback", logs a warning in the terminal, and seamlessly redirects its data fetching to the backend Express server.'
    }
  ];

  const techStack = [
    { name: 'React 18', type: 'Frontend Framework' },
    { name: 'Tailwind CSS', type: 'Styling Engine' },
    { name: 'Prometheus', type: 'TSDB & Alerting' },
    { name: 'Grafana 10', type: 'Metrics Visualizer' },
    { name: 'Docker', type: 'Containerization' },
    { name: 'Node.js', type: 'Backend API' },
    { name: 'Express', type: 'Web Server' },
    { name: 'Node Exporter', type: 'System Telemetry' }
  ];

  return (
    <div className="relative min-h-screen bg-[#05070d] text-slate-100 font-sans overflow-x-hidden selection:bg-blue-500/30">
      {/* Glow Orbs - matching the reference design */}
      <div className="absolute top-[-10%] left-[15%] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] h-[600px] w-[600px] rounded-full bg-purple-600/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] h-[500px] w-[500px] rounded-full bg-emerald-600/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-900 bg-[#05070d]/60 backdrop-blur-lg py-4">
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-wider text-white uppercase leading-none">AI-OPS</h1>
              <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Observability Suite</p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <a href="#verification" className="hover:text-white transition-colors">Verification</a>
            <a href="#team" className="hover:text-white transition-colors">Project Team</a>
            <a href="#faq" className="hover:text-white transition-colors">Deployment FAQ</a>
          </nav>

          {/* Right Action Button */}
          <div>
            <button
              onClick={onLaunch}
              className="flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-xs font-bold text-blue-400 hover:bg-blue-500/20 transition-all hover:border-blue-500/50"
            >
              <span>Launch App</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-6 pt-20 pb-16 flex flex-col items-center justify-center text-center">
        {/* Top Mini Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-1.5 text-xs font-semibold text-blue-400 backdrop-blur-sm animate-pulse">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
          AIOps-Driven System Defense Core
        </div>

        {/* Title */}
        <h1 className="mt-8 text-5xl font-black tracking-tight text-white sm:text-7xl max-w-4xl leading-[1.1]">
          One-Click for{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            System Defense
          </span>
        </h1>

        <p className="mt-6 text-md text-slate-400 max-w-2xl leading-relaxed">
          Dive into intelligent monitoring, where innovative observability meets proactive IT operations. A production-ready architecture integrating Prometheus, Grafana, and an automated rule-based correlation engine.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button
            onClick={onLaunch}
            className="group relative inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-extrabold text-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]"
          >
            <span>Launch Command Center</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <a
            href="#architecture"
            className="rounded-full border border-slate-800 bg-slate-900/40 px-8 py-4 text-sm font-bold text-slate-300 hover:bg-slate-900/80 hover:text-white transition-all"
          >
            Explore Architecture
          </a>
        </div>

        {/* Floating Interactive SVG Nodes (matching the reference design layout) */}
        <div className="relative w-full max-w-5xl h-[360px] mt-16 border border-slate-900 rounded-2xl bg-slate-950/20 backdrop-blur-sm overflow-hidden flex items-center justify-center">
          <svg className="absolute inset-0 h-full w-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            {/* Connection Lines */}
            <path d="M 200 180 L 500 180" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1.5" strokeDasharray="4 4" />
            <path d="M 500 180 L 800 180" stroke="rgba(147, 51, 234, 0.2)" strokeWidth="1.5" strokeDasharray="4 4" />
            <path d="M 500 180 L 500 80" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="1.5" strokeDasharray="4 4" />
            <path d="M 500 180 L 500 280" stroke="rgba(239, 68, 68, 0.2)" strokeWidth="1.5" strokeDasharray="4 4" />
          </svg>

          {/* Node 1: Left */}
          <div className="absolute left-[10%] top-[40%] flex items-center gap-3 bg-dark-800/80 border border-slate-800 rounded-xl p-4 shadow-xl">
            <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Laptop className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Telemetry Agent</p>
              <h4 className="text-xs font-bold text-white">node-exporter</h4>
              <p className="text-[9px] text-blue-400 font-mono mt-0.5">Scraping Host PC...</p>
            </div>
          </div>

          {/* Node 2: Center */}
          <div className="absolute left-[42%] top-[40%] flex flex-col items-center z-10">
            <div className="h-16 w-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.4)] animate-pulse">
              <Layers className="h-8 w-8" />
            </div>
            <span className="mt-3 text-xs font-black tracking-wider uppercase text-white">AI-OPS Core</span>
            <span className="text-[9px] font-semibold text-slate-500">Correlation Engine</span>
          </div>

          {/* Node 3: Right */}
          <div className="absolute right-[10%] top-[40%] flex items-center gap-3 bg-dark-800/80 border border-slate-800 rounded-xl p-4 shadow-xl">
            <div className="h-9 w-9 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Activity className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Analysis Engine</p>
              <h4 className="text-xs font-bold text-white">Anomaly Detector</h4>
              <p className="text-[9px] text-purple-400 font-mono mt-0.5">Scoring: 0.02 (Normal)</p>
            </div>
          </div>

          {/* Node 4: Top Center */}
          <div className="absolute left-[40%] top-[10%] flex items-center gap-3 bg-dark-800/80 border border-slate-800 rounded-xl p-3 shadow-xl">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Database className="h-4.5 w-4.5" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-white">Prometheus TSDB</h4>
              <p className="text-[9px] text-emerald-400 font-mono">Status: Ingesting</p>
            </div>
          </div>

          {/* Node 5: Bottom Center */}
          <div className="absolute left-[41%] bottom-[10%] flex items-center gap-3 bg-dark-800/80 border border-slate-800 rounded-xl p-3 shadow-xl">
            <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
              <ShieldAlert className="h-4.5 w-4.5" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-white">Alertmanager</h4>
              <p className="text-[9px] text-rose-400 font-mono">Status: Active</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Logo Marquee */}
      <div className="border-y border-slate-900 bg-slate-950/40 py-8">
        <div className="mx-auto max-w-7xl px-6 flex flex-wrap items-center justify-center gap-12 text-slate-600">
          {techStack.map((tech, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-sm font-black text-slate-400 tracking-wider uppercase">{tech.name}</span>
              <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1">{tech.type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Capabilities Section */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-black text-white uppercase tracking-wider">Engineered for Precision</h2>
          <p className="text-slate-400 mt-3 text-sm">Our platform eliminates the noise and delivers actionable insights when services fail.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div key={idx} className="rounded-2xl border border-slate-900 bg-slate-900/15 p-6 hover:border-slate-800 transition-all group">
                <div className="rounded-xl bg-blue-500/5 p-3 text-blue-400 w-fit group-hover:bg-blue-500/10 transition-all">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-base font-bold text-white">{cap.title}</h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">{cap.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* System Architecture Flow Diagram */}
      <section id="architecture" className="border-y border-slate-900 bg-slate-950/20 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-white uppercase tracking-wider">AIOps Observability Pipeline</h2>
            <p className="text-slate-400 mt-3 text-sm">How telemetry propagates from your machine to the correlated insights panel.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch">
            {/* Step 1 */}
            <div className="rounded-2xl border border-slate-900 bg-[#070a14]/60 p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Step 01</span>
                <h3 className="text-sm font-bold text-white mt-2">Telemetry Exporters</h3>
                <p className="text-xs text-slate-400 mt-2">Host metrics are collected by `node-exporter` (CPU/RAM) and application metrics are exposed via `/metrics` endpoint.</p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-slate-500">
                <Laptop className="h-4 w-4" />
                <span className="text-[10px] font-mono">Hardware/App Level</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-slate-900 bg-[#070a14]/60 p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Step 02</span>
                <h3 className="text-sm font-bold text-white mt-2">Prometheus Scraping</h3>
                <p className="text-xs text-slate-400 mt-2">Prometheus pulls these metrics every 15 seconds, storing them in a time-series database and checking alerting rules.</p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-slate-500">
                <Database className="h-4 w-4" />
                <span className="text-[10px] font-mono">TSDB Ingestion</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-slate-900 bg-[#070a14]/60 p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Step 03</span>
                <h3 className="text-sm font-bold text-white mt-2">Anomaly Detection</h3>
                <p className="text-xs text-slate-400 mt-2">The client-side engine evaluates scraped values against dynamic statistical thresholds to flag anomalies.</p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-slate-500">
                <Activity className="h-4 w-4" />
                <span className="text-[10px] font-mono">Statistical Analysis</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="rounded-2xl border border-slate-900 bg-[#070a14]/60 p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Step 04</span>
                <h3 className="text-sm font-bold text-white mt-2">Alert Correlation</h3>
                <p className="text-xs text-slate-400 mt-2">Individual anomalies are correlated. For example, CPU spike + Latency spike is grouped into a "Service Overload" incident.</p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-slate-500">
                <ShieldAlert className="h-4 w-4" />
                <span className="text-[10px] font-mono">Noise Reduction</span>
              </div>
            </div>

            {/* Step 5 */}
            <div className="rounded-2xl border border-slate-900 bg-[#070a14]/60 p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Step 05</span>
                <h3 className="text-sm font-bold text-white mt-2">Operator Dashboard</h3>
                <p className="text-xs text-slate-400 mt-2">Displays radial gauges, unified area charts, live topology maps, and natural language remediation steps.</p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-slate-500">
                <Terminal className="h-4 w-4" />
                <span className="text-[10px] font-mono">Command UI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Telemetry Verification / Genuine Proof Section */}
      <section id="verification" className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Academic Rigor & Defense</span>
            <h2 className="text-3xl font-black text-white uppercase tracking-wider mt-2">How to Prove the Telemetry is Genuine</h2>
            <p className="text-slate-400 mt-4 text-sm leading-relaxed">
              External examiners often look for hard proof that monitoring dashboards are showing real-time, genuine machine data rather than a mock loop. Here are the built-in ways you can prove the legitimacy of this system:
            </p>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Compare with System Activity Monitor</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Log in as "operator" to view the Host Workstation dashboard. Open your Mac Activity Monitor or Windows Task Manager and compare the CPU utilization and running processes. They will match in real-time.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Perform a CPU Stress Test</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Open a terminal on your host machine and run a CPU intensive command (e.g. <code className="bg-[#03050a] px-1 py-0.5 rounded text-rose-400 font-mono">yes &gt; /dev/null &amp;</code> on macOS/Linux). Watch the Host Workstation CPU gauge instantly spike on the dashboard. Terminate the process to watch it cool down.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Query Raw Prometheus API</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Click the "Verify Telemetry" button on the dashboard to view the raw JSON payload fetched from Prometheus, proving there is a live connection to the TSDB.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-8 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-500/10 text-blue-400 text-[9px] font-mono font-bold px-3 py-1 rounded-bl-xl border-l border-b border-slate-800">
              PROMPT_QUERY_VERIFICATION
            </div>
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-400" />
              Direct PromQL Query Check
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              To query the host machine's CPU usage percentage directly from the Prometheus TSDB, copy and paste this query into Prometheus at <span className="text-blue-400 font-mono text-[11px]">http://localhost:9090</span>:
            </p>
            <div className="mt-4 bg-[#03050a] rounded-xl p-4 border border-slate-950 font-mono text-[10px] text-emerald-400 select-all break-all leading-relaxed">
              100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[1m])) * 100)
            </div>
            <p className="text-[10px] text-slate-500 mt-4 leading-relaxed">
              This query takes the rate of idle CPU ticks over the last minute, averages it, multiplies by 100 to get a percentage, and subtracts it from 100 to calculate the active CPU load.
            </p>
          </div>
        </div>
      </section>

      {/* Academic Team Section */}
      <section id="team" className="border-t border-slate-900 bg-slate-950/10 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Stage II Capstone Project</span>
            <h2 className="text-3xl font-black text-white uppercase tracking-wider mt-2">Project Development Team</h2>
            <p className="text-slate-400 mt-3 text-sm">Developed by 4 students under the academic guidance of Government College of Engineering.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, idx) => (
              <div key={idx} className="flex flex-col justify-between p-6 rounded-2xl bg-[#070a14]/40 border border-slate-900 hover:border-slate-800 transition-all">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-dark-700 border border-slate-800 text-sm font-black text-blue-400">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h4 className="mt-4 text-sm font-bold text-white">{member.name}</h4>
                  <p className="text-[10px] text-blue-400 font-bold mt-0.5">{member.role}</p>
                  <p className="text-xs text-slate-400 mt-3 leading-relaxed">{member.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-900 text-[10px] font-mono text-slate-500">
                  Seat No: {member.id}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-slate-900 bg-slate-900/5 p-8 text-center max-w-3xl mx-auto">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Project Guidance</h4>
            <p className="text-sm font-bold text-white mt-2">Prof. K.B. Sadafale</p>
            <p className="text-xs text-slate-500 mt-1">Department of Computer Engineering | Government College of Engineering & Research Avasari Khurd</p>
          </div>
        </div>
      </section>

      {/* FAQ & Deployment Guide */}
      <section id="faq" className="mx-auto max-w-4xl px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-white uppercase tracking-wider">Deployment & FAQ</h2>
          <p className="text-slate-400 mt-3 text-sm">Key architectural and deployment information for your project defense.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-900 bg-slate-900/5 overflow-hidden">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left font-bold text-xs text-white hover:text-blue-400 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180 text-blue-400' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-6 pb-6 text-xs text-slate-400 leading-relaxed border-t border-slate-900/50 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#03050a] py-12 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-500" />
            <span className="font-bold text-white uppercase text-xs">AI-OPS Suite</span>
          </div>
          <p className="text-[11px] text-slate-600">
            &copy; {new Date().getFullYear()} AI-OPS Project Group ID: GCOEARA/CE/2025-26/15. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
export default LandingPage;
