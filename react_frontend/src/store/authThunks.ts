import type { AxiosError } from "axios";
import API from "../axios.config";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { login, logout } from "./authSlice";
import { store } from "./store";
import axios from "axios";



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
export const refreshTokenThunk = createAsyncThunk(
  'auth/refresh',
  async (_, thunkAPI) => {
    try {
      const refresh_token = store.getState().auth.refresh_token
      if (!refresh_token) {
        return thunkAPI.rejectWithValue('No refresh token available');
      }
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/refresh`, { refresh_token });
      const { access_token, refresh_token: newRefreshToken, role, userId } = response.data;
      thunkAPI.dispatch(login({access_token,refresh_token:newRefreshToken,role,userId}));
      return {access_token,refresh_token:newRefreshToken}
    } catch (error) {
      const err= error as AxiosError<{message:string}>
      thunkAPI.dispatch(logout());
      return thunkAPI.rejectWithValue(err.response?.data.message)
    }
  }
);
  export const logoutThunk = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await API.post('/auth/logout');
    thunkAPI.dispatch(logout());
  } catch (error) {
    const err = error as AxiosError<{ message: string }>
    return thunkAPI.rejectWithValue(err.response?.data.message || err.message);
  }
});

export const verifyOtp = async (code: string, email: string) => {
  try {
    const response = await API.post("auth/verify-otp", { code, email });
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(err.response?.data.message || "Failed to verify OTP");
  }
};


export const resetPassword = async (email: string, password: string) => {
  try {
    const response = await API.post("auth/reset-password", { email, password });
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(err.response?.data.message || "Failed to reset password");
  }
};


export const registerUser = async (name: string, email: string, password: string, role: string) => {
  try {
     const response = await API.post('/auth/register', { name, email, password, role });
      return response.data
  } catch (error) {
     const err = error as AxiosError<{ message: string }>
    throw new Error(err.response?.data.message || "Failed to Signup")
  }
};

export const googleLogin = async (email: string, name: string, role: string) => {
  const response = await API.post("/auth/google-login", {
    email, name, role
  });
  return response.data;
};


