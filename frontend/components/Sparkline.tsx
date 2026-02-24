import React from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { PricePoint } from '../types';

interface SparklineProps {
  data: PricePoint[];
  color: string;
  isPositive: boolean;
}

const Sparkline: React.FC<SparklineProps> = ({ data, color, isPositive }) => {
  return (
    <div className="h-16 w-full opacity-80 hover:opacity-100 transition-opacity">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <YAxis domain={['dataMin', 'dataMax']} hide />
          <Line
            type="monotone"
            dataKey="value"
            stroke={isPositive ? '#10b981' : '#ef4444'}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false} // Disable animation for smoother real-time updates
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Sparkline;
