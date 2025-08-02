import { createAsyncThunk } from "@reduxjs/toolkit";
import  { AxiosError } from "axios";

import { toast } from "react-toastify";
import API from "../axios.config";


export const fetchTeachers = createAsyncThunk(
    'teacher/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const res = await API.get(`/teachers`, )
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
    async(formData:FormData,{rejectWithValue,})=>{

        try {
            const response= await API.post(`/teachers`,formData,{
                headers:{
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
export const deleteTeacher= createAsyncThunk(
    'teacher/deleteTeacher',
    async(id:string,{rejectWithValue})=>{
        try {
             await API.delete(`/teachers/${id}`);
        } catch (error) {
            const err= error as AxiosError<{message:string}>
            rejectWithValue(err.response?.data.message)
        }
       
    }

)
