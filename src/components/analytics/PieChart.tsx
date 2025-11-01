import React from 'react';

interface PieData {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieData[];
  size?: number;
  showLabels?: boolean;
  showLegend?: boolean;
  innerRadius?: number;
}

export default function PieChart({
  data,
  size = 200,
  showLabels = true,
  showLegend = true,
  innerRadius = 0,
}: PieChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2;
  const centerX = radius;
  const centerY = radius;

  let currentAngle = -Math.PI / 2; // Start from top

  const arcs = data.map((item, index) => {
    const angle = (item.value / total) * Math.PI * 2;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    currentAngle += angle;

    // Calculate path for arc
    const x1 =
      centerX +
      (radius - innerRadius) * Math.cos(startAngle) + innerRadius;
    const y1 =
      centerY +
      (radius - innerRadius) * Math.sin(startAngle) + innerRadius;
    const x2 =
      centerX +
      (radius - innerRadius) * Math.cos(endAngle) + innerRadius;
    const y2 =
      centerY +
      (radius - innerRadius) * Math.sin(endAngle) + innerRadius;

    const largeArcFlag = angle > Math.PI ? 1 : 0;

    let path;
    if (innerRadius > 0) {
      // Donut chart
      const innerX1 =
        centerX + innerRadius * Math.cos(startAngle) + innerRadius;
      const innerY1 =
        centerY + innerRadius * Math.sin(startAngle) + innerRadius;
      const innerX2 =
        centerX + innerRadius * Math.cos(endAngle) + innerRadius;
      const innerY2 =
        centerY + innerRadius * Math.sin(endAngle) + innerRadius;

      path = [
        `M ${x1} ${y1}`,
        `A ${radius - innerRadius} ${radius - innerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        `L ${innerX2} ${innerY2}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerX1} ${innerY1}`,
        'Z',
      ].join(' ');
    } else {
      // Pie chart
      path = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z',
      ].join(' ');
    }

    // Calculate label position
    const labelAngle = startAngle + angle / 2;
    const labelRadius = radius * 0.7;
    const labelX = centerX + labelRadius * Math.cos(labelAngle);
    const labelY = centerY + labelRadius * Math.sin(labelAngle);

    const percentage = ((item.value / total) * 100).toFixed(1);

    return {
      ...item,
      path,
      labelX,
      labelY,
      percentage,
      startAngle,
      endAngle,
    };
  });

  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <g transform={`translate(${0}, ${0})`}>
            {arcs.map((arc, index) => (
              <path
                key={index}
                d={arc.path}
                fill={arc.color}
                stroke="white"
                strokeWidth="2"
                className="hover:opacity-80 transition-opacity"
              />
            ))}
            {showLabels &&
              arcs.map((arc, index) => {
                if (parseFloat(arc.percentage) < 5) return null; // Don't show label for small slices
                return (
                  <text
                    key={`label-${index}`}
                    x={arc.labelX}
                    y={arc.labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs font-medium fill-white pointer-events-none"
                  >
                    {arc.percentage}%
                  </text>
                );
              })}
          </g>
        </svg>
      </div>

      {showLegend && (
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-foreground">{item.label}</span>
              <span className="text-sm text-muted-foreground">
                ({item.value})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
