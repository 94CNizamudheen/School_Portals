import React, { useState } from 'react';
import StatusFilterWithSearch from '../../components/shared/filters';
import StudentTableRow from './StudentTableRow';
import type { Student } from '../../types/student';
import { Pagination } from '../../components/shared/CustomPagination';

interface StudentTableProps {
  students: Student[];
}

const StudentTable: React.FC<StudentTableProps> = ({ students }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>("all")
   const [currentPage, setCurrentPage] = useState(1);

  const filteredStudents= students.filter((student)=>{
    const matchesSearch= student.firstName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus= statusFilter==='all'||student.isActive===(statusFilter==='active');
    return matchesSearch && matchesStatus
  })

  
     const studentsperPage=8;
     const indexofLastStudent=currentPage*studentsperPage;
     const indexoffirstStudent= indexofLastStudent-studentsperPage;
     const currentStudents= filteredStudents.slice(indexoffirstStudent,indexofLastStudent);
     const totalPages= Math.ceil(students.length/studentsperPage)
  
  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
  }
  const handleSearchQuery = (value: string) => {
    setSearchTerm(value)
  }
  return (
    <div className="bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">All Students</h2>
        <StatusFilterWithSearch
          onFilterChange={handleStatusChange}
          onSearchChange={handleSearchQuery}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-300">
            <tr>
              {['Student', 'Roll Number', 'Grade', 'Phone', 'Status', 'Actions'].map((th) => (
                <th key={th} className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  {th}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-500 divide-y divide-gray-200">
            {currentStudents.map(student => (
              <StudentTableRow key={student._id} student={student} />
            ))}
          </tbody>
        </table>
      </div>
       <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default StudentTable;
