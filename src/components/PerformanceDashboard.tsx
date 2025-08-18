import React, { useState, useEffect } from 'react';
import type { PerformanceMetrics, PerformanceBudget } from '../utils/performance';
import { getPerformanceMonitor } from '../utils/performance';

interface PerformanceCardProps {
  title: string;
  value: number | undefined;
  unit: string;
  budget: number;
  description: string;
  formatValue?: (val: number) => string;
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({ 
  title, 
  value, 
  unit, 
  budget, 
  description,
  formatValue = (val) => val.toFixed(0)
}) => {
  const isGood = value ? value <= budget : true;
  const percentage = value ? Math.min((value / budget) * 100, 100) : 0;
  
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 hover:border-red-500/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-300">{title}</h3>
        <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
          isGood ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {isGood ? 'GOOD' : 'NEEDS WORK'}
        </div>
      </div>
      
      <div className="mb-3">
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-white">
            {value ? formatValue(value) : '-'}
          </span>
          <span className="text-sm text-gray-400 ml-1">{unit}</span>
          <span className="text-xs text-gray-500 ml-2">
            / {formatValue(budget)}{unit}
          </span>
        </div>
        
        {value && (
          <div className="mt-2">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  isGood ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
      
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  );
};

interface MetricsHistoryChartProps {
  metrics: PerformanceMetrics[];
  metricKey: keyof PerformanceMetrics;
  title: string;
  unit: string;
  budget: number;
}

const MetricsHistoryChart: React.FC<MetricsHistoryChartProps> = ({
  metrics,
  metricKey,
  title,
  unit,
  budget
}) => {
  const values = metrics.map(m => (m[metricKey] as number) || 0);
  const maxValue = Math.max(...values, budget);
  const minValue = Math.min(...values);
  
  if (values.length === 0) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-4">{title}</h3>
        <div className="text-center text-gray-500 py-8">No data available</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-300 mb-4">{title}</h3>
      
      <div className="relative h-32 mb-2">
        <svg width="100%" height="100%" className="overflow-visible">
          {/* Budget line */}
          <line
            x1="0"
            y1={`${((maxValue - budget) / (maxValue - minValue)) * 100}%`}
            x2="100%"
            y2={`${((maxValue - budget) / (maxValue - minValue)) * 100}%`}
            stroke="#ef4444"
            strokeWidth="1"
            strokeDasharray="2,2"
            opacity="0.6"
          />
          
          {/* Data line */}
          <polyline
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            points={values.map((val, i) => 
              `${(i / (values.length - 1)) * 100},${((maxValue - val) / (maxValue - minValue)) * 100}`
            ).join(' ')}
          />
          
          {/* Data points */}
          {values.map((val, i) => (
            <circle
              key={i}
              cx={`${(i / (values.length - 1)) * 100}%`}
              cy={`${((maxValue - val) / (maxValue - minValue)) * 100}%`}
              r="3"
              fill="#10b981"
            />
          ))}
        </svg>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -ml-10">
          <span>{maxValue.toFixed(0)}</span>
          <span>{minValue.toFixed(0)}</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>Last {values.length} measurements</span>
        <span className="text-red-400">Budget: {budget}{unit}</span>
      </div>
    </div>
  );
};

export const PerformanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [budgetStatus, setBudgetStatus] = useState<Record<string, any>>({});
  const [currentMetrics, setCurrentMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const monitor = getPerformanceMonitor();
    if (!monitor) return;

    // Get current metrics
    const updateMetrics = () => {
      const allMetrics = monitor.getMetrics();
      const status = monitor.getBudgetStatus();
      
      setMetrics(allMetrics);
      setBudgetStatus(status);
      
      if (allMetrics.length > 0) {
        setCurrentMetrics(allMetrics[allMetrics.length - 1]);
      }
    };

    // Load from localStorage
    const storedMetrics = localStorage.getItem('performanceMetrics');
    if (storedMetrics) {
      try {
        const parsed = JSON.parse(storedMetrics);
        setMetrics(parsed);
        if (parsed.length > 0) {
          setCurrentMetrics(parsed[parsed.length - 1]);
        }
      } catch (e) {
        console.warn('Failed to parse stored metrics:', e);
      }
    }

    updateMetrics();
    
    const interval = setInterval(updateMetrics, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Debug toggle
  useEffect(() => {
    const toggleVisibility = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', toggleVisibility);
    return () => window.removeEventListener('keydown', toggleVisibility);
  }, []);

  if (!isVisible && process.env.NODE_ENV === 'production') {
    return null;
  }

  const formatTime = (val: number) => val < 1000 ? `${val.toFixed(0)}` : `${(val/1000).toFixed(1)}s`;
  const formatBytes = (val: number) => val > 1024 * 1024 ? `${(val/1024/1024).toFixed(1)}MB` : `${(val/1024).toFixed(0)}KB`;

  return (
    <div className="fixed top-4 right-4 w-96 max-h-[80vh] overflow-y-auto z-50 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Performance Monitor</h2>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Press Ctrl+Shift+P to toggle • {metrics.length} measurements
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Core Web Vitals */}
        <div className="grid grid-cols-1 gap-3">
          <PerformanceCard
            title="Largest Contentful Paint"
            value={currentMetrics?.lcp}
            unit="ms"
            budget={budgetStatus.lcp?.budget || 2500}
            description="Time until the largest content element is rendered"
            formatValue={formatTime}
          />
          
          <PerformanceCard
            title="First Input Delay"
            value={currentMetrics?.fid}
            unit="ms"
            budget={budgetStatus.fid?.budget || 100}
            description="Time from first user interaction to browser response"
          />
          
          <PerformanceCard
            title="Cumulative Layout Shift"
            value={currentMetrics?.cls}
            unit=""
            budget={budgetStatus.cls?.budget || 0.1}
            description="Visual stability - unexpected layout shifts"
            formatValue={(val) => val.toFixed(3)}
          />
          
          <PerformanceCard
            title="First Contentful Paint"
            value={currentMetrics?.fcp}
            unit="ms"
            budget={budgetStatus.fcp?.budget || 1800}
            description="Time until first content is painted"
            formatValue={formatTime}
          />
          
          <PerformanceCard
            title="Time to First Byte"
            value={currentMetrics?.ttfb}
            unit="ms"
            budget={budgetStatus.ttfb?.budget || 800}
            description="Time until first byte received from server"
          />
        </div>

        {/* Additional Metrics */}
        {currentMetrics?.transferSize && (
          <PerformanceCard
            title="Transfer Size"
            value={currentMetrics.transferSize}
            unit=""
            budget={budgetStatus.transferSize?.budget || 1024 * 1024}
            description="Total bytes transferred over network"
            formatValue={formatBytes}
          />
        )}

        {/* History Charts */}
        {metrics.length > 1 && (
          <div className="space-y-3 pt-4 border-t border-gray-700">
            <h3 className="text-sm font-medium text-gray-300">Trends</h3>
            
            <MetricsHistoryChart
              metrics={metrics}
              metricKey="lcp"
              title="LCP Trend"
              unit="ms"
              budget={budgetStatus.lcp?.budget || 2500}
            />
            
            <MetricsHistoryChart
              metrics={metrics}
              metricKey="fcp"
              title="FCP Trend"
              unit="ms"
              budget={budgetStatus.fcp?.budget || 1800}
            />
          </div>
        )}

        {/* Current Session Info */}
        {currentMetrics && (
          <div className="pt-4 border-t border-gray-700">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Session Info</h3>
            <div className="text-xs text-gray-400 space-y-1">
              <div>URL: {currentMetrics.url.split('/').pop() || 'Home'}</div>
              <div>Viewport: {currentMetrics.viewport.width}×{currentMetrics.viewport.height}</div>
              {currentMetrics.connection?.effectiveType && (
                <div>Connection: {currentMetrics.connection.effectiveType}</div>
              )}
              <div>Updated: {new Date(currentMetrics.timestamp).toLocaleTimeString()}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceDashboard;