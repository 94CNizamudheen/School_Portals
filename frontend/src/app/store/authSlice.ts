
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  role: string | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  role: typeof window !== 'undefined' ? localStorage.getItem('role') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ token: string; role: string }>) {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('role', action.payload.role);
      }
    },
    logout(state) {
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
      }
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
