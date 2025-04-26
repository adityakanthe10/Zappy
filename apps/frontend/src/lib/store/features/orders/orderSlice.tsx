import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createOrder, OrderResponse } from "./orderThunk";

// Define the Order interface
interface Order {
  id: string;
  product: string;
  quantity: number;
  location: string;
  status: string;
  customerId: string;
}

// Define the Order state
interface OrderState {
  order: Order | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Initial state
const initialState: OrderState = {
  order: null,
  status: "idle",
  error: null,
};

// Create the slice
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<OrderResponse>) => {
          state.status = "succeeded";
          state.order = action.payload.order;
          state.error = null;
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.status = "failed";
        // 🔥 Correctly pick error from action.payload or fallback
        state.error =
          (action.payload as string) || action.error.message || "Something went wrong";
      });
  },
});

// Export the reducer
export default orderSlice.reducer;
