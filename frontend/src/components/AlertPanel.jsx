import React from 'react';
import { ShieldCheck, AlertOctagon, Terminal, Activity, Clock } from 'lucide-react';

const SEVERITY_COLORS = {
  low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  critical: 'bg-red-500/10 text-red-400 border-red-500/20'
};

export function AlertPanel({ activeAlert, alertHistory }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Active Alert Details */}
      <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-dark-800/80 p-6 backdrop-blur-md flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white border-b border-slate-700/50 pb-4">
            Active Alerts & Correlation
          </h2>

          {!activeAlert ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-emerald-500/10 p-4 text-emerald-400">
                <ShieldCheck className="h-10 w-10" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">All Systems Operational</h3>
              <p className="mt-1 text-sm text-slate-400 max-w-sm">
                The anomaly detection engine has found no deviations. Metrics are within normal operating ranges.
              </p>
            </div>
          ) : (
            <div className="mt-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`rounded-full p-2 ${activeAlert.severity === 'critical' || activeAlert.severity === 'high' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    <AlertOctagon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-md font-bold text-white">{activeAlert.title}</h3>
                    <p className="text-xs text-slate-400">
                      Detected at {new Date(activeAlert.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${SEVERITY_COLORS[activeAlert.severity]}`}>
                  {activeAlert.severity}
                </span>
              </div>

              {/* Explanations & Actions */}
              <div className="mt-6 space-y-4">
                <div className="rounded-xl bg-dark-700/30 p-4 border border-slate-700/30">
                  <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
                    <Terminal className="h-3.5 w-3.5 text-blue-400" />
                    Probable Root Cause
                  </h4>
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                    {activeAlert.explanation}
                  </p>
                </div>

                <div className="rounded-xl bg-dark-700/30 p-4 border border-slate-700/30">
                  <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
                    <Activity className="h-3.5 w-3.5 text-emerald-400" />
                    Recommended Remediation Action
                  </h4>
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                    {activeAlert.recommendation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {activeAlert && (
          <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-700/50 pt-4">
            <span className="text-xs text-slate-400 mr-2">Correlated Metrics:</span>
            {activeAlert.affectedMetrics.map(metric => (
              <span key={metric} className="rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 uppercase">
                {metric}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Incident History Log */}
      <div className="rounded-2xl border border-slate-800 bg-dark-800/80 p-6 backdrop-blur-md">
        <h2 className="text-lg font-semibold text-white border-b border-slate-700/50 pb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-slate-400" />
          Incident History
        </h2>

        <div className="mt-4 max-h-[290px] overflow-y-auto pr-1 space-y-3">
          {alertHistory.length === 0 ? (
            <p className="text-center text-sm text-slate-500 py-12">No historical incidents recorded.</p>
          ) : (
            alertHistory.map((item, idx) => (
              <div key={idx} className="rounded-xl bg-dark-700/20 p-3.5 border border-slate-800/80 flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">{item.title}</h4>
                  <p className="mt-1 text-[10px] text-slate-400">
                    {new Date(item.timestamp).toLocaleTimeString()} • {item.affectedMetrics.join(', ').toUpperCase()}
                  </p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide border ${SEVERITY_COLORS[item.severity]}`}>
                  {item.severity}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
export default AlertPanel;
