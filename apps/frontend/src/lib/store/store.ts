import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import authReducer from './features/auth/authslice';
import orderReducer from './features/orders/orderSlice';
import fetchOrderReducer from './features/orders/fetchOrderSlice';
import  fetchPendingOrdersReducer  from './features/orders/fetchPendingOrderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    order: orderReducer,
    fetchOrders: fetchOrderReducer,
    fetchPendingOrders: fetchPendingOrdersReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
