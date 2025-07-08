import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AttendanceData {
  day: string;
  present: number;
  absent: number;
}

interface AttendanceChartProps {
  data: AttendanceData[];
}

const AttendanceChart: React.FC<AttendanceChartProps> = ({ data }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h3 className="text-lg font-semibold mb-6">Weekly Attendance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="day" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '8px'
            }} 
          />
          <Bar dataKey="present" fill="#10B981" />
          <Bar dataKey="absent" fill="#EF4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;