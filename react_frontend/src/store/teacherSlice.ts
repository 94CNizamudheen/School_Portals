import { createSlice } from '@reduxjs/toolkit';

import * as teacherThunks from './teacherThunks';

interface Teacher {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  dob: string;
  qualification: string;
  university: string;
  experience: string;
  KTET_CTET_certificateNo: string;
  subject: string;
  teachingLevel: string;
  profileImage: string;
  eligibilityDocuments: string[];
  status: 'pending' | 'approved' | 'rejected';
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}

interface TeacherState {
  approved: Teacher[];
  applied: Teacher[];
  teacher:Teacher|null
  loading: boolean;
  error: string | null;
}

const initialState: TeacherState = {
  approved: [],
  applied: [],
  teacher:null,
  loading: false,
  error: null,
};

const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(teacherThunks.fetchTeachers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(teacherThunks.fetchTeachers.fulfilled, (state, action) => {
        const allTeachers = action.payload as Teacher[];
        state.approved = allTeachers.filter(t => t.status === 'approved');
        state.applied = allTeachers.filter(t => t.status !== 'approved');
        state.loading = false;
      })
      .addCase(teacherThunks.fetchTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(teacherThunks.verifyTeacher.pending,(state)=>{
        state.loading= true;
        state.error= null;
      })
      .addCase(teacherThunks.verifyTeacher.fulfilled,(state,action)=>{
        const updated= action.payload;
        const index= state.applied.findIndex(t=>t._id===updated._id);
        if(index!==-1){
          state.applied[index]=updated
        }
        state.loading=false;
      })
      .addCase(teacherThunks.verifyTeacher.rejected,(state,action)=>{
        state.error=action.payload as string
        state.loading= false
      })
      .addCase(teacherThunks.rejectApplication.pending,(state)=>{
        state.loading=true;
        state.error=null;
      })
      .addCase(teacherThunks.rejectApplication.fulfilled,(state,action)=>{
        const updated= action.payload
        const index= state.applied.findIndex(t=>t._id===updated._id);
        if(index!==-1){
          state.applied[index]=updated;
        }
        state.loading=false;
      })
      .addCase(teacherThunks.rejectApplication.rejected,(state,action)=>{
        state.error=action.payload as string
        state.loading= false
      })
      .addCase(teacherThunks.findTeacherByEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(teacherThunks.findTeacherByEmail.fulfilled, (state, action) => {
        state.teacher= action.payload
        state.loading = false;
      })
      .addCase(teacherThunks.findTeacherByEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(teacherThunks.updateTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(teacherThunks.updateTeacher.fulfilled, (state, action) => {
        state.teacher= action.payload
        state.loading = false;
      })
      .addCase(teacherThunks.updateTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      
  },
});

export default teacherSlice.reducer;
