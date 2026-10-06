import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");

      const userData = Cookies.get("userData") ? Cookies.get("userData") : null;

      if (userData) {
        try {
          const parsedData = JSON.parse(userData);

          if (parsedData?.token) {
            headers.set("Authorization", `Bearer ${parsedData.token}`);
          }
        } catch (error) {
          console.error("Invalid userData cookie:", error);
        }
      }

      return headers;
    },
  }),
  tagTypes: ["auth"],
  endpoints: (builder) => ({}),
});
