import React, { useState } from 'react';
import axios from 'axios';
import { Play, RotateCcw, AlertTriangle } from 'lucide-react';

export function ControlPanel({ activeIncident, onStateChange }) {
  const [loading, setLoading] = useState(false);

  const simulations = [
    { id: 'full_overload', label: 'Full Overload', desc: 'Breaches CPU, Memory, Latency, & Errors' },
    { id: 'cpu_spike', label: 'CPU Spike', desc: 'Spikes CPU only' },
    { id: 'cpu_latency', label: 'Service Overload', desc: 'Spikes CPU & Latency' },
    { id: 'dependency_failure', label: 'Dependency Failure', desc: 'Spikes Errors & Latency' },
    { id: 'gradual_cpu', label: 'Gradual CPU Escalation', desc: 'Steadily increases CPU over 5 cycles' },
  ];

  const triggerSimulation = async (type) => {
    try {
      setLoading(true);
      const res = await axios.post('/api/simulate', { type });
      if (onStateChange) onStateChange(res.data.state.incidentType);
    } catch (err) {
      console.error('Failed to trigger simulation:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const triggerReset = async () => {
    try {
      setLoading(true);
      const res = await axios.post('/api/reset');
      if (onStateChange) onStateChange(res.data.state.incidentType);
    } catch (err) {
      console.error('Failed to reset system:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-dark-800/80 p-6 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Incident Control Center</h2>
          <p className="text-xs text-slate-400">Inject controlled faults to test anomaly detection & correlation</p>
        </div>
        {activeIncident ? (
          <span className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
            SIMULATION ACTIVE
          </span>
        ) : (
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            SYSTEM STABLE
          </span>
        )}
      </div>

      {/* Grid of Simulation Triggers */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {simulations.map((sim) => {
          const isActive = activeIncident === sim.id;
          return (
            <button
              key={sim.id}
              disabled={loading}
              onClick={() => triggerSimulation(sim.id)}
              className={`flex flex-col items-start rounded-xl border p-4 text-left transition-all duration-200 ${
                isActive
                  ? 'border-red-500/50 bg-red-500/5 text-white'
                  : 'border-slate-800 bg-dark-700/40 hover:border-slate-700 hover:bg-dark-700/70 text-slate-300'
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="text-sm font-semibold">{sim.label}</span>
                <Play className={`h-3.5 w-3.5 ${isActive ? 'text-red-400' : 'text-slate-500'}`} />
              </div>
              <span className="mt-1.5 text-[10px] text-slate-400 leading-relaxed">{sim.desc}</span>
            </button>
          );
        })}
      </div>

      {/* Reset System Section */}
      <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-slate-700/50 pt-5 sm:flex-row">
        <div className="flex items-center gap-2.5 text-xs text-slate-400">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <span>Resetting initiates a gradual 5-step recovery phase to simulate realistic cooling.</span>
        </div>
        <button
          disabled={loading}
          onClick={triggerReset}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-500 disabled:opacity-50"
        >
          <RotateCcw className="h-4 w-4" />
          Reset System
        </button>
      </div>
    </div>
  );
}
export default ControlPanel;
