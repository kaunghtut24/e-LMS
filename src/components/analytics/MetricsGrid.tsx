import React from 'react';
import AnalyticsCard from './AnalyticsCard';

interface Metric {
  id: string;
  title: string;
  value: string | number;
  description?: string;
  icon: any;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

interface MetricsGridProps {
  metrics: Metric[];
  columns?: 2 | 3 | 4;
}

export default function MetricsGrid({
  metrics,
  columns = 4,
}: MetricsGridProps) {
  const getGridCols = () => {
    switch (columns) {
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
    }
  };

  return (
    <div className={`grid gap-6 ${getGridCols()}`}>
      {metrics.map((metric) => (
        <AnalyticsCard
          key={metric.id}
          title={metric.title}
          value={metric.value}
          description={metric.description}
          icon={metric.icon}
          trend={metric.trend}
        />
      ))}
    </div>
  );
}
