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
      console.log(" response.data in fetch all student",response.data)
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

export const resetPassword = createAsyncThunk(
  "student/resetPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await API.post("/student/reset-password", { email })
      return response.data.message
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      return rejectWithValue(err.response?.data?.message || "Failed to reset password")
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
    console.log("Student id",id)
    try {
      const response = await API.get(`/students/${id}`);
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
  async(data: { email: string; identity: string },{rejectWithValue})=>{
    try {
      console.log("hitted sendotp")
       return await API.post(`auth/send-student-otp`,data);

    } catch (error) {
       const err = error as AxiosError<{ message: string }>
       return rejectWithValue(err.response?.data.message)
    }
  }
);

// export const verifyStudentOtp= createAsyncThunk(
//   'sudent/verifyOtp',
//   async(data:{ email: string; identity: string; otp: string },{rejectWithValue})=>{
//     try {
//       return await API.post(`auth/verify-otp`,data);
//     } catch (error) {
//       const err = error as AxiosError<{ message: string }>
//        return rejectWithValue(err.response?.data.message)
//     }
//   }
// );


export const changeStudentPassword = createAsyncThunk(
  'student/changePassword',
  async(data: { email: string; identity: string; password: string },{rejectWithValue})=>{
    try {
      return await API.post(`change-student-password`,data);
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
      // .addCase(sendVerificationEmail.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(sendVerificationEmail.fulfilled, (state) => {
      //   state.loading = false;
      // })
      // .addCase(sendVerificationEmail.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload as string;
      // })

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

      // .addCase(submitAdmission.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(submitAdmission.fulfilled, (state) => {
      //   state.loading = false;
      // })
      // .addCase(submitAdmission.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload as string;
      // })
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
