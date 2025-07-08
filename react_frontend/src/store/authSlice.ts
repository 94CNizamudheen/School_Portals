
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  role: string | null;
  token: string | null;
  userId: string |null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  role: typeof window !== 'undefined' ? localStorage.getItem('role') : null,
  userId: typeof window !== 'undefined' ? localStorage.getItem('userId') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ access_token: string; role: string ;userId:string}>) {
      state.token = action.payload.access_token;
      state.role = action.payload.role;
      state.userId= action.payload.userId;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.access_token);
        localStorage.setItem('role', action.payload.role);
        localStorage.setItem('userId',action.payload.userId)
      }
    },
    logout(state) {
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
      }
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
