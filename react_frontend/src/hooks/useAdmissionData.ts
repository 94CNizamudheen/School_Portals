
import { useEffect } from 'react'

import { updateAdmissionStatus,} from '../store/admissionSlice'
import { fetchAdmissions } from '../store/admissionThunks'
import { useAppDispatch, useAppSelector } from './app.hooks'

export const useAdmissionData = () => { 
  const dispatch = useAppDispatch()
  const { data: admissions, loading, error } = useAppSelector( (state) => state.admissions)

  useEffect(() => {
    dispatch(fetchAdmissions())
  }, [dispatch])

  const changeStatus = async (id: string, status: 'approved' | 'rejected' | 'completed', notes?: string, rejectionReason?: string) => {
   await dispatch(updateAdmissionStatus({ id, status, notes, rejectionReason }))
  };

  return {
    admissions,
    loading,
    error,
    updateAdmissionStatus: changeStatus,
  }
}
