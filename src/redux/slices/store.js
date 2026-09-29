import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../apiSlice";
import { createWrapper } from "next-redux-wrapper";

const makeStore = () => {
  const store = configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });

  return store;
};

export const storeWrapper = createWrapper(makeStore);
