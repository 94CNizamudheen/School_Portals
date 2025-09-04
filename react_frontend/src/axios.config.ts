import axios from 'axios';
import type { Store } from '@reduxjs/toolkit';
import type { RootState } from './store/store';
import { login, logout } from './store/authSlice';

let reduxStore: Store<RootState>;

export const injectStore = (store: Store<RootState>) => {
  reduxStore = store;
};

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use((config) => {
  const token = reduxStore.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
const refreshSubscibers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscibers.forEach(cb => cb(token));
  refreshSubscibers.length = 0;
};
const addSubscribers = (cb: (token: string) => void) => {
  refreshSubscibers.push(cb)
}


API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/refresh')) {
      if (isRefreshing) {
        return new Promise(resolve => {
          addSubscribers((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(API(originalRequest))
          })
        })
      }
      originalRequest._retry = true;
      isRefreshing=true;
      const refresh_token = reduxStore.getState().auth.refresh_token;

      try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/refresh`, { refresh_token });
        const { access_token, refresh_token: newRefreshToken, role, userId } = res.data;

        reduxStore.dispatch(login({ access_token, refresh_token: newRefreshToken, role, userId }));

        isRefreshing = false;
        onRefreshed(access_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return API(originalRequest);
      } catch (refreshError) {
        isRefreshing = false
        reduxStore.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default API;
