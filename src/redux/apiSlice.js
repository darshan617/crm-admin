import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");

      const userData = Cookies.get("CRM_USER") ? Cookies.get("CRM_USER") : null;
      console.log(userData, "💕");
      const token = Cookies.get('token') ? Cookies.get("token") : null
      

      if (token) {
        try {
          const paredToken = JSON.parse(token);


          if (paredToken) {
            headers.set("Authorization", `Bearer ${paredToken}`);
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
