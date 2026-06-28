import React from 'react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

export function MetricCard({ name, value, unit, icon: Icon, history, dataKey, threshold, isAnomaly }) {
  // Constants for SVG Circular Gauge
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const pct = value !== undefined ? Math.min(100, Math.max(0, value)) : 0;
  // Adjust percentage mapping for latency which is up to 1000ms
  const percentage = dataKey === 'http_response_latency_ms' ? (pct / 1000) * 100 : pct;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Curated Color Scheme: Cyan (Stable) vs. Rose (Breached)
  const strokeColor = isAnomaly ? 'stroke-rose-500' : 'stroke-cyan-500';
  const glowColor = isAnomaly ? 'shadow-rose-500/10 border-rose-500/30 bg-rose-950/5' : 'shadow-cyan-500/5 border-slate-800 bg-dark-800/80';
  const textColor = isAnomaly ? 'text-rose-400' : 'text-cyan-400';
  const sparklineColor = isAnomaly ? '#f43f5e' : '#06b6d4';

  return (
    <div className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 backdrop-blur-md shadow-lg ${glowColor}`}>
      {/* Top Section: Title & Gauge */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{name}</p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-white">
            {value !== undefined ? `${value}` : '--'}
            <span className="text-xs font-semibold text-slate-400 ml-0.5">{unit}</span>
          </h3>
        </div>

        {/* Circular SVG Gauge */}
        <div className="relative h-12 w-12 flex items-center justify-center">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 50 50">
            {/* Background Circle */}
            <circle
              className="stroke-slate-800"
              strokeWidth="4"
              fill="transparent"
              r={radius}
              cx="25"
              cy="25"
            />
            {/* Foreground Progress Circle */}
            <circle
              className={`transition-all duration-500 ease-out ${strokeColor}`}
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              r={radius}
              cx="25"
              cy="25"
            />
          </svg>
          {/* Centered Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className={`h-4 w-4 ${isAnomaly ? 'text-rose-400' : 'text-slate-400'}`} />
          </div>
        </div>
      </div>

      {/* Threshold & Status Indicators */}
      <div className="mt-5 flex items-center justify-between text-[11px] font-medium">
        <span className="text-slate-500">Threshold: {threshold}{unit}</span>
        {isAnomaly ? (
          <span className="font-bold text-rose-400 animate-pulse uppercase tracking-wider">Breached</span>
        ) : (
          <span className="text-emerald-400 font-bold uppercase tracking-wider">Normal</span>
        )}
      </div>

      {/* Sparkline Trend Chart */}
      <div className="mt-4 h-12 w-full overflow-hidden rounded-lg bg-dark-900/40 border border-slate-800/20">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={sparklineColor} stopOpacity={0.15}/>
                <stop offset="100%" stopColor={sparklineColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={sparklineColor} 
              strokeWidth={1.5}
              fillOpacity={1} 
              fill={`url(#grad-${dataKey})`} 
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
export default MetricCard;
