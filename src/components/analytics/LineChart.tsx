import React from 'react';

interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  gradient?: boolean;
  showGrid?: boolean;
  showPoints?: boolean;
}

export default function LineChart({
  data,
  height = 200,
  color = 'rgb(59, 130, 246)',
  gradient = true,
  showGrid = true,
  showPoints = true,
}: LineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-muted-foreground"
        style={{ height }}
      >
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const valueRange = maxValue - minValue || 1;

  const padding = 40;
  const chartWidth = 100;
  const chartHeight = height - padding * 2;

  const points = data
    .map((point, index) => {
      const x = (index / (data.length - 1)) * chartWidth;
      const y =
        chartHeight -
        ((point.value - minValue) / valueRange) * chartHeight + padding;
      return `${x},${y}`;
    })
    .join(' ');

  const pathData = data
    .map((point, index) => {
      const x = (index / (data.length - 1)) * chartWidth;
      const y =
        chartHeight -
        ((point.value - minValue) / valueRange) * chartHeight + padding;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <div className="w-full" style={{ height }}>
      <svg viewBox={`0 0 ${chartWidth} ${height}`} className="w-full h-full">
        <defs>
          {gradient && (
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          )}
        </defs>

        {/* Grid lines */}
        {showGrid && (
          <>
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <line
                key={ratio}
                x1="0"
                y1={chartHeight * ratio + padding}
                x2={chartWidth}
                y2={chartHeight * ratio + padding}
                stroke="currentColor"
                strokeOpacity="0.1"
                strokeWidth="0.5"
              />
            ))}
          </>
        )}

        {/* Area fill */}
        {gradient && (
          <path
            d={`${pathData} L ${chartWidth} ${height} L 0 ${height} Z`}
            fill="url(#lineGradient)"
          />
        )}

        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points */}
        {showPoints &&
          data.map((point, index) => {
            const x = (index / (data.length - 1)) * chartWidth;
            const y =
              chartHeight -
              ((point.value - minValue) / valueRange) * chartHeight +
              padding;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill={color}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}

        {/* X-axis labels */}
        <text
          x={chartWidth / 2}
          y={height - 10}
          textAnchor="middle"
          className="text-xs fill-muted-foreground"
        >
          Time
        </text>

        {/* Y-axis max label */}
        <text
          x="0"
          y={padding - 5}
          textAnchor="start"
          className="text-xs fill-muted-foreground"
        >
          {maxValue}
        </text>

        {/* Y-axis min label */}
        <text
          x="0"
          y={height - padding + 5}
          textAnchor="start"
          className="text-xs fill-muted-foreground"
        >
          {minValue}
        </text>
      </svg>
    </div>
  );
}
