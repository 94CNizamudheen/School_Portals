import React from 'react';

type Student = {
  id: string | number;
  avatar: string;
  name: string;
  class: string | number;
  status: 'Active' | 'Inactive' | string;
};

interface RecentStudentsProps {
  students: Student[];
}

const RecentStudents: React.FC<RecentStudentsProps> = ({ students }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Recent Students</h3>
        <button className="text-blue-400 hover:text-blue-300 text-sm">View All</button>
      </div>
      <div className="space-y-4">
        {students.map((student) => (
          <div key={student.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-700 transition-colors">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold">{student.avatar}</span>
            </div>
            <div className="flex-1">
              <p className="font-medium">{student.name}</p>
              <p className="text-sm text-gray-400">Class {student.class}</p>
            </div>
            <div className="text-right">
              <span className={`px-2 py-1 rounded-full text-xs ${
                student.status === 'Active' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {student.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentStudents;