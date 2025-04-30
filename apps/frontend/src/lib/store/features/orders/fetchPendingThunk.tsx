// features/orders/fetchPendingOrdersThunk.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define types properly
export interface Order {
  id: string;
  product: string;
  quantity: number;
  location: string;
  status: string;
  customerId: string;
}

// Define expected response
export interface OrdersResponse {
  orders: Order[];
}

// Create Fetch Pending Orders thunk
export const fetchPendingOrders = createAsyncThunk<
  OrdersResponse,
  void // No parameters are needed
>("orders/fetchPendingOrders", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders/delivery/pending`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.error || "Failed to fetch pending orders"
      );
    }
    return rejectWithValue("Failed to fetch pending orders");
  }
});
