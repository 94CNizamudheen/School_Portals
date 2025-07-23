
import { createSlice, } from '@reduxjs/toolkit';
import type { PayloadAction, } from '@reduxjs/toolkit';


interface AuthState {
  role: string | null;
  token: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  userEmail: string | null;
  userName: string | null;
}

const initialState: AuthState = {
  token: null,
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
    login(state, action: PayloadAction<{ access_token: string; role: string; userId: string }>) {
      state.token = action.payload.access_token;
      state.role = action.payload.role;
      state.userId = action.payload.userId;
      state.isAuthenticated = true;

    },
    logout(state) {
      state.token = null;
      state.role = null;
      state.userId = null;
      state.isAuthenticated = false;
    },
    userInfo(state, action: PayloadAction<{ name: string; email: string }>) {
      state.userName = action.payload.name;
      state.userEmail = action.payload.email;
    }
  },
});

export const { login, logout, userInfo } = authSlice.actions;
export default authSlice.reducer;
