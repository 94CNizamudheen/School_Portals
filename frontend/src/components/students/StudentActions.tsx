

import React from 'react';
import { Edit, Eye, Trash2 } from 'lucide-react';

const StudentActions = () => {
  return (
    <div className="flex items-center space-x-2 ">
      <button className="p-1 text-blue-900 hover:text-blue-800 cursor-pointer">
        <Eye className="w-4 h-4" />
      </button>
      <button className="p-1 text-green-800 hover:text-green-800 cursor-pointer">
        <Edit className="w-4 h-4" />
      </button>
      <button className="p-1 text-red-600 hover:text-red-800 cursor-pointer">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default StudentActions;
