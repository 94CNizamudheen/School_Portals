

import React from 'react';
import StudentActions from './StudentActions';
interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  grade: string;
  class: string;
  phone: string;
  status: string;
}

interface StudentTableRowProps {
  student: Student;
}
const StudentTableRow: React.FC<StudentTableRowProps> = ({ student }) => {
  return (
    <tr key={student.id} className="hover:bg-gray-300">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-medium">{student.name.charAt(0)}</span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{student.name}</div>
            <div className="text-sm text-gray-500">{student.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.rollNumber}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.grade} - {student.class}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.phone}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          student.status === 'Active' ? 'bg-green-800 text-green-100' : 'bg-red-800 text-red-100'
        }`}>
          {student.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <StudentActions />
      </td>
    </tr>
  );
};

export default StudentTableRow;
