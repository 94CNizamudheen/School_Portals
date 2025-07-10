import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

import axios, { AxiosError } from "axios"
import type { Student } from "../types/student"

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

export const fetchAllStudents = createAsyncThunk(
  "student/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/student/all") // Change to your actual API endpoint
      return response.data.students
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      return rejectWithValue(err.response?.data?.message || "Failed to fetch students")
    }
  }
)

export const fetchStudentByEmail = createAsyncThunk(
  "student/fetchByEmail",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/student/by-email?email=${encodeURIComponent(email)}`)
      return response.data.student
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      return rejectWithValue(err.response?.data?.message || "Failed to fetch student")
    }
  }
)

export const resetPassword = createAsyncThunk(
  "student/resetPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/student/reset-password", { email })
      return response.data.message
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      return rejectWithValue(err.response?.data?.message || "Failed to reset password")
    }
  }
)

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

      .addCase(resetPassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, clearStudent } = studentSlice.actions
export default studentSlice.reducer
