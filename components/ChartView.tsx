import React from 'react';
import type { WeatherData } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartViewProps {
  data: WeatherData[];
  parameter: string;
}

const ChartView: React.FC<ChartViewProps> = ({ data, parameter }) => {
  const chartData = data.map(item => ({
    name: `${item.month} ${item.year}`,
    value: item.value,
  }));

  const unit = parameter === 'Rainfall' ? 'mm' : parameter === 'Sunshine' ? 'hours' : '°C';
  const color = parameter === 'Rainfall' ? '#3b82f6' : parameter === 'Tmax' ? '#ef4444' : parameter === 'Sunshine' ? '#f59e0b' : '#60a5fa';

  return (
    <div className="p-4 md:p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
        {parameter} Trend
      </h3>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
            <XAxis dataKey="name" tick={{ fill: '#64748b' }} fontSize={12} />
            <YAxis tick={{ fill: '#64748b' }} fontSize={12} label={{ value: unit, angle: -90, position: 'insideLeft', fill: '#64748b' }}/>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(5px)',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                color: '#1e293b'
              }}
              labelStyle={{ fontWeight: 'bold' }}
              formatter={(value: number) => [`${value.toFixed(1)} ${unit}`, parameter]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              name={parameter}
              stroke={color}
              strokeWidth={2}
              activeDot={{ r: 8, style: { fill: color, stroke: '#fff', strokeWidth: 2 } }}
              dot={{ r: 4, style: { fill: color } }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartView;
