import React from 'react';

interface StatCardProps{
    title:string;
    value:number|string;
    change:number,
    icon:React.ElementType;
    color?:string
}

const StatCard:React.FC<StatCardProps> = ({ title, value, change, icon: Icon, color = 'blue' }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          <p className={`text-sm mt-2 ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change >= 0 ? '+' : ''}{change}% from last month
          </p>
        </div>
        <div className={`p-3 rounded-lg bg-${color}-500/20`}>
          <Icon className={`w-6 h-6 text-${color}-400`} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;