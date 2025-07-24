import type { AdmissionFormData } from "@/types/admission.types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchAdmissions } from "./admissionThunks";

interface AdmissionState {
    data: AdmissionFormData[]
    loading: boolean
    error: string | null
}

const initialState: AdmissionState = {
    data: [],
    loading: false,
    error: null,
}
const admissionSlice = createSlice({
    name: 'admissions',
    initialState: initialState,
    reducers: {
        updateAdmissionStatus: (state,
            action: PayloadAction<{
                id: string
                status: 'approved' | 'rejected' | 'completed'
                notes?: string
                rejectionReason?: string
            }>) => {
            const { id, status, notes, rejectionReason } = action.payload;
            const index = state.data.findIndex((adm) => adm._id == id)

            if (index !== -1) {
                state.data[index] = {
                    ...state.data[index],
                    status,
                    verificationNotes: notes,
                    rejectionReason,
                    ...(status === 'completed' && {
                        refillRequestedAt: new Date().toISOString(),
                    }),
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdmissions.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(fetchAdmissions.fulfilled, (state, action) => {
                state.data=action.payload
                state.loading = false;
            })
            .addCase(fetchAdmissions.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to fetch admission';
                state.loading = false
            })
    }
});

export const { updateAdmissionStatus } = admissionSlice.actions;
export default admissionSlice.reducer