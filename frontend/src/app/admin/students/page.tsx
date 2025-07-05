/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState } from 'react';
import StudentStatsCards from '@/components/students/StudentsStateCards';
import StudentTable from '@/components/students/StudentTable';
import Link from 'next/link';
const StudentsPage: React.FC = () => {
const [searchTerm, setSearchTerm] = useState('');

  // Sample student data
  const students = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@email.com',
      grade: '10th Grade',
      class: 'A',
      rollNumber: '001',
      phone: '+1 234 567 8900',
      status: 'Active',
      admissionDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      grade: '9th Grade',
      class: 'B',
      rollNumber: '002',
      phone: '+1 234 567 8901',
      status: 'Active',
      admissionDate: '2024-01-20'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      grade: '11th Grade',
      class: 'A',
      rollNumber: '003',
      phone: '+1 234 567 8902',
      status: 'Inactive',
      admissionDate: '2023-12-10'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      grade: '10th Grade',
      class: 'B',
      rollNumber: '004',
      phone: '+1 234 567 8903',
      status: 'Active',
      admissionDate: '2024-02-01'
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@email.com',
      grade: '12th Grade',
      class: 'A',
      rollNumber: '005',
      phone: '+1 234 567 8904',
      status: 'Active',
      admissionDate: '2023-11-15'
    }
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.includes(searchTerm)
  );



  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Students Management</h1>
        <Link href='/admin/students/add' >
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Student
        </button>
        </Link>
        
      </div>
      
      <StudentStatsCards
        total={students.length}
        active={students.filter(s => s.status === 'Active').length}
        inactive={students.filter(s => s.status === 'Inactive').length}
        newThisMonth={2}
      />
      <StudentTable students={filteredStudents} />
    </>
  );
};

export default StudentsPage;