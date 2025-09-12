import type { CalenderEntries } from "../types/academicClaender.types";
import type { SchoolEventTypes } from "../types/academicClaender.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../axios.config";
import type { AxiosError } from "axios";
import type { CalendarEntryForm } from "../types/academicClaender.types";


export const fetchAllCaledarEntries = createAsyncThunk(
    'academicCalendar/fetchAllEntries',
    async (_, { rejectWithValue }) => {
        try {
            const res = await API.get('/calendar-entries')
            return res.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            return rejectWithValue(err.response?.data.message)
        }
    }
);
export const fetchCaledarEntryById = createAsyncThunk(
    'academicCalendar/fetchCalederEntryById',
    async (id: string, { rejectWithValue }) => {
        try {
            const res = await API.get(`/calendar-entries/${id}`);
            return res.data
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            return rejectWithValue(err.response?.data.message)
        }
    }
);
export const fetchAllEvents = createAsyncThunk(
    'events/fetchAllEvents',
    async (_, { rejectWithValue }) => {
        try {
            const res = await API.get('/events')
            return res.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            return rejectWithValue(err.response?.data.message)
        }
    }
);
export const fetchEventById = createAsyncThunk(
    'events/fetchEventById',
    async (id: string, { rejectWithValue }) => {
        try {
            const res = await API.get(`/events/${id}`);
            return res.data
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            return rejectWithValue(err.response?.data.message)
        }
    }
);
export const updateCalendarEntry = createAsyncThunk(
    'academicCalendar/update',
    async ({ id, data }: { id: string, data: CalendarEntryForm }, { rejectWithValue }) => {
        try {
            console.log('data in update entries',data)
            const res = await API.patch(`/calendar-entries/${id}`,  data )
            return res.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            return rejectWithValue(err.response?.data.message)
        }
    }
);
export const updateEvent = createAsyncThunk(
    'events/update',
    async ({ id, data }: { id: string, data: FormData }, { rejectWithValue }) => {
        try {
            console.log("datas to update", data)
            const res = await API.patch(`/events/${id}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            return res.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            return rejectWithValue(err.response?.data.message)
        }
    }
);

export const removeCalendarEntry = createAsyncThunk(
    'academicCalendar/remove',
    async (id: string, { rejectWithValue }) => {
        try {
            const res = await API.delete(`/calendar-entries/${id}`);
            return res.data
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            return rejectWithValue(err.response?.data.message)
        }

    }
);
export const removeEvent = createAsyncThunk(
    'events/remove',
    async (id: string, { rejectWithValue }) => {
        console.log('remove invoked')
        try {
            const res = await API.delete(`/events/${id}`);
            return res.data
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            return rejectWithValue(err.response?.data.message)
        }

    }
);
export const createEvent = createAsyncThunk(
    'events/create',
    async (data: FormData, { rejectWithValue }) => {
        try {
            const res = await API.post(`/events`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            return res.data;    
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            return rejectWithValue(err.response?.data.message)
        }
    }
);
export const createCalenderEntry = createAsyncThunk(
    'academicCalendar/create',
    async ({ data }: { data: CalendarEntryForm }, { rejectWithValue }) => {
        try {

            const res = await API.post(`/calendar-entries/`, data)
            return res.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            return rejectWithValue(err.response?.data.message)
        }
    }
);




interface AcademicCalenderState {
    events: SchoolEventTypes[];
    calenderEntries: CalenderEntries[];
    selectedEntry: CalenderEntries | null;
    selectedEvent: SchoolEventTypes | null;
    loading: boolean;
    error: string | null;
}
const initialState: AcademicCalenderState = {
    events: [],
    calenderEntries: [],
    selectedEntry: null,
    selectedEvent: null,
    loading: false,
    error: null
};

const academicClaenderSlice = createSlice({
    name: 'academicCalender',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllCaledarEntries.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllCaledarEntries.fulfilled, (state, action) => {
                state.calenderEntries = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchAllCaledarEntries.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchAllEvents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllEvents.fulfilled, (state, action) => {
                state.events = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchAllEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchEventById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEventById.fulfilled, (state, action) => {
                state.selectedEvent = action.payload
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchEventById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchCaledarEntryById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCaledarEntryById.fulfilled, (state, action) => {
                state.selectedEntry = action.payload
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchCaledarEntryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEvent.fulfilled, (state, action) => {
                state.events = state.events.map((event) => event._id === action.payload._id ? action.payload : event);
                state.loading = false;
                state.error = null;
            })
            .addCase(updateEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateCalendarEntry.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCalendarEntry.fulfilled, (state, action) => {
                state.calenderEntries = state.calenderEntries.map((entry) => entry._id === action.payload._id ? action.payload : entry);
                state.loading = false;
                state.error = null;
            })
            .addCase(updateCalendarEntry.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(removeCalendarEntry.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeCalendarEntry.fulfilled, (state, action) => {
                state.calenderEntries = state.calenderEntries.filter((entry) => entry._id !== action.payload._id);
                state.error = null;
                state.loading = false;
            })
            .addCase(removeCalendarEntry.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(removeEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeEvent.fulfilled, (state, action) => {
                state.events = state.events.filter((event) => event._id !== action.payload._id);
                state.error = null;
                state.loading = false;
            })
            .addCase(removeEvent.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(createCalenderEntry.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCalenderEntry.fulfilled, (state, action) => {
                state.calenderEntries.push(action.payload)
                state.error = null;
                state.loading = false;
            })
            .addCase(createCalenderEntry.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(createEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createEvent.fulfilled, (state, action) => {
                state.events.push(action.payload)
                state.error = null;
                state.loading = false;
            })
            .addCase(createEvent.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })

    }
})
export default academicClaenderSlice.reducer;