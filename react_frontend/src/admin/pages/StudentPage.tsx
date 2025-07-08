
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import StudentStatsCards from '@/admin/components/StudentsStateCards'
import StudentTable from '@/admin/components/StudentTable'
import { findAllStudent } from '@/service/api'
import type { Student } from '@/types/student'

const StudentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [studentList, setStudentList] = useState<Student[]>([])

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const students = await findAllStudent()
        setStudentList(students)
      } catch (error ) {
        console.error(error)
        toast.error('Failed to load students')
      }
    }

    fetchStudent()
  }, [])

  const filteredStudents = studentList.filter((student) =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber?.includes(searchTerm)
  )

  return (
    <div className="p-4 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Students Management</h1>
        <Link to="/admin/students/add">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Student
          </button>
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search by name, email or roll number"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 w-full md:w-1/3 px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <StudentStatsCards
        total={studentList.length}
        active={studentList.filter((s) => s.isActive).length}
        inactive={studentList.filter((s) => !s.isActive).length}
        newThisMonth={2}
      />

      <StudentTable students={filteredStudents} />
    </div>
  )
}

export default StudentsPage
