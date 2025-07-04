'use client'

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import StudentStatsCards from '@/components/students/StudentsStateCards';
import StudentTable from '@/components/students/StudentTable';

const StudentsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <div className="flex h-screen bg-gray-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 lg:ml-64 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} notificationCount={3} header='Students' />
        <div className="p-4 sm:p-6 lg:p-8">
          <StudentStatsCards
            total={students.length}
            active={students.filter(s => s.status === 'Active').length}
            inactive={students.filter(s => s.status === 'Inactive').length}
            newThisMonth={2}
          />
          <StudentTable students={filteredStudents} />
        </div>
      </div>
    </div>
  );
};

export default StudentsPage;