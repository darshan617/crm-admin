import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import { createWrapper } from "next-redux-wrapper";
import popupSlice from './slices/popupSlice'

const makeStore = () => {
  const store = configureStore({
    reducer: {
      popup: popupSlice,
      [apiSlice.reducerPath] :apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });

  return store;
};

export const storeWrapper = createWrapper(makeStore);
