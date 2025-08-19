import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Student } from "../types/student"
import { changeStudentPassword, fetchAllStudents, fetchStudentByEmail, fetchStudentById, requestStudentOtp, updateStudent, verifyStudentOtp } from "./studentThunks"

interface StudentState {
  student: Student | null
  students: Student[]
  loading: boolean
  error: string | null
}
const initialState: StudentState = {
  student: null,
  students: [],
  loading: false,
  error: null,
}


const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearStudent: (state) => {
      state.student = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllStudents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllStudents.fulfilled, (state, action: PayloadAction<Student[]>) => {
        state.loading = false
        state.students = action.payload
      })
      .addCase(fetchAllStudents.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(fetchStudentByEmail.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStudentByEmail.fulfilled, (state, action: PayloadAction<Student>) => {
        state.loading = false
        state.student = action.payload
      })
      .addCase(fetchStudentByEmail.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(requestStudentOtp.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(requestStudentOtp.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(requestStudentOtp.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(changeStudentPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(changeStudentPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changeStudentPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(verifyStudentOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyStudentOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyStudentOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchStudentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentById.fulfilled, (state, action: PayloadAction<Student>) => {
        state.loading = false;
        state.student = action.payload;
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action: PayloadAction<Student>) => {
        state.loading = false;
        state.student = action.payload;
        state.error=null
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })


  },
})

export const { clearError, clearStudent } = studentSlice.actions
export default studentSlice.reducer
