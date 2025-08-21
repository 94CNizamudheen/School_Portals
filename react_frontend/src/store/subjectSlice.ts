


import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSubjects, fetchSubjectById,  createSubject,  updateSubject,  deleteSubject,  assignTeacher,  removeTeacher,} from "./subjectThunks";
import type { Subject } from "../types/subject.types";

interface SubjectState {
  subjects: Subject[];
  selectedSubject: Subject | null;
  loading: boolean;
  error: string | null;
}

const initialState: SubjectState = {
  subjects: [],
  selectedSubject: null,
  loading: false,
  error: null,
};

const subjectSlice = createSlice({
  name: "subject",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSubjectById.fulfilled, (state, action) => {
        state.selectedSubject = action.payload;
      })
      .addCase(createSubject.fulfilled, (state, action) => {
        state.subjects.push(action.payload);
      })
      .addCase(updateSubject.fulfilled, (state, action) => {
        state.subjects = state.subjects.map((s) =>
          s._id === action.payload._id ? action.payload : s
        );
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.subjects = state.subjects.filter((s) => s._id !== action.payload.id);
      })
      .addCase(assignTeacher.fulfilled, (state, action) => {
        state.subjects = state.subjects.map((s) =>
          s._id === action.payload._id ? action.payload : s
        );
      })
      .addCase(removeTeacher.fulfilled, (state, action) => {
        state.subjects = state.subjects.map((s) =>
          s._id === action.payload._id ? action.payload : s
        );
      });
  },
});

export default subjectSlice.reducer;
