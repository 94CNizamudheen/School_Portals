import type { CalenderEntries } from "@/types/academicClaender.types";
import type { SchoolEventTypes } from "../types/school.events.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../axios.config";
import type { AxiosError } from "axios";

export const fetchAllCalederEntries = createAsyncThunk(
    'academicCalender/fetchAllEntries',
    async (_,{rejectWithValue}) => {
        try {
            const res= await API.get('/calendar-entries')
            return res.data;
        } catch (error) {
            const err= error as AxiosError<{message:string}>;
            return rejectWithValue(err.response?.data.message)
        }
    }
)



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
            .addCase(fetchAllCalederEntries.pending,(state)=>{
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchAllCalederEntries.fulfilled,(state,action)=>{
                state.calenderEntries=action.payload;
                state.loading=false;
                state.error=null;
            })
            .addCase(fetchAllCalederEntries.rejected,(state,action)=>{
                state.loading=false;
                state.error= action.payload as string;
            })
    }
})
export default academicClaenderSlice.reducer;