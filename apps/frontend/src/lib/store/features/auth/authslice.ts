import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginUser, registerUser } from './authThunk';

interface User {
  username: string;
  name: string;
  email: string;
}

interface LoginResponse {
  token: string;
  role:string;
}

interface RegisterResponse {
  token: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  role: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'), // Retrieve user data from localStorage
  token: localStorage.getItem('token'), // Retrieve token from localStorage
  role: localStorage.getItem('role'), // Retrieve role from localStorage
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
      state.status = 'succeeded';
      state.token = action.payload.token;
      localStorage.setItem('role', action.payload.role);
      localStorage.setItem('token', action.payload.token); // Save token to localStorage
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message || 'Failed to login';
    });

    builder.addCase(registerUser.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(registerUser.fulfilled, (state, action: PayloadAction<RegisterResponse>) => {
      state.status = 'succeeded';
      state.token = action.payload.token;
      state.role = action.payload.role;
      localStorage.setItem('token', action.payload.token); // Save token to localStorage
      localStorage.setItem('role', action.payload.role); // Save role to localStorage
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message || 'Failed to register';
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
