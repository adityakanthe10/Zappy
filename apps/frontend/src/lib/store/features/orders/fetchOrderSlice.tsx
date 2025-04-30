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
  reducers: {
    // This action will be called when an order status changes via WebSocket
    setOrderStatus: (state, action: PayloadAction<{ orderId: string; status: string }>) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find(order => order.id === orderId);
      if (order) {
        order.status = status; // Update the order status
      }
    },
  },
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

// Export the setOrderStatus action and the reducer
export const { setOrderStatus } = fetchOrderSlice.actions;
export default fetchOrderSlice.reducer;
