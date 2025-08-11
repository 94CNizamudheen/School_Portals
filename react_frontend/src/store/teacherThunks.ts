import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { toast } from "react-toastify";
import API from "../axios.config";
import type { Teacher } from "@/types/teacher.types";


export const fetchTeachers = createAsyncThunk(
    'teacher/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const res = await API.get(`/teachers`,)
            console.log("response of teacher fetcAll", res.data)
            return res.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>
            return rejectWithValue(err.response?.data?.message || 'Fetch failed');
        }
    }
);
export const verifyTeacher = createAsyncThunk(
    'teacher/verifyTeacher',
    async (teacherId: string, { rejectWithValue }) => {
        try {
            const response = await API.patch(`/teachers/verify-and-create/${teacherId}`);
            return response.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            return rejectWithValue(err.response?.data.message || 'Failed to veify teacher')
        }

    }
);
export const rejectApplication = createAsyncThunk(
    'teacher/rejectApplication',
    async (teacherId: string, { rejectWithValue }) => {
        try {
            const response = await API.patch(`/teachers/reject-application/${teacherId}`);
            console.log("response data from reject application", response.data)
            return response.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            return rejectWithValue(err.response?.data.message)
        }
    }
)

export const sendteacherApplication = createAsyncThunk(
    'teacher/sendApplication',
    async (formData: FormData, { rejectWithValue, }) => {
        try {
            const response = await API.post(`/teachers/apply`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            return response.data
        } catch (error) {
            const err = error as AxiosError<{ message: string }>
            toast.error(err.response?.data.message || "Failed to add teacher")
            return rejectWithValue(err.response?.data.message || "Failed to add teacher")
        }
    }
)
export const deleteTeacher = createAsyncThunk(
    'teacher/deleteTeacher',
    async (id: string, { rejectWithValue }) => {
        try {
            await API.delete(`/teachers/${id}`);
        } catch (error) {
            const err = error as AxiosError<{ message: string }>
            return rejectWithValue(err.response?.data.message)
        }

    }
);

export const findTeacherByEmail = createAsyncThunk(
    'teacher/findTeacherByEmail',
    async (email: string, { rejectWithValue }) => {
        try {
            const response = await API.get(`/teachers/find-by-email/${email}`)
            console.log("response fetch teacher by  email", response.data)
            return response.data
        } catch (error) {
            const err = error as AxiosError<{ message: string }>
            return rejectWithValue(err.response?.data.message)
        }

    }
);
export const updateTeacher = createAsyncThunk(
    'teacher/updateTeacher',
    async ({ id, updates }: { id: string; updates: Partial<Record<keyof Teacher, unknown>> }, { rejectWithValue }) => {
        const formData = new FormData()
        Object.entries(updates).forEach(([key, val]) => {
            if (val !== undefined && val !== null) {
                if (val instanceof Blob) {
                    formData.append(key, val)
                } else {
                    formData.append(key, String(val))
                }
            }
        });
        try {
            const response = await API.patch(`/teachers/${id}`, formData)
            return response.data
        } catch (error) {
            const err = error as AxiosError<{ message: string }>
            return rejectWithValue(err.response?.data.message)
        }
    }
)
