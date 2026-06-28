import React from 'react';
import { Network, Server, Database, CloudLightning, Laptop, Flame, Boxes } from 'lucide-react';

export function TopologyMap({ anomalyStates, activeIncident, selectedSystem = 'production' }) {
  if (selectedSystem === 'host') {
    // Determine states of host node based on real CPU/Memory anomalies
    const isHostAlert = anomalyStates.cpu || anomalyStates.memory || anomalyStates.load;
    
    const nodeStatus = {
      host: isHostAlert ? 'error' : 'normal',
      docker: 'normal',
      exporter: 'normal',
      prometheus: 'normal'
    };

    const getStatusColors = (status) => {
      if (status === 'error') {
        return {
          bg: 'fill-red-950/40 stroke-red-500',
          glow: 'rgba(239, 68, 68, 0.25)',
          pulseColor: 'fill-red-500/30',
          iconColor: 'text-red-400'
        };
      }
      return {
        bg: 'fill-emerald-950/40 stroke-emerald-500',
        glow: 'rgba(16, 185, 129, 0.25)',
        pulseColor: 'fill-emerald-500/20',
        iconColor: 'text-emerald-400'
      };
    };

    const hostColors = getStatusColors(nodeStatus.host);
    const dockerColors = getStatusColors(nodeStatus.docker);
    const exporterColors = getStatusColors(nodeStatus.exporter);
    const promColors = getStatusColors(nodeStatus.prometheus);

    const getLineClass = (fromNodeStatus, toNodeStatus) => {
      if (fromNodeStatus === 'error' || toNodeStatus === 'error') {
        return 'stroke-red-500 [stroke-dasharray:6,6] animate-[dash_1s_linear_infinite]';
      }
      return 'stroke-emerald-500/50 [stroke-dasharray:5,5] animate-[dash_3s_linear_infinite]';
    };

    return (
      <div className="rounded-2xl border border-slate-800 bg-dark-800/80 p-6 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Host Topology Map</h2>
            <p className="text-xs text-slate-400">Real-time hardware resource and monitoring pipeline topology</p>
          </div>
        </div>

        <div className="relative mt-6 flex items-center justify-center bg-dark-900/50 rounded-xl border border-slate-800/50 py-8 overflow-hidden">
          {/* SVG Connections */}
          <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <style>{`
                @keyframes dash {
                  to {
                    stroke-dashoffset: -40;
                  }
                }
              `}</style>
            </defs>
            
            {/* Host PC -> Node Exporter */}
            <path
              d="M 120 150 L 280 200"
              strokeWidth="2"
              fill="none"
              className={getLineClass(nodeStatus.host, nodeStatus.exporter)}
            />
            {/* Docker Daemon -> Node Exporter */}
            <path
              d="M 280 100 L 280 200"
              strokeWidth="2"
              fill="none"
              className={getLineClass(nodeStatus.docker, nodeStatus.exporter)}
            />
            {/* Node Exporter -> Prometheus */}
            <path
              d="M 380 200 L 520 150"
              strokeWidth="2"
              fill="none"
              className={getLineClass(nodeStatus.exporter, nodeStatus.prometheus)}
            />
          </svg>

          {/* Node Layout Container */}
          <div className="relative w-full max-w-2xl h-[300px] flex items-center justify-between px-10">
            
            {/* 1. Host Workstation Node */}
            <div className="absolute left-6 top-[110px] flex flex-col items-center">
              <div className="relative flex h-20 w-20 items-center justify-center">
                <div className={`absolute inset-0 rounded-2xl border transition-all duration-500 animate-ping opacity-20 ${nodeStatus.host === 'error' ? 'border-red-500 bg-red-500/10' : 'border-emerald-500 bg-emerald-500/10'}`} />
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border-2 bg-dark-800 shadow-lg backdrop-blur-md transition-all duration-300 ${nodeStatus.host === 'error' ? 'border-red-500/80 shadow-red-500/10' : 'border-emerald-500/50 shadow-emerald-500/5'}`}>
                  <Laptop className={`h-8 w-8 ${hostColors.iconColor}`} />
                </div>
              </div>
              <span className="mt-2 text-xs font-bold text-white">Host Workstation</span>
              <span className={`text-[9px] font-semibold tracking-wider uppercase ${nodeStatus.host === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
                {nodeStatus.host === 'error' ? 'High Resource' : 'Healthy'}
              </span>
            </div>

            {/* 2. Docker Engine Node */}
            <div className="absolute left-[240px] top-[40px] flex flex-col items-center">
              <div className="relative flex h-20 w-20 items-center justify-center">
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border bg-dark-800 shadow-md ${dockerColors.iconColor} border-emerald-500/30`}>
                  <Boxes className="h-8 w-8 text-emerald-400" />
                </div>
              </div>
              <span className="mt-2 text-xs font-bold text-white">Docker Engine</span>
              <span className="text-[9px] font-semibold tracking-wider uppercase text-emerald-400">Running</span>
            </div>

            {/* 3. Node Exporter Node */}
            <div className="absolute left-[240px] top-[170px] flex flex-col items-center">
              <div className="relative flex h-20 w-20 items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-dark-800">
                  <Server className="h-8 w-8 text-emerald-400" />
                </div>
              </div>
              <span className="mt-2 text-xs font-bold text-white">Node Exporter</span>
              <span className="text-[9px] font-semibold tracking-wider uppercase text-emerald-400">Scraping</span>
            </div>

            {/* 4. Prometheus Node */}
            <div className="absolute right-[40px] top-[110px] flex flex-col items-center">
              <div className="relative flex h-20 w-20 items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-dark-800 shadow-lg">
                  <Flame className="h-8 w-8 text-emerald-400" />
                </div>
              </div>
              <span className="mt-2 text-xs font-bold text-white">Prometheus TSDB</span>
              <span className="text-[9px] font-semibold tracking-wider uppercase text-emerald-400">Ingesting</span>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // Fallback to existing application topology map for production
  // Determine states of individual nodes based on active anomalies & incident types
  const isGatewayAlert = activeIncident === 'cpu_latency' || activeIncident === 'full_overload' || anomalyStates.latency;
  const isCoreAlert = activeIncident === 'cpu_spike' || activeIncident === 'cpu_latency' || activeIncident === 'full_overload' || anomalyStates.cpu;
  const isDbAlert = activeIncident === 'full_overload' || anomalyStates.memory;
  const isApiAlert = activeIncident === 'dependency_failure' || activeIncident === 'full_overload' || anomalyStates.error;

  const nodeStatus = {
    gateway: isGatewayAlert ? 'error' : 'normal',
    core: isCoreAlert ? 'error' : 'normal',
    db: isDbAlert ? 'error' : 'normal',
    api: isApiAlert ? 'error' : 'normal'
  };

  const getStatusColors = (status) => {
    if (status === 'error') {
      return {
        bg: 'fill-red-950/40 stroke-red-500',
        glow: 'rgba(239, 68, 68, 0.25)',
        pulseColor: 'fill-red-500/30',
        iconColor: 'text-red-400'
      };
    }
    return {
      bg: 'fill-emerald-950/40 stroke-emerald-500',
      glow: 'rgba(16, 185, 129, 0.25)',
      pulseColor: 'fill-emerald-500/20',
      iconColor: 'text-emerald-400'
    };
  };

  const gwColors = getStatusColors(nodeStatus.gateway);
  const coreColors = getStatusColors(nodeStatus.core);
  const dbColors = getStatusColors(nodeStatus.db);
  const apiColors = getStatusColors(nodeStatus.api);

  const getLineClass = (fromNodeStatus, toNodeStatus) => {
    if (fromNodeStatus === 'error' || toNodeStatus === 'error') {
      return 'stroke-red-500 [stroke-dasharray:6,6] [animation:dash_fast_red_flow_30s_infinite_linear] animate-[dash_1s_linear_infinite]';
    }
    return 'stroke-emerald-500/50 [stroke-dasharray:5,5] animate-[dash_3s_linear_infinite]';
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-dark-800/80 p-6 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Service Topology Map</h2>
          <p className="text-xs text-slate-400">Live network nodes and metric propagation paths</p>
        </div>
      </div>

      <div className="relative mt-6 flex items-center justify-center bg-dark-900/50 rounded-xl border border-slate-800/50 py-8 overflow-hidden">
        {/* SVG Network Connections */}
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <style>{`
              @keyframes dash {
                to {
                  stroke-dashoffset: -40;
                }
              }
            `}</style>
          </defs>
          
          {/* Gateway -> Core Service */}
          <path
            d="M 120 150 L 280 100"
            strokeWidth="2"
            fill="none"
            className={getLineClass(nodeStatus.gateway, nodeStatus.core)}
          />
          {/* Gateway -> Auth Service (Static Normal) */}
          <path
            d="M 120 150 L 280 200"
            strokeWidth="2"
            fill="none"
            className={getLineClass(nodeStatus.gateway, 'normal')}
          />
          {/* Core Service -> Database */}
          <path
            d="M 380 100 L 520 100"
            strokeWidth="2"
            fill="none"
            className={getLineClass(nodeStatus.core, nodeStatus.db)}
          />
          {/* Core Service -> Downstream API */}
          <path
            d="M 380 100 L 520 200"
            strokeWidth="2"
            fill="none"
            className={getLineClass(nodeStatus.core, nodeStatus.api)}
          />
        </svg>

        {/* Node Layout Container */}
        <div className="relative w-full max-w-2xl h-[300px] flex items-center justify-between px-10">
          
          {/* 1. API Gateway Node */}
          <div className="absolute left-6 top-[110px] flex flex-col items-center">
            <div className="relative flex h-20 w-20 items-center justify-center">
              {/* Pulsing Outer Ring */}
              <div className={`absolute inset-0 rounded-2xl border transition-all duration-500 animate-ping opacity-20 ${nodeStatus.gateway === 'error' ? 'border-red-500 bg-red-500/10' : 'border-emerald-500 bg-emerald-500/10'}`} />
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border-2 bg-dark-800 shadow-lg backdrop-blur-md transition-all duration-300 ${nodeStatus.gateway === 'error' ? 'border-red-500/80 shadow-red-500/10' : 'border-emerald-500/50 shadow-emerald-500/5'}`}>
                <Network className={`h-8 w-8 ${gwColors.iconColor}`} />
              </div>
            </div>
            <span className="mt-2 text-xs font-bold text-white">API Gateway</span>
            <span className={`text-[9px] font-semibold tracking-wider uppercase ${nodeStatus.gateway === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
              {nodeStatus.gateway === 'error' ? 'Overloaded' : 'Healthy'}
            </span>
          </div>

          {/* 2. Core App Service Node */}
          <div className="absolute left-[240px] top-[40px] flex flex-col items-center">
            <div className="relative flex h-20 w-20 items-center justify-center">
              {/* Pulsing Outer Ring */}
              <div className={`absolute inset-0 rounded-2xl border transition-all duration-500 animate-ping opacity-20 ${nodeStatus.core === 'error' ? 'border-red-500 bg-red-500/10' : 'border-emerald-500 bg-emerald-500/10'}`} />
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border-2 bg-dark-800 shadow-lg backdrop-blur-md transition-all duration-300 ${nodeStatus.core === 'error' ? 'border-red-500/80 shadow-red-500/10' : 'border-emerald-500/50 shadow-emerald-500/5'}`}>
                <Server className={`h-8 w-8 ${coreColors.iconColor}`} />
              </div>
            </div>
            <span className="mt-2 text-xs font-bold text-white">Core Service</span>
            <span className={`text-[9px] font-semibold tracking-wider uppercase ${nodeStatus.core === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
              {nodeStatus.core === 'error' ? 'High Load' : 'Healthy'}
            </span>
          </div>

          {/* 3. Auth Service Node (Static Normal) */}
          <div className="absolute left-[240px] top-[170px] flex flex-col items-center opacity-70">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-dark-800">
                <Server className="h-8 w-8 text-emerald-500/60" />
              </div>
            </div>
            <span className="mt-2 text-xs font-bold text-slate-300">Auth Service</span>
            <span className="text-[9px] font-semibold tracking-wider uppercase text-emerald-500/60">Healthy</span>
          </div>

          {/* 4. Database Node */}
          <div className="absolute right-[40px] top-[40px] flex flex-col items-center">
            <div className="relative flex h-20 w-20 items-center justify-center">
              {/* Pulsing Outer Ring */}
              <div className={`absolute inset-0 rounded-2xl border transition-all duration-500 animate-ping opacity-20 ${nodeStatus.db === 'error' ? 'border-red-500 bg-red-500/10' : 'border-emerald-500 bg-emerald-500/10'}`} />
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border-2 bg-dark-800 shadow-lg backdrop-blur-md transition-all duration-300 ${nodeStatus.db === 'error' ? 'border-red-500/80 shadow-red-500/10' : 'border-emerald-500/50 shadow-emerald-500/5'}`}>
                <Database className={`h-8 w-8 ${dbColors.iconColor}`} />
              </div>
            </div>
            <span className="mt-2 text-xs font-bold text-white">Database</span>
            <span className={`text-[9px] font-semibold tracking-wider uppercase ${nodeStatus.db === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
              {nodeStatus.db === 'error' ? 'Memory Pres.' : 'Healthy'}
            </span>
          </div>

          {/* 5. Downstream Third Party API Node */}
          <div className="absolute right-[40px] top-[170px] flex flex-col items-center">
            <div className="relative flex h-20 w-20 items-center justify-center">
              {/* Pulsing Outer Ring */}
              <div className={`absolute inset-0 rounded-2xl border transition-all duration-500 animate-ping opacity-20 ${nodeStatus.api === 'error' ? 'border-red-500 bg-red-500/10' : 'border-emerald-500 bg-emerald-500/10'}`} />
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border-2 bg-dark-800 shadow-lg backdrop-blur-md transition-all duration-300 ${nodeStatus.api === 'error' ? 'border-red-500/80 shadow-red-500/10' : 'border-emerald-500/50 shadow-emerald-500/5'}`}>
                <CloudLightning className={`h-8 w-8 ${apiColors.iconColor}`} />
              </div>
            </div>
            <span className="mt-2 text-xs font-bold text-white">Downstream API</span>
            <span className={`text-[9px] font-semibold tracking-wider uppercase ${nodeStatus.api === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
              {nodeStatus.api === 'error' ? 'Failing' : 'Healthy'}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
export default TopologyMap;
