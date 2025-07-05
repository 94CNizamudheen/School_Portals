


import React from 'react';
import { Filter } from 'lucide-react';
import StudentTableRow from './StudentTableRow';

interface Student {
  id:number;
  name: string;
  email: string;
  rollNumber: string;
  grade: string;
  class: string;
  phone: string;
  status: string;
}

interface StudentTableProps {
  students: Student[];
}

const StudentTable: React.FC<StudentTableProps> = ({ students }) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">All Students</h2>
        <button className="flex items-center space-x-2 px-3 py-2  hover:text-gray-700">
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-300">
            <tr>
              {['Student', 'Roll Number', 'Grade & Class', 'Phone', 'Status', 'Actions'].map((th) => (
                <th key={th} className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  {th}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-500 divide-y divide-gray-200">
            {students.map(student => (
              <StudentTableRow key={student.id} student={student} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;
