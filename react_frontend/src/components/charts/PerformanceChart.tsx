
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type PerformanceData = {
  month: string;
  math: number;
  science: number;
  english: number;
  history: number;
};

interface PerformanceChartProps {
  data: PerformanceData[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h3 className="text-lg font-semibold mb-6">Class Performance Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="month" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '8px'
            }} 
          />
          <Line type="monotone" dataKey="math" stroke="#8B5CF6" strokeWidth={2} />
          <Line type="monotone" dataKey="science" stroke="#06B6D4" strokeWidth={2} />
          <Line type="monotone" dataKey="english" stroke="#10B981" strokeWidth={2} />
          <Line type="monotone" dataKey="history" stroke="#F59E0B" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;