import React from 'react';
import { Layers, Cpu, ShieldAlert, Cpu as CoreIcon, Terminal, ArrowRight } from 'lucide-react';

export function LandingPage({ onLaunch }) {
  const team = [
    { name: 'Tanishq Mohod', id: 'B400780331', role: 'Lead Architect & Backend' },
    { name: 'Vaishnavi Landge', id: 'B400780292', role: 'Frontend & UI Designer' },
    { name: 'Gayatri Parkhe', id: 'B400780302', role: 'DevOps & Observability' },
    { name: 'Atharv Bhalerao', id: 'B400780272', role: 'QA Lead & AIOps Logic' },
  ];

  const features = [
    {
      icon: Cpu,
      title: 'Stateful Telemetry Simulation',
      desc: 'Generates real-time CPU, memory, latency, and error metrics with realistic Gaussian noise.'
    },
    {
      icon: ShieldAlert,
      title: 'Intelligent Alert Correlation',
      desc: 'Groups related threshold breaches into single, high-level incidents to eliminate alert fatigue.'
    },
    {
      icon: Terminal,
      title: 'Natural Language Insights',
      desc: 'Provides automated root cause explanations and step-by-step remediation recommendations.'
    }
  ];

  return (
    <div className="relative min-h-full bg-[#070A13] overflow-hidden text-slate-100 flex flex-col justify-between">
      {/* Abstract Glowing Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-900 bg-dark-900/40 backdrop-blur-md py-5">
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-wider text-white uppercase leading-none">AI-OPS</h1>
              <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-widest">Intelligent IT Operations</p>
            </div>
          </div>
          <div className="text-xs text-slate-500 font-medium">Stage II Capstone Project</div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-6 py-16 flex-grow flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/5 px-4 py-1.5 text-xs font-semibold text-blue-400 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
          Next-Generation Observability & AIOps
        </div>

        <h1 className="mt-8 text-4xl font-black tracking-tight text-white sm:text-6xl max-w-4xl leading-[1.15]">
          AI-Driven Proactive IT Operations Using{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Intelligent Monitoring
          </span>
        </h1>

        <p className="mt-6 text-md text-slate-400 max-w-2xl leading-relaxed">
          A production-grade simulation platform integrating Prometheus, Grafana, and an automated rule-based correlation engine. Detect anomalies in real-time, reduce alert noise, and accelerate remediation.
        </p>

        {/* Pulsing CTA Button */}
        <button
          onClick={onLaunch}
          className="group mt-10 relative inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-bold text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(37,99,235,0.6)] focus:outline-none"
        >
          <span>Launch Command Center</span>
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>

        {/* Feature Grid */}
        <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-3 w-full">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="rounded-2xl border border-slate-900 bg-slate-900/25 p-6 text-left backdrop-blur-md transition-all hover:border-slate-800">
                <div className="rounded-xl bg-blue-500/5 p-3 text-blue-400 w-fit">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-bold text-white">{feat.title}</h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Academic Team Card */}
        <div className="mt-16 w-full max-w-4xl rounded-2xl border border-slate-900 bg-slate-900/10 p-8 backdrop-blur-md">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 text-center mb-6">
            Project Development Team
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
            {team.map((member, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-900/20 border border-slate-950">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-dark-700 border border-slate-800 text-xs font-bold text-blue-400">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h4 className="mt-3 text-sm font-bold text-white">{member.name}</h4>
                <p className="text-[10px] text-blue-400 font-medium mt-0.5">{member.role}</p>
                <p className="text-[10px] text-slate-500 mt-1.5 font-mono">{member.id}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[11px] text-slate-500 text-center">
            Under the Guidance of **Prof. K.B. Sadafale** | Government College of Engineering & Research Avasari Khurd
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-dark-900/20 py-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} AI-OPS Project Group ID: GCOEARA/CE/2025-26/15. All rights reserved.
      </footer>
    </div>
  );
}
export default LandingPage;
