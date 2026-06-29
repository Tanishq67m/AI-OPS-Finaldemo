import React, { useState } from 'react';
import axios from 'axios';
import { 
  Play, 
  RotateCcw, 
  ShieldAlert, 
  AlertCircle,
  Flame,
  Zap,
  Activity,
  Network,
  TrendingUp
} from 'lucide-react';

export function ControlPanel({ activeIncident, onStateChange, forceDegraded, setForceDegraded }) {
  const [loading, setLoading] = useState(false);

  const simulations = [
    { 
      id: 'full_overload', 
      label: 'Full Overload', 
      desc: 'Breaches CPU, Memory, Latency, & Errors',
      icon: Flame 
    },
    { 
      id: 'cpu_spike', 
      label: 'CPU Spike', 
      desc: 'Spikes CPU utilization to 92%',
      icon: Zap 
    },
    { 
      id: 'cpu_latency', 
      label: 'Service Overload', 
      desc: 'Spikes CPU and network latency',
      icon: Activity 
    },
    { 
      id: 'dependency_failure', 
      label: 'Dependency Failure', 
      desc: 'Spikes error rates and latency',
      icon: Network 
    },
    { 
      id: 'gradual_cpu', 
      label: 'Gradual CPU Escalation', 
      desc: 'Steadily increases CPU over 5 cycles',
      icon: TrendingUp 
    },
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
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-white">Fault Injection Console</h2>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-tight font-medium">Trigger synthetic anomalies to evaluate the correlation engine</p>
          </div>
          {activeIncident || forceDegraded ? (
            <span className="flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase text-rose-400">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
              Active
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Stable
            </span>
          )}
        </div>

        {/* List of Simulation Triggers */}
        <div className="mt-5 space-y-2.5">
          {simulations.map((sim) => {
            const isActive = activeIncident === sim.id;
            const Icon = sim.icon;
            return (
              <button
                key={sim.id}
                disabled={loading || forceDegraded}
                onClick={() => triggerSimulation(sim.id)}
                className={`group w-full flex items-center justify-between rounded-xl border p-3 text-left transition-all duration-200 ${
                  isActive
                    ? 'border-rose-500 bg-rose-950/10 text-white shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                    : 'border-slate-800 bg-dark-700/20 hover:border-slate-700 hover:bg-dark-700/45 text-slate-300'
                } disabled:opacity-40`}
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 border ${isActive ? 'bg-rose-500/20 border-rose-500/30 text-rose-400' : 'bg-slate-900 border-slate-800 text-slate-500 group-hover:text-slate-400 transition-colors'}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider block">{sim.label}</span>
                    <span className="text-[9px] text-slate-500 font-medium mt-0.5 block leading-tight">{sim.desc}</span>
                  </div>
                </div>
                <Play className={`h-3 w-3 mr-1 transition-transform group-hover:translate-x-0.5 ${isActive ? 'text-rose-400' : 'text-slate-600'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset & Force Degraded Section */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col gap-2.5">
        <button
          onClick={() => setForceDegraded(!forceDegraded)}
          className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold uppercase tracking-wider border transition-all duration-200 ${
            forceDegraded
              ? 'bg-rose-600 text-white border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
              : 'bg-transparent border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          {forceDegraded ? 'Critical Health Active' : 'Force Critical Health'}
        </button>
        
        <button
          disabled={loading}
          onClick={triggerReset}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(37,99,235,0.25)] transition-all duration-200 hover:bg-blue-500 hover:shadow-[0_0_25px_rgba(37,99,235,0.45)] disabled:opacity-50"
        >
          <RotateCcw className="h-4 w-4" />
          Reset System
        </button>

        <div className="flex items-center gap-1.5 text-[9px] text-slate-500 mt-1 justify-center">
          <AlertCircle className="h-3 w-3 text-amber-500 flex-shrink-0" />
          <span>Resetting cools down metrics over 5 cycles.</span>
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
