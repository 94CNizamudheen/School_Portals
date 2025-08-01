import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import StudentStatsCards from '../../admin/components/StudentsStateCards'
import StudentTable from '../../admin/components/StudentTable'
import type { RootState, AppDispatch } from '../../store/store'
import { fetchAllStudents } from '../../store/studentSlice';



const StudentsPage = () => {
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
