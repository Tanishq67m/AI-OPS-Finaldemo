import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export function useMetricsPoller(intervalMs = 5000) {
  const [metrics, setMetrics] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPrometheusConnected, setIsPrometheusConnected] = useState(true);

  const historyRef = useRef([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchMetrics() {
      try {
        // 1. Try fetching from Prometheus using an optimized bulk query
        const promUrl = '/prometheus/api/v1/query';
        const query = '{__name__=~"cpu_usage_percent|memory_usage_percent|http_response_latency_ms|application_error_rate_percent|system_load|anomaly_score|disk_usage_percent|network_in_bytes|network_out_bytes|running_processes"}';
        
        const response = await axios.get(promUrl, {
          params: { query },
          timeout: 3000
        });

        if (!isMounted) return;

        const results = response.data?.data?.result || [];
        
        // If Prometheus has no data yet, fall back to backend
        if (results.length === 0) {
          throw new Error("No data in Prometheus yet");
        }

        const parsedMetrics = {};
        results.forEach(item => {
          const name = item.metric.__name__;
          const val = parseFloat(item.value[1]);
          parsedMetrics[name] = isNaN(val) ? 0 : val;
        });

        setIsPrometheusConnected(true);
        setError(null);
        updateMetricsState(parsedMetrics);

      } catch (err) {
        if (!isMounted) return;
        console.warn('Prometheus fetch failed, falling back to backend API:', err.message);
        
        // 2. Fallback to direct backend API health check
        try {
          const fallbackResponse = await axios.get('/api/health', { timeout: 3000 });
          if (!isMounted) return;

          const backendMetrics = fallbackResponse.data.metrics;
          if (backendMetrics) {
            setIsPrometheusConnected(false);
            setError(null);
            updateMetricsState(backendMetrics);
          } else {
            throw new Error("No metrics in backend health response");
          }
        } catch (fallbackErr) {
          if (!isMounted) return;
          console.error('Fallback API also failed:', fallbackErr.message);
          setError('Failed to fetch metrics from both Prometheus and Backend.');
          setLoading(false);
        }
      }
    }

    function updateMetricsState(newMetrics) {
      setMetrics(newMetrics);
      
      // Add timestamp for chart rendering
      const dataPoint = {
        ...newMetrics,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        timestamp: Date.now()
      };

      const updatedHistory = [...historyRef.current, dataPoint].slice(-30);
      historyRef.current = updatedHistory;
      setHistory(updatedHistory);
      setLoading(false);
    }

    fetchMetrics();
    const interval = setInterval(fetchMetrics, intervalMs);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [intervalMs]);

  return { metrics, history, loading, error, isPrometheusConnected };
}
