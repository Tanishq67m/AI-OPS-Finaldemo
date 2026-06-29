import React, { useEffect, useRef } from 'react';
import { ShieldCheck, AlertOctagon, Terminal, Activity, Clock, Play } from 'lucide-react';

const SEVERITY_COLORS = {
  low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  critical: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
};

export function AlertPanel({ activeAlert, alertHistory, logs, predictiveAlerts = [] }) {
  const terminalRef = useRef(null);

  // Auto-scroll terminal to bottom only if user is already near the bottom
  useEffect(() => {
    const term = terminalRef.current;
    if (term) {
      const isNearBottom = term.scrollHeight - term.clientHeight - term.scrollTop < 60;
      if (isNearBottom) {
        term.scrollTop = term.scrollHeight;
      }
    }
  }, [logs]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* 1. Active Alert & Insights */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-dark-800/80 p-6 backdrop-blur-md flex flex-col justify-between shadow-xl">
          <div>
            <h2 className="text-lg font-bold text-white border-b border-slate-700/50 pb-4">
              Insights & Alert Correlation
            </h2>

            {!activeAlert && predictiveAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-400 animate-pulse">
                  <ShieldCheck className="h-10 w-10" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-white">All Systems Operational</h3>
                <p className="mt-1.5 text-xs text-slate-400 max-w-sm leading-relaxed">
                  The anomaly detection engine has found no metric deviations. System health is optimal.
                </p>
              </div>
            ) : (
              <div className="mt-6">
                {(() => {
                  const alert = activeAlert || predictiveAlerts[0];
                  return (
                    <>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`rounded-full p-2.5 ${alert.isPredictive ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse' : alert.severity === 'critical' || alert.severity === 'high' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                            <AlertOctagon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">{alert.title}</h3>
                            <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                              {alert.isPredictive 
                                ? `Forecasting breach in ~${alert.secondsToBreach}s` 
                                : `Detected at ${new Date(alert.timestamp).toLocaleTimeString()}`
                              }
                            </p>
                          </div>
                        </div>
                        <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${alert.isPredictive ? 'bg-blue-500/15 text-blue-400 border-blue-500/30' : SEVERITY_COLORS[alert.severity]}`}>
                          {alert.isPredictive ? 'FORECAST' : alert.severity}
                        </span>
                      </div>

                      {/* Explanations & Actions */}
                      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-xl bg-dark-900/50 p-4 border border-slate-800/50">
                          <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                            <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                            {alert.isPredictive ? 'Predictive Analysis (Linear Regression)' : 'Probable Root Cause'}
                          </h4>
                          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                            {alert.explanation}
                          </p>
                        </div>

                        <div className="rounded-xl bg-dark-900/50 p-4 border border-slate-800/50">
                          <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                            <Activity className="h-3.5 w-3.5 text-emerald-400" />
                            Proactive Remediation Action
                          </h4>
                          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                            {alert.recommendation}
                          </p>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>

          {(activeAlert || (predictiveAlerts && predictiveAlerts.length > 0)) && (
            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-700/50 pt-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-2">
                {activeAlert ? 'Correlated Telemetry:' : 'Trend-Tracked Metric:'}
              </span>
              {(activeAlert || predictiveAlerts[0]).affectedMetrics.map(metric => (
                <span key={metric} className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-[9px] font-bold text-slate-300 uppercase tracking-wider">
                  {metric}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 2. Incident History Log */}
        <div className="rounded-2xl border border-slate-800 bg-dark-800/80 p-6 backdrop-blur-md shadow-xl">
          <h2 className="text-lg font-bold text-white border-b border-slate-700/50 pb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-slate-400" />
            Incident History
          </h2>

          <div className="mt-4 h-[240px] overflow-y-auto pr-1 space-y-3">
            {alertHistory.length === 0 ? (
              <p className="text-center text-xs text-slate-500 py-16">No historical incidents recorded.</p>
            ) : (
              alertHistory.map((item, idx) => (
                <div key={idx} className="rounded-xl bg-dark-900/40 p-3 border border-slate-800/60 flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{item.title}</h4>
                    <p className="mt-1 text-[9px] text-slate-400 font-medium">
                      {new Date(item.timestamp).toLocaleTimeString()} • {item.affectedMetrics.join(', ').toUpperCase()}
                    </p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${SEVERITY_COLORS[item.severity]}`}>
                    {item.severity}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 3. Live Operational Terminal */}
      <div className="rounded-2xl border border-slate-800 bg-dark-800/80 p-6 backdrop-blur-md shadow-xl">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-4">
          <Terminal className="h-4 w-4 text-emerald-400" />
          Live Operational Logs
        </h2>
        <div ref={terminalRef} className="h-44 w-full overflow-y-auto rounded-xl bg-[#030712] border border-slate-950 p-4 font-mono text-[11px] text-emerald-400 shadow-inner leading-relaxed">
          {logs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-2 py-0.5">
              <span className="text-slate-500 select-none">[{log.time}]</span>
              <span className={log.type === 'error' ? 'text-rose-400 font-bold' : log.type === 'warn' ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                {log.message}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default AlertPanel;
