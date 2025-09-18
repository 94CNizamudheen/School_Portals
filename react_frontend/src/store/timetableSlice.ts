

import { createSlice } from '@reduxjs/toolkit';
import type { TimetableType } from '../types/timetable.types';
import { fetchDivisionTimetable,bulkSaveTimetable, deleteSlot  } from './timetableThunk';

interface TimetableState {
  slots: TimetableType[];
  loading: boolean;
  error: string | null;
}

const initialState: TimetableState = {
  slots: [],
  loading: false,
  error: null,
};

const timetableSlice = createSlice({
  name: 'timetable',
  initialState,
  reducers: {
    clearTimetable(state) {
      state.slots = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDivisionTimetable.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDivisionTimetable.fulfilled, (state, action) => {
      state.loading = false;
      state.slots = action.payload;
    });
    builder.addCase(fetchDivisionTimetable.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Error fetching timetable';
    });

    builder.addCase(bulkSaveTimetable.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(bulkSaveTimetable.fulfilled, (state, action) => {
      state.loading = false;
      state.slots = action.payload;
    });
    builder.addCase(bulkSaveTimetable.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Error saving timetable';
    });


    builder.addCase(deleteSlot.fulfilled, (state, action) => {
      state.slots = state.slots.filter((slot) => slot._id !== action.payload);
    });
    builder.addCase(deleteSlot.rejected, (state, action) => {
      state.error = action.payload as string|| 'Error deleting slot';
    });
  },
});

export const { clearTimetable } = timetableSlice.actions;
export default timetableSlice.reducer;
