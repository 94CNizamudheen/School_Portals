import { createSlice } from '@reduxjs/toolkit';
import { fetchTeachers, findTeacherByEmail, rejectApplication, updateTeacher, verifyTeacher } from './teacherThunks';
import type { Teacher } from '../types/teacher.types';

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
