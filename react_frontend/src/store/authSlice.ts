
import { createSlice, } from '@reduxjs/toolkit';
import type { PayloadAction, } from '@reduxjs/toolkit';


interface AuthState {
  role: string | null;
  refreshToken: string | null;
  token: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  userEmail: string | null;
  userName: string | null;
}

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  role: null,
  userId: null,
  isAuthenticated: false,
  userEmail: null,
  userName: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ access_token: string; role: string; userId: string; refresh_token: string | null }>) {
      state.token = action.payload.access_token;
      state.refreshToken = action.payload.refresh_token;
      state.role = action.payload.role;
      state.userId = action.payload.userId;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.access_token);
      if (action.payload.refresh_token) {
        localStorage.setItem('refreshToken', action.payload.refresh_token);
      }
      localStorage.setItem('role', action.payload.role);
      localStorage.setItem('userId', action.payload.userId);

    },
    logout(state) {
      state.token = null;
      state.refreshToken = null;
      state.role = null;
      state.userId = null;
      state.isAuthenticated = false;
      state.userEmail = null;
      state.userName = null
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');

    },
    userInfo(state, action: PayloadAction<{ name: string; email: string }>) {
      state.userName = action.payload.name;
      state.userEmail = action.payload.email;
    }
  },
});

export const { login, logout, userInfo } = authSlice.actions;
export default authSlice.reducer;
