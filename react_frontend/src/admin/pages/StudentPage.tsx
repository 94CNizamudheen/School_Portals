import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import StudentStatsCards from '../../admin/components/StudentsStateCards'
import StudentTable from '../../admin/components/StudentTable'
import type { RootState, AppDispatch }from "../../types/store.types"; 
import { fetchAllStudents } from '../../store/studentSlice' 
import { useNotification } from '../../context/notification/useNotification'

const StudentsPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { students, error } = useSelector((state: RootState) => state.student)
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
