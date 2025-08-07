import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import API from "../axios.config";
import { AxiosError } from "axios"
import type { Student, } from "../types/student"


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
  async (_, { rejectWithValue, }) => {
    try {
      const response = await API.get(`/students`)
      console.log(" response.data in fetch all student", response.data)
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
      const response = await API.get(`/student/by-email?email=${encodeURIComponent(email)}`)
      return response.data.student
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      return rejectWithValue(err.response?.data?.message || "Failed to fetch student")
    }
  }
)

export const verifyOtp = createAsyncThunk(
  "student/verifyOtp",
  async ({ email, code }: { email: string; code: string }, { rejectWithValue }) => {


    try {
      const response = await API.post(`/auth/verify-otp`, { email, code })
      return response.data
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      return rejectWithValue(err.response?.data?.message || "OTP verification failed")
    }
  }
);
export const fetchStudentById = createAsyncThunk(
  "student/fetchById",
  async (id: string, { rejectWithValue }) => {
    console.log("Student id", id)
    try {
      const response = await API.get(`/students/${id}`);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to fetch student");
    }
  }
);


export const updateStudent = createAsyncThunk(
  "student/update",
  async ({ id, updates }: { id: string; updates: Partial<Student> }, { rejectWithValue }) => {
    try {
      const response = await API.patch(`/students/${id}`, updates);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to update student");
    }
  }
);

export const requestStudentOtp = createAsyncThunk(
  'student/sendOtp',
  async (data: { email: string; identity: string }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/auth/generate-student-otp`, data);
      return response.data;

    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      return rejectWithValue(err.response?.data.message)
    }
  }
);



export const changeStudentPassword = createAsyncThunk(
  'student/changePassword',
  async (data: { identity: string; password: string }, { rejectWithValue }) => {
    try {
      console.log("hitted change password")
      return await API.post(`/auth/reset-password`, data);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      return rejectWithValue(err.response?.data.message)
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
