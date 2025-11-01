import React from 'react';

interface BarData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarData[];
  height?: number;
  horizontal?: boolean;
  showValues?: boolean;
  maxBars?: number;
}

export default function BarChart({
  data,
  height = 300,
  horizontal = false,
  showValues = false,
  maxBars,
}: BarChartProps) {
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

  const displayData = maxBars ? data.slice(0, maxBars) : data;
  const maxValue = Math.max(...displayData.map((d) => d.value));

  const padding = 40;
  const chartWidth = horizontal ? height - padding * 2 : 600;
  const chartHeight = horizontal ? 600 : height - padding * 2;

  const barWidth = horizontal
    ? chartHeight / displayData.length - 10
    : chartWidth / displayData.length - 20;

  if (horizontal) {
    return (
      <div className="w-full space-y-3">
        {displayData.map((item, index) => {
          const barLength = (item.value / maxValue) * (chartWidth - padding);
          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.label}</span>
                {showValues && (
                  <span className="text-sm text-muted-foreground">
                    {item.value}
                  </span>
                )}
              </div>
              <div className="relative h-8 bg-muted rounded overflow-hidden">
                <div
                  className="h-full rounded transition-all duration-500 ease-out"
                  style={{
                    width: `${barLength}px`,
                    backgroundColor:
                      item.color || 'rgb(59, 130, 246)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height }}>
      <svg viewBox={`0 0 ${chartWidth} ${height}`} className="w-full h-full">
        {/* Grid lines */}
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

        {/* Bars */}
        {displayData.map((item, index) => {
          const x = (index / displayData.length) * chartWidth + 10;
          const barHeight = (item.value / maxValue) * chartHeight;
          const y = chartHeight + padding - barHeight;

          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={item.color || 'rgb(59, 130, 246)'}
                rx="4"
              />
              {/* Label */}
              <text
                x={x + barWidth / 2}
                y={height - 10}
                textAnchor="middle"
                className="text-xs fill-muted-foreground"
              >
                {item.label}
              </text>
              {/* Value */}
              {showValues && (
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  className="text-xs font-medium fill-foreground"
                >
                  {item.value}
                </text>
              )}
            </g>
          );
        })}

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
          y={height - 10}
          textAnchor="start"
          className="text-xs fill-muted-foreground"
        >
          0
        </text>
      </svg>
    </div>
  );
}
