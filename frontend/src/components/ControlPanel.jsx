import React, { useState } from 'react';
import axios from 'axios';
import { Play, RotateCcw, ShieldAlert, AlertCircle } from 'lucide-react';

export function ControlPanel({ activeIncident, onStateChange, forceDegraded, setForceDegraded }) {
  const [loading, setLoading] = useState(false);

  const simulations = [
    { id: 'full_overload', label: 'Full Overload', desc: 'Breaches CPU, Memory, Latency, & Errors' },
    { id: 'cpu_spike', label: 'CPU Spike', desc: 'Spikes CPU utilization only' },
    { id: 'cpu_latency', label: 'Service Overload', desc: 'Spikes CPU and network latency' },
    { id: 'dependency_failure', label: 'Dependency Failure', desc: 'Spikes error rates and latency' },
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
    <div className="rounded-2xl border border-slate-800 bg-dark-800/80 p-6 backdrop-blur-md shadow-xl flex-grow flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Fault Injection Console</h2>
            <p className="text-xs text-slate-400">Trigger controlled synthetic anomalies to evaluate the correlation engine</p>
          </div>
          {activeIncident || forceDegraded ? (
            <span className="flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-rose-400">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
              Simulation Active
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-cyan-400">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              System Stable
            </span>
          )}
        </div>

        {/* Grid of Simulation Triggers */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {simulations.map((sim) => {
            const isActive = activeIncident === sim.id;
            return (
              <button
                key={sim.id}
                disabled={loading || forceDegraded}
                onClick={() => triggerSimulation(sim.id)}
                className={`group flex flex-col items-start rounded-xl border p-4 text-left transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? 'border-rose-500 bg-rose-950/10 text-white shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                    : 'border-slate-800 bg-dark-700/30 hover:border-slate-700 hover:bg-dark-700/60 text-slate-300'
                } disabled:opacity-40`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider">{sim.label}</span>
                  <Play className={`h-3.5 w-3.5 transition-transform group-hover:scale-110 ${isActive ? 'text-rose-400' : 'text-slate-500'}`} />
                </div>
                <span className="mt-2 text-[10px] text-slate-400 leading-relaxed font-medium">{sim.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset & Force Degraded Section */}
      <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-slate-700/50 pt-5 sm:flex-row">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setForceDegraded(!forceDegraded)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider border transition-all duration-300 ${
              forceDegraded
                ? 'bg-rose-600 text-white border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                : 'bg-transparent border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
            }`}
          >
            <ShieldAlert className="h-4 w-4" />
            {forceDegraded ? 'Critical Health Active' : 'Force Critical Health'}
          </button>
          <div className="hidden xl:flex items-center gap-2 text-[10px] text-slate-500">
            <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <span>Resetting cools down metrics over 5 cycles.</span>
          </div>
        </div>
        <button
          disabled={loading}
          onClick={triggerReset}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all duration-200 hover:bg-blue-500 hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] disabled:opacity-50"
        >
          <RotateCcw className="h-4 w-4" />
          Reset System
        </button>
      </div>
    </div>
  );
}
export default ControlPanel;
