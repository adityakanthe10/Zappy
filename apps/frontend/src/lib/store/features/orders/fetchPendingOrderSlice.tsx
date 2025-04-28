// features/orders/fetchPendingOrdersSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchPendingOrders, OrdersResponse, Order } from "./fetchPendingThunk";

// Define the state
interface PendingOrdersState {
  orders: Order[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Initial state
const initialState: PendingOrdersState = {
  orders: [],
  status: "idle",
  error: null,
};

// Create the slice
const fetchPendingOrdersSlice = createSlice({
  name: "pendingOrders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchPendingOrders.fulfilled,
        (state, action: PayloadAction<OrdersResponse>) => {
          state.status = "succeeded";
          state.orders = action.payload.orders;
          state.error = null;
        }
      )
      .addCase(fetchPendingOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Something went wrong";
      });
  },
});

// Export reducer
export default fetchPendingOrdersSlice.reducer;
