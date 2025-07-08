import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

export interface Student {
  id: string
  email: string
  name: string
  profileImage?: string
  class: string
  rollNumber: string
  phone?: string
  address?: string
}

interface StudentState {
  student: Student | null
  loading: boolean
  error: string | null
}

const initialState: StudentState = {
  student: null,
  loading: false,
  error: null,
}

export const fetchStudentByEmail = createAsyncThunk(
  "student/fetchByEmail",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/student/by-email?email=${encodeURIComponent(email)}`)

      if (!response.ok) {
        throw new Error("Failed to fetch student")
      }

      const data = await response.json()
      return data.student
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error")
    }
  },
)

// Async thunk to reset password
export const resetPassword = createAsyncThunk("student/resetPassword", async (email: string, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/student/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      throw new Error("Failed to send reset password email")
    }

    const data = await response.json()
    return data.message
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Unknown error")
  }
})

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
      // Fetch student by email
      .addCase(fetchStudentByEmail.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStudentByEmail.fulfilled, (state, action: PayloadAction<Student>) => {
        state.loading = false
        state.student = action.payload
        state.error = null
      })
      .addCase(fetchStudentByEmail.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Reset password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, clearStudent } = studentSlice.actions
export default studentSlice.reducer
