
import axios from 'axios';
import { store } from './store/store'; 
import { login ,logout} from './store/authSlice'; 

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use((config) => {
  const token = store.getState().auth.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh_token = store.getState().auth.refresh_token;

      try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/refresh`, { refresh_token });
        const { access_token, refresh_token: newRefreshToken, role, userId } = res.data;
        store.dispatch(login({ access_token, refresh_token: newRefreshToken, role, userId }));

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout()); 
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default API;
