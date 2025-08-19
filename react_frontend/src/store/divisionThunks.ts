
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import API from "../axios.config";

export const fetchAllDivisions = createAsyncThunk(
  "division/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get(`/divisions`);
      console.log("Response fetch all divisions",res.data)
      return res.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to fetch divisions");
    }
  }
);

export const createDivision = createAsyncThunk(
  "division/create",
  async (data:{classLevel:string,divisionName:string,subjects:string[],classTeacherId:string ,capacity:number}, { rejectWithValue }) => {
    console.log("create division data",data)
    try {
      const res = await API.post(`/divisions`, data);
      return res.data; 
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to create division");
    }
  }
);

export const deleteDivisionById = createAsyncThunk(
  "division/delete",
  async (id: string, { rejectWithValue }) => {
    try {
     const res= await API.delete(`/divisions/${id}`);
      return res.data
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to delete division");
    }
  }
);

export const updateDivision = createAsyncThunk(
  "division/assignTeacher",
  async ({ divisionId, data }: { divisionId: string; data: Record<string, unknown> }, { rejectWithValue }) => {
    try {
      const res = await API.patch(`/divisions/${divisionId}`, data );
      return res.data; 
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to assign teacher");
    }
  }
);

export const addStudentToDivision = createAsyncThunk(
  "division/addStudent",
  async ({ divisionId, studentId,classLevel }: { divisionId: string; studentId: string,classLevel:string }, { rejectWithValue }) => {
    try {
      const res = await API.patch(`/divisions/add-student/${divisionId}`, { studentId,classLevel });
      return res.data; 
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to add student");
    }
  }
);

export const removeStudentFromDivision = createAsyncThunk(
  "division/removeStudent",
  async ({ divisionId, studentId }: { divisionId: string; studentId: string }, { rejectWithValue }) => {
    try {
      const res = await API.patch(`/divisions/remove-student/${divisionId}`, { studentId });
      return res.data; 
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to remove student");
    }
  }
);
