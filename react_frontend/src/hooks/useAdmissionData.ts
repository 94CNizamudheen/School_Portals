// hooks/useAdmissionData.ts
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../store/store'
import { updateAdmissionStatus,} from '../store/admissionSlice'
import { fetchAdmissions } from '../store/admissionThunks'

export const useAdmissionData = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { data: admissions, loading, error } = useSelector( (state: RootState) => state.admissions)

  useEffect(() => {
    dispatch(fetchAdmissions())
  }, [dispatch])

  const changeStatus = (
    id: string,
    status: 'approved' | 'rejected' | 'refill_requested',
    notes?: string,
    rejectionReason?: string
  ) => {
    dispatch(updateAdmissionStatus({ id, status, notes, rejectionReason }))
  }

  return {
    admissions,
    loading,
    error,
    updateAdmissionStatus: changeStatus,
  }
}
