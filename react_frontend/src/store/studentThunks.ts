
import API from "../axios.config";
import { AxiosError } from "axios"
import type { Student, } from "../types/student"


import { createAsyncThunk, } from "@reduxjs/toolkit"


export const fetchAllStudents = createAsyncThunk(
    "student/fetchAll",
    async (_, { rejectWithValue, }) => {
        try {
            const response = await API.get(`/students`)
            console.log(" response.data in fetch all student", response.data)
            return response.data
        } catch (error) {
            const err = error as AxiosError<{ message: string }>
            return rejectWithValue(err.response?.data?.message || "Failed to fetch students")
        }
    }
)


export const fetchStudentByEmail = createAsyncThunk(
    "student/fetchByEmail",
    async (email: string, { rejectWithValue }) => {
        try {
            const response = await API.get(`/student/by-email?email=${encodeURIComponent(email)}`)
            return response.data.student
        } catch (error) {
            const err = error as AxiosError<{ message: string }>
            return rejectWithValue(err.response?.data?.message || "Failed to fetch student")
        }
    }
)

export const verifyStudentOtp = createAsyncThunk(
    "student/verifyStudentOtp",
    async ({ email, code }: { email: string; code: string }, { rejectWithValue }) => {

        try {
            const response = await API.post(`/auth/verify-otp`, { email, code })
            return response.data
        } catch (error) {
            const err = error as AxiosError<{ message: string }>
            return rejectWithValue(err.response?.data?.message || "OTP verification failed")
        }
    }
);
export const fetchStudentById = createAsyncThunk(
    "student/fetchById",
    async (id: string, { rejectWithValue }) => {
        console.log("Student id", id)
        try {
            const response = await API.get(`/students/${id}`);
            return response.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            return rejectWithValue(err.response?.data?.message || "Failed to fetch student");
        }
    }
);


export const updateStudent = createAsyncThunk(
    "student/update",
    async ({ id, updates }: { id: string; updates: Partial<Student> }, { rejectWithValue }) => {
        try {
            const response = await API.patch(`/students/${id}`, updates);
            return response.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            return rejectWithValue(err.response?.data?.message || "Failed to update student");
        }
    }
);

export const requestStudentOtp = createAsyncThunk(
    'student/sendOtp',
    async (data: { email: string; identity: string }, { rejectWithValue }) => {
        try {
            const response = await API.post(`/auth/generate-student-otp`, data);
            return response.data;

        } catch (error) {
            const err = error as AxiosError<{ message: string }>
            return rejectWithValue(err.response?.data.message)
        }
    }
);

export const changeStudentPassword = createAsyncThunk(
    'student/changePassword',
    async (data: { identity: string; password: string }, { rejectWithValue }) => {
        try {
            return await API.post(`/auth/reset-password`, data);
        } catch (error) {
            const err = error as AxiosError<{ message: string }>
            return rejectWithValue(err.response?.data.message)
        }
    }
);

export const sendStudentPassword = createAsyncThunk(
    'student/forgotStudentPassword',
    async (data:{ email: string, identity: string },{rejectWithValue}) => {
        try {
            const res= await API.post(`/auth/send-student-password`, data);
            console.log("response in forgot",res.data)
            return res.data?.message
        } catch (error) {
            const err = error as AxiosError<{ message: string }>
            return rejectWithValue(err.response?.data.message)
        }
    }
);

