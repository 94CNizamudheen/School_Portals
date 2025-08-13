
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import API from "../axios.config";
import type { ClassDivision } from "@/types/division.types"; 

export const fetchAllDivisions = createAsyncThunk(
  "division/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get(`/divisions`);
      return res.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to fetch divisions");
    }
  }
);

export const createDivision = createAsyncThunk(
  "division/create",
  async (newDivision: Omit<ClassDivision, "id">, { rejectWithValue }) => {
    try {
      const res = await API.post(`/divisions`, newDivision);
      return res.data; // return created division
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
      await API.delete(`/divisions/${id}`);
      return id; // return deleted division id
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to delete division");
    }
  }
);

export const assignClassTeacher = createAsyncThunk(
  "division/assignTeacher",
  async ({ divisionId, teacherId }: { divisionId: string; teacherId: string }, { rejectWithValue }) => {
    try {
      const res = await API.patch(`/divisions/${divisionId}/assign-teacher`, { teacherId });
      return res.data; // updated division
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to assign teacher");
    }
  }
);

export const addStudentToDivision = createAsyncThunk(
  "division/addStudent",
  async ({ divisionId, studentId }: { divisionId: string; studentId: string }, { rejectWithValue }) => {
    try {
      const res = await API.patch(`/divisions/${divisionId}/add-student`, { studentId });
      return res.data; // updated division
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
      const res = await API.patch(`/divisions/${divisionId}/remove-student`, { studentId });
      return res.data; // updated division
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to remove student");
    }
  }
);
