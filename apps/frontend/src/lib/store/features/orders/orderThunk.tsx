import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define types properly
interface Order {
  id:string;
  product: string;
  quantity: number;
  location: string;
  status: string;
  customerId: string;
}
// Define expected response from server
export interface OrderResponse {
  order:Order
}

// Create Order thunk
export const createOrder = createAsyncThunk<
 OrderResponse , { product: string; quantity: number; location: string; }>
(
  "order/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/orders",
        orderData
      );
      console.log("response",response)
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data?.error || "Failed to create order"
        );
      }
      return rejectWithValue("Failed to create order");
    }
  }
);
