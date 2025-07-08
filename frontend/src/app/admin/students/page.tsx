/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useEffect, useState } from 'react';
import StudentStatsCards from '@/components/students/StudentsStateCards';
import StudentTable from '@/components/students/StudentTable';
import Link from 'next/link';
import { findAllStudent } from '@/service/api';
import { toast } from 'react-toastify';
import { Student } from '@/types/student';
const StudentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [studentList, setStudentList] = useState<Student[]>([]);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const students = await findAllStudent();
        setStudentList(students);
      } catch (error) {
        toast.error("Failed to load student");
      }
    };
    fetchStudent();
  }, []);

  const filteredStudents = studentList.filter((student) =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber?.includes(searchTerm)
  );

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Students Management</h1>
        <Link href='/admin/students/add'>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Student
          </button>
        </Link>
      </div>

      <StudentStatsCards
        total={studentList.length}
        active={studentList.filter(s => s.isActive).length}
        inactive={studentList.filter(s => !s.isActive).length}
        newThisMonth={2}
      />

      <StudentTable students={filteredStudents} />
    </>
  );
};

export default StudentsPage;
