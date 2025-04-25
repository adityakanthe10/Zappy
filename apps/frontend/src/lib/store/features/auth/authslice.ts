import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginUser, registerUser } from './authThunk';
import Cookies from 'js-cookie';

// Define the structure of a user object
interface User {
  username: string;
  name: string;
  email: string;
}

// Define the expected response structure for a login action
interface LoginResponse {
  token: string;
  role: string;
}

// Define the expected response structure for a register action
interface RegisterResponse {
  token: string;
  role: string;
}

// Define the state structure for authentication
interface AuthState {
  user: User | null;
  token: string | null;
  role: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state of the authentication slice, getting token and role from cookies if available
const initialState: AuthState = {
  user: null,
  token: Cookies.get('token') || null,
  role: Cookies.get('role') || null,
  status: 'idle',
  error: null,
};

// Create the authentication slice with reducers and extra reducers for async actions
const authSlice = createSlice({
  name: 'auth',
  initialState, 
  reducers: {
    // Reducer to handle logout, clearing user data and removing cookies
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.status = 'idle';
      state.error = null;
      // Remove token and role from cookies on logout
      Cookies.remove('token');
      Cookies.remove('role');
    },
  },
  extraReducers: (builder) => {
    // Handle login actions
    builder.addCase(loginUser.pending, (state) => {
      state.status = 'loading'; // Set status to loading when login starts
    });
    builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
      state.status = 'succeeded';
      state.token = action.payload.token;
      state.role = action.payload.role;

      // Save token and role to cookies with an expiration time of 2 hours
      Cookies.set('token', action.payload.token, { expires: 2 / 24 });
      Cookies.set('role', action.payload.role, { expires: 2 / 24 });
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.status = 'failed'; // Set status to failed if login fails
      state.error = action.error.message || 'Failed to login'; // Set error message if available
    });

    // Handle register actions
    builder.addCase(registerUser.pending, (state) => {
      state.status = 'loading'; // Set status to loading when registration starts
    });
    builder.addCase(registerUser.fulfilled, (state, action: PayloadAction<RegisterResponse>) => {
      state.status = 'succeeded'; // Set status to succeeded when registration is successful
      state.token = action.payload.token;
      state.role = action.payload.role;
      // Save token and role to cookies with an expiration time of 2 hours
      Cookies.set('token', action.payload.token, { expires: 2 / 24 });
      Cookies.set('role', action.payload.role, { expires: 2 / 24 });
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.status = 'failed'; // Set status to failed if registration fails
      state.error = action.error.message || 'Failed to register'; // Set error message if available
    });
  },
});

// Export the logout action to be dispatched from elsewhere in the app
export const { logout } = authSlice.actions;

// Export the reducer to be used in the store
export default authSlice.reducer;
