// features/order/fetchOrderThunk.ts

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

// Create Fetch Orders thunk
export const fetchOrders = createAsyncThunk<
  OrdersResponse, 
  { id: string }
>(
  "order/fetchOrders",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/orders/customer/${id}`);
      console.log("response", response);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data?.error || "Failed to fetch orders"
        );
      }
      return rejectWithValue("Failed to fetch orders");
    }
  }
);
