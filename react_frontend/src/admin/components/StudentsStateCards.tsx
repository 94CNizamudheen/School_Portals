

'use client';
import { Search } from 'lucide-react';
import React from 'react';

interface StudentStatsCardsProps {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
}

const StudentStatsCards: React.FC<StudentStatsCardsProps> = ({ total, active, inactive, newThisMonth }) => {
  const cards = [
    { label: 'Total Students', value: total, color: 'blue' },
    { label: 'Active Students', value: active, color: 'green' },
    { label: 'Inactive Students', value: inactive, color: 'yellow' },
    { label: 'New This Month', value: newThisMonth, color: 'purple' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className={`p-2 bg-${card.color}-100 rounded-lg`}>
              <Search className={`w-6 h-6 text-${card.color}-600`} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentStatsCards;
