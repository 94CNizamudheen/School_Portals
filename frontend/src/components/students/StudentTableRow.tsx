import React from 'react';
import { Student } from '@/types/student';

interface StudentTableRowProps {
  student: Student;
}

const StudentTableRow: React.FC<StudentTableRowProps> = ({ student }) => {
  const fullName = `${student.firstName} ${student.lastName}`;
  const status = student.isActive ? 'Active' : 'Inactive';

  const handleViewStudent = () => {
    console.log('View student:', student._id);
  };

  return (
    <tr className="hover:bg-gray-300">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-medium">{student.firstName?.charAt(0)}</span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{fullName}</div>
            <div className="text-sm text-gray-500">{student.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.rollNumber}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.grade} - {student.class}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.mobileNumber}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          student.isActive ? 'bg-green-800 text-green-100' : 'bg-red-800 text-red-100'
        }`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <button
          onClick={handleViewStudent}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View
        </button>
      </td>
    </tr>
  );
};

export default StudentTableRow;
