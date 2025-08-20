

import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import API from "../axios.config"; 
import type { Subject } from "@/types/subject.types";


export const fetchSubjects = createAsyncThunk(
  "subject/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/subjects");
      return res.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to fetch subjects");
    }
  }
);


export const fetchSubjectById = createAsyncThunk(
  "subject/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await API.get(`/subjects/${id}`);
      return res.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to fetch subject");
    }
  }
);


export const createSubject = createAsyncThunk(
  "subject/create",
  async (data: Subject, { rejectWithValue }) => {
    try {
      const res = await API.post("/subjects", data);
      return res.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to create subject");
    }
  }
);


export const updateSubject = createAsyncThunk(
  "subject/update",
  async ({ id, data }: { id: string; data: Subject }, { rejectWithValue }) => {
    try {
      const res = await API.patch(`/subjects/${id}`, data);
      return res.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to update subject");
    }
  }
);

export const deleteSubject = createAsyncThunk(
  "subject/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await API.delete(`/subjects/${id}`);
      return { id, ...res.data }; // return id so we can remove it in slice
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to delete subject");
    }
  }
);


export const assignTeacher = createAsyncThunk(
  "subject/assignTeacher",
  async ({ id, teacherId }: { id: string; teacherId: string }, { rejectWithValue }) => {
    try {
      const res = await API.patch(`/subjects/assign-teacher/${id}`, { teacherId });
      return res.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to assign teacher");
    }
  }
);


export const removeTeacher = createAsyncThunk(
  "subject/removeTeacher",
  async ({ id, teacherId }: { id: string; teacherId: string }, { rejectWithValue }) => {
    try {
      const res = await API.patch(`/subjects/remove-teacher/${id}`, { teacherId });
      return res.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to remove teacher");
    }
  }
);
