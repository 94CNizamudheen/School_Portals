import type { AxiosError } from "axios";
import API from "../axios.config";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const generateOtpThunk = createAsyncThunk(
  'auth/generateOtp',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await API.post('/auth/generate-otp', { email });
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data.message || 'Failed to generate OTP');
    }
  }
);