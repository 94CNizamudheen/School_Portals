// hooks/useAdmissionData.ts
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from "../types/store.types"; 
import { updateAdmissionStatus,} from '../store/admissionSlice'
import { fetchAdmissions } from '../store/admissionThunks'

export const useAdmissionData = () => { 
  const dispatch = useDispatch<AppDispatch>()
  const { data: admissions, loading, error } = useSelector( (state: RootState) => state.admissions)

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
