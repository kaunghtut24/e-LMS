import React from 'react';

interface HeatMapData {
  label: string;
  value: number;
  intensity: number; // 0-1
  color?: string;
}

interface HeatMapProps {
  data: HeatMapData[];
  title?: string;
  colorScheme?: 'blue' | 'green' | 'purple' | 'orange';
}

export default function HeatMap({
  data,
  title,
  colorScheme = 'blue',
}: HeatMapProps) {
  const getColor = (intensity: number) => {
    const colors = {
      blue: [
        'rgb(239, 246, 255)',
        'rgb(219, 234, 254)',
        'rgb(191, 219, 254)',
        'rgb(147, 197, 253)',
        'rgb(59, 130, 246)',
        'rgb(37, 99, 235)',
      ],
      green: [
        'rgb(240, 253, 244)',
        'rgb(220, 252, 231)',
        'rgb(187, 247, 208)',
        'rgb(134, 239, 172)',
        'rgb(74, 222, 128)',
        'rgb(34, 197, 94)',
      ],
      purple: [
        'rgb(250, 245, 255)',
        'rgb(243, 232, 255)',
        'rgb(221, 214, 254)',
        'rgb(196, 181, 253)',
        'rgb(167, 139, 250)',
        'rgb(139, 92, 246)',
      ],
      orange: [
        'rgb(255, 247, 237)',
        'rgb(254, 236, 217)',
        'rgb(253, 230, 138)',
        'rgb(252, 211, 77)',
        'rgb(251, 191, 36)',
        'rgb(245, 158, 11)',
      ],
    };

    const palette = colors[colorScheme];
    const index = Math.min(
      Math.floor(intensity * (palette.length - 1)),
      palette.length - 1
    );
    return palette[index];
  };

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="space-y-3">
      {title && <h3 className="text-sm font-medium">{title}</h3>}
      <div className="grid grid-cols-7 gap-2">
        {data.map((item, index) => {
          const normalizedIntensity = maxValue > 0 ? item.value / maxValue : 0;
          const color = getColor(normalizedIntensity);

          return (
            <div
              key={index}
              className="aspect-square rounded flex items-center justify-center text-xs font-medium text-foreground"
              style={{ backgroundColor: color }}
              title={`${item.label}: ${item.value}`}
            >
              {item.value}
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Low</span>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded"
              style={{ backgroundColor: getColor(i / 4) }}
            />
          ))}
        </div>
        <span>High</span>
      </div>
    </div>
  );
}
