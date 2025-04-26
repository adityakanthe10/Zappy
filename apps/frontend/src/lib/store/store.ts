// store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authslice';
import orderReducer from './features/orders/orderSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    order: orderReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
