import axios from 'axios';
import type { Store } from '@reduxjs/toolkit';
import type { RootState } from './store/store';
import { login, logout } from './store/authSlice';

let reduxStore: Store<RootState>;

// function to inject store (called from main.tsx)
export const injectStore = (store: Store<RootState>) => {
  reduxStore = store;
};

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token on every request
API.interceptors.request.use((config) => {
  const token = reduxStore.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 and refresh token
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh_token = reduxStore.getState().auth.refresh_token;

      try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/refresh`, { refresh_token });

        const { access_token, refresh_token: newRefreshToken, role, userId } = res.data;

        reduxStore.dispatch(login({ access_token, refresh_token: newRefreshToken, role, userId }))
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        reduxStore.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default API;
