// features/order/fetchOrderSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchOrders, OrdersResponse, Order } from "./fetchOrderThunk";

// Define the state
interface OrderState {
  orders: Order[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Initial state
const initialState: OrderState = {
  orders: [],
  status: "idle",
  error: null,
};

// Create the slice
const fetchOrderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<OrdersResponse>) => {
          state.status = "succeeded";
          state.orders = action.payload.orders;
          state.error = null;
        }
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || action.error.message || "Something went wrong";
      });
  },
});

// Export reducer
export default fetchOrderSlice.reducer;
