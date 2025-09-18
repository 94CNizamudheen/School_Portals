

import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '../axios.config';
import { AxiosError } from 'axios';
import type { TimetableType } from '../types/timetable.types';

export const fetchDivisionTimetable = createAsyncThunk<TimetableType[], { divisionId: string; month: string }>(
    'timetable/fetchDivisionTimetable',
    async ({ divisionId, month }, { rejectWithValue }) => {
        try {
            const res = await API.get(`/timetable?division=${divisionId}&month=${month}`);
            return res.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            return rejectWithValue(err.response?.data.message || 'Failed to fetch timetable');
        }
    }
);

export const bulkSaveTimetable = createAsyncThunk<TimetableType[], { divisionId: string; month: string; slots: TimetableType[] }>(
    'timetable/bulkSave',
    async ({ divisionId, month, slots }, { rejectWithValue }) => {
        try {
            const res = await API.post(`/timetable/bulk/${divisionId}/${month}`, slots);
            return res.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            return rejectWithValue(err.response?.data.message || 'Failed to save timetable');
        }
    }
);

export const deleteSlot = createAsyncThunk<string, string>(
    'timetable/deleteSlot',
    async (slotId, { rejectWithValue }) => {
        try {
            await API.delete(`/timetable/${slotId}`);
            return slotId;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            return rejectWithValue(err.response?.data.message || 'Failed to delete slot');
        }
    }
);
