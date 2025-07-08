

import React from 'react';

interface Student {
  id: string | number;
  name: string;
  class: string | number;
  amount: string | number;
  days: number;
}

interface UnpaidStudentsProps {
  students: Student[];
}

const UnpaidStudents: React.FC<UnpaidStudentsProps> = ({ students }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Unpaid Students</h3>
        <button className="text-red-400 hover:text-red-300 text-sm">Send Reminders</button>
      </div>
      <div className="space-y-4">
        {students.map((student) => (
          <div key={student.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700 transition-colors">
            <div>
              <p className="font-medium">{student.name}</p>
              <p className="text-sm text-gray-400">Class {student.class}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-red-400">{student.amount}</p>
              <p className="text-xs text-gray-400">{student.days} days overdue</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnpaidStudents;