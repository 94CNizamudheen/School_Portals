import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  role: string | null;
  refresh_token: string | null;
  token: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  userEmail: string | null;
  userName: string | null;
}

const initialState: AuthState = {
  token: null,
  refresh_token: null,
  role: null,
  userId: null,
  isAuthenticated: false,
  userEmail: null,
  userName: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{
        access_token: string;
        refresh_token: string | null;
        role: string;
        userId: string;
      }>
    ) {
      state.token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
      state.role = action.payload.role;
      state.userId = action.payload.userId;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.token = null;
      state.refresh_token = null;
      state.role = null;
      state.userId = null;
      state.isAuthenticated = false;
      state.userEmail = null;
      state.userName = null;
    },
    userInfo(state, action: PayloadAction<{ name: string; email: string }>) {
      state.userName = action.payload.name;
      state.userEmail = action.payload.email;
    },
  },
});

export const { login, logout, userInfo } = authSlice.actions;
export default authSlice.reducer;
