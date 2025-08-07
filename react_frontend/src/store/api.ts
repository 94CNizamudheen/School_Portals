
import { AxiosError } from "axios";
import { login, logout } from "./authSlice";
import API from "../axios.config";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "./store";


export const registerUser = async (name: string, email: string, password: string, role: string) => {
  try {
     const response = await API.post('/auth/register', { name, email, password, role });
      return response.data
  } catch (error) {
     const err = error as AxiosError<{ message: string }>
    throw new Error(err.response?.data.message || "Failed to Signup")
  }
};

export const fetchUser = async (id: string) => {
  const response = await API.get(`/auth/${id}`)
  console.log("fetch user Response", response)
  return response.data
}
export const googleLogin = async (email: string, name: string, role: string) => {
  const response = await API.post("/auth/google-login", {
    email, name, role
  });
  return response.data;
};

export const generateOtp = async (email: string) => {
  try {
    const response = await API.post("/auth/generate-otp", { email });
    console.log(response.data)
    return response.data

  } catch (error) {
    const err = error as AxiosError<{ message: string }>
    throw new Error(err.response?.data.message || "Failed to generate OTP")
  }
}
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

export const logoutThunk = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await API.post('/auth/logout');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    thunkAPI.dispatch(logout());
  } catch (error) {
    const err = error as AxiosError<{ message: string }>
    return thunkAPI.rejectWithValue(err.response?.data.message || err.message);
  }
});
export const refreshTokenThunk = createAsyncThunk(
  'auth/refresh',
  async (_, thunkAPI) => {
    try {
      const refresh_token = thunkAPI.getState() as RootState
      if (!refresh_token) {
        return thunkAPI.rejectWithValue('No refresh token available');
      }
      const response = await API.post('/auth/refresh', { refresh_token });
      const { access_token, refresh_token: newRefreshToken, role, userId } = response.data;

      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', newRefreshToken);
      thunkAPI.dispatch(login({access_token,refresh_token:newRefreshToken,role,userId}));
      return {access_token,refresh_token:newRefreshToken}
    } catch (error) {
      const err= error as AxiosError<{message:string}>
      thunkAPI.dispatch(logout());
      return thunkAPI.rejectWithValue(err.response?.data.message)
    }
  }
)

