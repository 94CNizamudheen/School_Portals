
import { createSlice, } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Division } from "../types/division.type";
import * as divisionThunks from './divisionThunks'

interface DivisionState {
  divisions: Division[];
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
      .addCase(divisionThunks.fetchAllDivisions.fulfilled, (state, action: PayloadAction<Division[]>) => {
        state.loading = false;
        state.divisions = action.payload;
      })
      .addCase(divisionThunks.fetchAllDivisions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(divisionThunks.createDivision.pending, (state) => {
        state.loading = true;
      })
      .addCase(divisionThunks.createDivision.fulfilled, (state, action: PayloadAction<Division>) => {
        state.loading = false;
        state.divisions.push(action.payload);
      })
      .addCase(divisionThunks.createDivision.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
       .addCase(divisionThunks.deleteDivisionById.pending, (state) => {
        state.loading = true;
        state.error=null
      })
      .addCase(divisionThunks.deleteDivisionById.fulfilled, (state, action: PayloadAction<string>) => {
        state.divisions = state.divisions.filter(d => d._id !== action.payload);
        state.loading = false;
        state.error=null
      })
      .addCase(divisionThunks.deleteDivisionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string
      })
      .addCase(divisionThunks.updateDivision.pending, (state) => {
        state.loading = true;
        state.error=null
      })
      .addCase(divisionThunks.updateDivision.fulfilled, (state, action: PayloadAction<Division>) => {
        const idx = state.divisions.findIndex(d => d._id === action.payload._id);
        if (idx >= 0) state.divisions[idx] = action.payload;
        state.loading=false
        state.error=null
      })
      .addCase(divisionThunks.updateDivision.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string
      })

      .addCase(divisionThunks.addStudentToDivision.pending, (state) => {
        state.loading = true;
        state.error = null
      })
      .addCase(divisionThunks.addStudentToDivision.fulfilled, (state, action: PayloadAction<Division>) => {
        const idx = state.divisions.findIndex(d => d._id === action.payload._id);
        if (idx >= 0) state.divisions[idx] = action.payload;
        state.loading = false
      })
      .addCase(divisionThunks.addStudentToDivision.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string
      })
      .addCase(divisionThunks.removeStudentFromDivision.fulfilled, (state, action: PayloadAction<Division>) => {
        const idx = state.divisions.findIndex(d => d._id === action.payload._id);
        if (idx >= 0) state.divisions[idx] = action.payload;
      });
  },
});

export const { clearDivisionError } = divisionSlice.actions;
export default divisionSlice.reducer;
