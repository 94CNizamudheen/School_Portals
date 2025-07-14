import React from 'react';
import { Pencil } from 'lucide-react';
interface InfoCardProps {
  title: string;
  data: { label: string; value?: string | null }[];
  onEdit?: () => void;
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, data, onEdit }) => {
  return (
    <div className="bg-gray-400 shadow rounded-lg p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
          >
            <Pencil className="w-4 h-4 mr-1" />
            Edit
          </button>
        )}
      </div>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index}>
            <p className="text-sm text-gray-600">{item.label}</p>
            <p className="text-sm font-medium text-gray-900">{item.value || 'Not specified'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
