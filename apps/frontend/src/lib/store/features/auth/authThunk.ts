// authThunks.ts (Inside /store/features/auth)
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface LoginResponse {
  message: string;
  token: string;
  role: string;
}

interface RegisterResponse {
  message: string;
  role: string;
  token: string;
}

// Login thunk
export const loginUser = createAsyncThunk<
  LoginResponse,
  { email: string; password: string }
>("auth/loginUser", async ({ email, password }) => {
  const response = await axios.post("http://localhost:3000/api/auth/login", {
    email,
    password,
  });
  return response.data;
});

// Register thunk
export const registerUser = createAsyncThunk<
  RegisterResponse,
  { username: string; email: string; password: string; role: string }
>(
  "auth/registerUser",
  async ({ username, email, password, role }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        {
          username,
          email,
          password,
          role,
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data?.error || "Authentication Failed"
        );
      }
      return rejectWithValue("Authentication Failed");
    }
  }
);
