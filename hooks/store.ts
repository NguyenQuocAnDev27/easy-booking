import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import navigatorReducer from "./navigatorSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    navigator: navigatorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
