import type { AdmissionFormData } from "@/types/admission.types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchAdmissions, fetchApplicationsByEmail, handleStatusChange } from "./admissionThunks";

interface AdmissionState {
    data: AdmissionFormData[];
    applicationsByEmail: AdmissionFormData[];
    loading: boolean
    error: string | null
}

const initialState: AdmissionState = {
    data: [],
    applicationsByEmail: [],
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
                state.data = action.payload
                state.loading = false;
            })
            .addCase(fetchAdmissions.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to fetch admission';
                state.loading = false
            })
            .addCase(fetchApplicationsByEmail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchApplicationsByEmail.fulfilled, (state, action) => {
                state.loading = false;
                state.applicationsByEmail = action.payload;
            })
            .addCase(fetchApplicationsByEmail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Something went wrong";
            })
            .addCase(handleStatusChange.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(handleStatusChange.fulfilled, (state, action) => {
               state.data= state.data.map((a)=>a._id===action.payload._id ?action.payload : a);
               state.loading=false;
               state.error=null
            })
            .addCase(handleStatusChange.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error as string;
            });
    }
});

export const { updateAdmissionStatus } = admissionSlice.actions;
export default admissionSlice.reducer