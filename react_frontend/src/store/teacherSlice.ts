
// src/store/teacherSlice.ts
import { createSlice, } from '@reduxjs/toolkit';
import { fetchTeachers } from './teacherThunks';

export interface Teacher {
    _id: string;
    name: string;
    subject: string;
    phone: string;
    email: string;
}

interface TeacherState {
    teachers: Teacher[];
    loading: boolean;
    error: string | null;
}

const initialState: TeacherState = {
    teachers: [],
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
                state.teachers = action.payload;
                state.loading = false;
            })
            .addCase(fetchTeachers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default teacherSlice.reducer;
