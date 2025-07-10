
import { createSlice,  } from '@reduxjs/toolkit';
import type { PayloadAction,  } from '@reduxjs/toolkit';

interface AuthState {
  role: string | null;
  token: string | null;
  userId: string |null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  role: null,
  userId: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ access_token: string; role: string ;userId:string}>) {
      console.log(action)
      state.token = action.payload.access_token;
      state.role = action.payload.role;
      state.userId= action.payload.userId;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.token = null;
      state.role = null;
      state.userId = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
