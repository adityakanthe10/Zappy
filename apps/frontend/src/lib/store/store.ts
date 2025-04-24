// store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authslice';
// import userReducer from './features/auth/authslice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    // user: userReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
