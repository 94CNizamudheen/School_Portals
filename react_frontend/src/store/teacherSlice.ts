import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import API from "../axios.config";
import type { Teacher } from "../types/teacher.types";


export const fetchTeachers = createAsyncThunk(
    'teacher/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const res = await API.get(`/teachers`,)
            console.log("response of teacher fetcAll", res.data)
            return res.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>
            return rejectWithValue(err.response?.data?.message || 'Fetch failed');
        }
    }
);
export const verifyTeacher = createAsyncThunk(
    'teacher/verifyTeacher',
    async (teacherId: string, { rejectWithValue }) => {
        try {
            const response = await API.patch(`/teachers/verify-and-create/${teacherId}`);
            return response.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            return rejectWithValue(err.response?.data.message || 'Failed to veify teacher')
        }

    }
);
export const rejectApplication = createAsyncThunk(
    'teacher/rejectApplication',
    async (teacherId: string, { rejectWithValue }) => {
        try {
            const response = await API.patch(`/teachers/reject-application/${teacherId}`);
            console.log("response data from reject application", response.data)
            return response.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            return rejectWithValue(err.response?.data.message)
        }
    }
)

export const sendteacherApplication = createAsyncThunk(
    'teacher/sendApplication',
    async (formData: FormData, { rejectWithValue, }) => {
        try {
            const response = await API.post(`/teachers/apply`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            return response.data
        } catch (error) {
            const err = error as AxiosError<{ message: string }>
            toast.error(err.response?.data.message || "Failed to add teacher")
            return rejectWithValue(err.response?.data.message || "Failed to add teacher")
        }
    }
)
export const deleteTeacher = createAsyncThunk(
    'teacher/deleteTeacher',
    async (id: string, { rejectWithValue }) => {
        try {
            await API.delete(`/teachers/${id}`);
        } catch (error) {
            const err = error as AxiosError<{ message: string }>
            return rejectWithValue(err.response?.data.message)
        }

    }
);

export const findTeacherByEmail = createAsyncThunk(
    'teacher/findTeacherByEmail',
    async (email: string, { rejectWithValue }) => {
        try {
            const response = await API.get(`/teachers/find-by-email/${email}`)
            console.log("response fetch teacher by  email", response.data)
            return response.data
        } catch (error) {
            const err = error as AxiosError<{ message: string }>
            return rejectWithValue(err.response?.data.message)
        }

    }
);
export const updateTeacher = createAsyncThunk(
    'teacher/updateTeacher',
    async ({ id, updates }: { id: string; updates: Partial<Record<keyof Teacher, unknown>> }, { rejectWithValue }) => {
        const formData = new FormData()
        Object.entries(updates).forEach(([key, val]) => {
            if (val !== undefined && val !== null) {
                if (val instanceof Blob) {
                    formData.append(key, val)
                } else {
                    formData.append(key, String(val))
                }
            }
        });
        try {
            const response = await API.patch(`/teachers/${id}`, formData)
            return response.data
        } catch (error) {
            const err = error as AxiosError<{ message: string }>
            return rejectWithValue(err.response?.data.message)
        }
    }
)

interface TeacherState {
  approved: Teacher[];
  applied: Teacher[];
  teacher: Teacher | null
  loading: boolean;
  error: string | null;
}

const initialState: TeacherState = {
  approved: [],
  applied: [],
  teacher: null,
  loading: false,
  error: null,
};

const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeachers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        const allTeachers = action.payload as Teacher[];
        state.approved = allTeachers.filter(t => t.status === 'approved');
        state.applied = allTeachers.filter(t => t.status !== 'approved');
        state.loading = false;
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyTeacher.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.applied.findIndex(t => t._id === updated._id);
        if (index !== -1) {
          state.applied[index] = updated
        }
        state.loading = false;
      })
      .addCase(verifyTeacher.rejected, (state, action) => {
        state.error = action.payload as string
        state.loading = false
      })
      .addCase(rejectApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectApplication.fulfilled, (state, action) => {
        const updated = action.payload
        const index = state.applied.findIndex(t => t._id === updated._id);
        if (index !== -1) {
          state.applied[index] = updated;
        }
        state.loading = false;
      })
      .addCase(rejectApplication.rejected, (state, action) => {
        state.error = action.payload as string
        state.loading = false
      })
      .addCase(findTeacherByEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findTeacherByEmail.fulfilled, (state, action) => {
        state.teacher = action.payload
        state.loading = false;
      })
      .addCase(findTeacherByEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeacher.fulfilled, (state, action) => {
        state.teacher = action.payload
        state.loading = false;
      })
      .addCase(updateTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })


  },
});

export default teacherSlice.reducer;
