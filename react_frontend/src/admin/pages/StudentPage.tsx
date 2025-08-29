import { useEffect } from 'react'
import StudentStatsCards from '../../admin/components/StudentsStateCards'
import StudentTable from '../../admin/components/StudentTable'
import { fetchAllStudents } from '../../store/studentSlice' 
import { useNotification } from '../../context/notification/useNotification'
import { useAppDispatch, useAppSelector } from '../../hooks/app.hooks'

const StudentsPage = () => {
  const dispatch = useAppDispatch()
  const { students, error } = useAppSelector((state) => state.student)
  const { showNotification } = useNotification()

  useEffect(() => {
    dispatch(fetchAllStudents());
  }, [dispatch,])

  useEffect(() => {
    if (error)
      showNotification('error', {
        title:"Failed to Load students",
        message:error
        
  })
  }, [error,showNotification])

  return (
    <div className="p-4 text-white">
      <StudentStatsCards
        total={students.length}
        active={students.filter((s) => s.isActive).length}
        inactive={students.filter((s) => !s.isActive).length}
        newThisMonth={2}
      />

      <StudentTable students={students} />

    </div>
  )
}

export default StudentsPage
