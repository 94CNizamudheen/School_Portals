import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import axios, { AxiosError } from "axios";
import { isTokenExpired } from "../utils/token";
import { logout } from "./authSlice";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_BACKEND_URL;


export const fetchTeachers = createAsyncThunk(
    'teacher/fetchAll',
    async (_, { rejectWithValue, getState, dispatch }) => {
        const state = getState() as RootState;
        const token = state.auth.token;
        if (!token || isTokenExpired(token)) return dispatch(logout());
        try {
            const res = await axios.get(`${API}/teachers`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("response of teacher fetcAll",res.data)
            return res.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>
            return rejectWithValue(err.response?.data?.message || 'Fetch failed');
        }
    }
);

export const addTeacher= createAsyncThunk(
    'teacher/addTeacher',
    async(formData:FormData,{rejectWithValue,getState,})=>{

        const token= (getState() as RootState).auth.token;
                console.log("fotm data",formData)
        try {
            const response= await axios.post(`${API}/teachers`,formData,{
                headers:{
                    Authorization:`Bearer ${token}`,
                    "Content-Type":"multipart/form-data"
                }
            })
            
            return response.data
            
        } catch (error) {
            const err= error as AxiosError<{message:string}>
            toast.error(err.response?.data.message|| "Failed to add teacher")
            return rejectWithValue(err.response?.data.message|| "Failed to add teacher")
        }
    }
)
