import React from 'react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

export function MetricCard({ name, value, unit, icon: Icon, history, dataKey, threshold, isAnomaly }) {
  // Select color scheme based on anomaly state
  const statusColor = isAnomaly 
    ? 'border-red-500/50 bg-red-950/20 text-red-400' 
    : 'border-slate-800 bg-dark-800/80 text-slate-300';

  const chartColor = isAnomaly ? '#ef4444' : '#3b82f6';

  return (
    <div className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 backdrop-blur-md ${statusColor}`}>
      {/* Glow effect on anomaly */}
      {isAnomaly && (
        <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-red-500/10 blur-xl" />
      )}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{name}</p>
          <h3 className="mt-2 text-3xl font-bold tracking-tight text-white">
            {value !== undefined ? `${value}${unit}` : '--'}
          </h3>
        </div>
        <div className={`rounded-xl p-3 ${isAnomaly ? 'bg-red-500/10' : 'bg-slate-800/50'}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="text-slate-400">Threshold: {threshold}{unit}</span>
        {isAnomaly ? (
          <span className="font-semibold text-red-400 animate-pulse">BREACHED</span>
        ) : (
          <span className="text-emerald-400 font-medium">NORMAL</span>
        )}
      </div>

      {/* Sparkline Chart */}
      <div className="mt-4 h-12 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history}>
            <defs>
              <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColor} stopOpacity={0.2}/>
                <stop offset="100%" stopColor={chartColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={chartColor} 
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
