
import { createSlice,  } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ClassDivision } from "@/types/division.types"; 
import * as divisionThunks from './divisionThunks'

interface DivisionState {
  divisions: ClassDivision[];
  loading: boolean;
  error: string | null;
}

const initialState: DivisionState = {
  divisions: [],
  loading: false,
  error: null,
};

const divisionSlice = createSlice({
  name: "division",
  initialState,
  reducers: {
    clearDivisionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(divisionThunks.fetchAllDivisions.pending, (state) => {
        state.loading = true;
      })
      .addCase(divisionThunks.fetchAllDivisions.fulfilled, (state, action: PayloadAction<ClassDivision[]>) => {
        state.loading = false;
        state.divisions = action.payload;
      })
      .addCase(divisionThunks.fetchAllDivisions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(divisionThunks.createDivision.fulfilled, (state, action: PayloadAction<ClassDivision>) => {
        state.loading = false;
        state.divisions.push(action.payload);
      })
      .addCase(divisionThunks.createDivision.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(divisionThunks.deleteDivisionById.fulfilled, (state, action: PayloadAction<string>) => {
        state.divisions = state.divisions.filter(d => d._id !== action.payload);
      })
      .addCase(divisionThunks.assignClassTeacher.fulfilled, (state, action: PayloadAction<ClassDivision>) => {
        const idx = state.divisions.findIndex(d => d._id === action.payload._id);
        if (idx >= 0) state.divisions[idx] = action.payload;
      })

      .addCase(divisionThunks.addStudentToDivision.fulfilled, (state, action: PayloadAction<ClassDivision>) => {
        const idx = state.divisions.findIndex(d => d._id === action.payload._id);
        if (idx >= 0) state.divisions[idx] = action.payload;
      })
      .addCase(divisionThunks.removeStudentFromDivision.fulfilled, (state, action: PayloadAction<ClassDivision>) => {
        const idx = state.divisions.findIndex(d => d._id === action.payload._id);
        if (idx >= 0) state.divisions[idx] = action.payload;
      });
  },
});

export const { clearDivisionError } = divisionSlice.actions;
export default divisionSlice.reducer;
