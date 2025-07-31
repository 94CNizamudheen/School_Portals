import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import StudentStatsCards from '../../admin/components/StudentsStateCards'
import StudentTable from '../../admin/components/StudentTable'
import type { RootState, AppDispatch } from '../../store/store'
import { fetchAllStudents } from '../../store/studentSlice';



const StudentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const dispatch = useDispatch<AppDispatch>()
  const { students, error } = useSelector((state: RootState) => state.student)
  const {token}= useSelector((state:RootState)=>state.auth);
  
  console.log("token in student page",token)
  useEffect(() => {
      dispatch(fetchAllStudents());
      
  }, [dispatch,])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const filteredStudents = students.filter((student) =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber?.includes(searchTerm)
  )
  

  return (
    <div className="p-4 text-white">
      <div className="flex justify-between items-center ">
          <input
        type="text"
        placeholder="Search by name, email or roll number"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 w-full md:w-1/3 px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      </div>

    

      <StudentStatsCards
        total={students.length}
        active={students.filter((s) => s.isActive).length}
        inactive={students.filter((s) => !s.isActive).length}
        newThisMonth={2}
      />

      <StudentTable students={filteredStudents} />
    </div>
  )
}

export default StudentsPage
