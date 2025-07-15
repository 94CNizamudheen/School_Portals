import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { isTokenExpired } from "../utils/token"
import { logout } from "./authSlice"

import axios, { AxiosError } from "axios"
import type { Student, StudentFormData } from "../types/student"
import type { RootState } from "./store"
import { createAdmissionData } from "../utils/formUtils"
const API = import.meta.env.VITE_BACKEND_URL

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
  async (_, { rejectWithValue, getState, dispatch }) => {
    const state = getState() as RootState
    const token = state.auth.token

    if (!token || isTokenExpired(token)) {
      dispatch(logout())
      return rejectWithValue("Session expired. Please login again.")
    }

    try {
      const response = await axios.get(`${API}/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
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

export const sendVerificationEmail = createAsyncThunk(
  "student/sendVerificationEmail",
  async (formData: StudentFormData, { rejectWithValue, getState, dispatch }) => {
    const state = getState() as RootState
    const token = state.auth.token

    if (!token || isTokenExpired(token)) {
      dispatch(logout())
      return rejectWithValue("Session expired. Please login again.")
    }

    try {
      const admissionData = createAdmissionData(formData)
      const response = await axios.post(`${API}/students/send-verification-email`, admissionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      return rejectWithValue(err.response?.data?.message || "Failed to send verification email")
    }
  }
)


export const verifyOtp = createAsyncThunk(
  "student/verifyOtp",
  async ({ email, code }: { email: string; code: string }, { rejectWithValue, getState, dispatch }) => {
    const state = getState() as RootState
    const token = state.auth.token

    if (!token || isTokenExpired(token)) {
      dispatch(logout())
      return rejectWithValue("Session expired. Please login again.")
    }
    try {
      const response = await axios.post(`${API}/auth/verify-otp`, { email, code }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      return rejectWithValue(err.response?.data?.message || "OTP verification failed")
    }
  }
);
export const fetchStudentById = createAsyncThunk(
  "student/fetchById",
  async (id: string, { rejectWithValue, getState, dispatch }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    if (!token || isTokenExpired(token)) {
      dispatch(logout());
    }

    try {
      const response = await axios.get(`${API}/students/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to fetch student");
    }
  }
);

// Update student
export const updateStudent = createAsyncThunk(
  "student/update",
  async ({ id, updates }: { id: string; updates: Partial<Student> }, { rejectWithValue, getState, dispatch }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    if (!token || isTokenExpired(token)) {
      dispatch(logout());
    }

    try {
      const response = await axios.patch(`${API}/students/${id}`, updates, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to update student");
    }
  }
);

export const submitAdmission = createAsyncThunk(
  "student/submitAdmission",
  async (
    { formData, verificationOtp }: { formData: StudentFormData; verificationOtp: string | null },
    { rejectWithValue, getState, dispatch }
  ) => {
    const state = getState() as RootState
    const token = state.auth.token

    if (!token || isTokenExpired(token)) {
      dispatch(logout())
      return rejectWithValue("Session expired. Please login again.")
    }

    try {
      const admissionData = createAdmissionData(formData)
      const formDataToSend = new FormData()
      formDataToSend.append("student", JSON.stringify(admissionData.student))
      formDataToSend.append("parent", JSON.stringify(admissionData.parent))
      if (formData.profileImage) {
        formDataToSend.append("profileImage", formData.profileImage)
      }
      formDataToSend.append("verificationOtp", verificationOtp || "")

      const response = await axios.post(`${API}/students/admission`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      return response.data
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      return rejectWithValue(err.response?.data?.message || "Failed to submit admission")
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
      .addCase(sendVerificationEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendVerificationEmail.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendVerificationEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(submitAdmission.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitAdmission.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(submitAdmission.rejected, (state, action) => {
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
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      

  },
})

export const { clearError, clearStudent } = studentSlice.actions
export default studentSlice.reducer
