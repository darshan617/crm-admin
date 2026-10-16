// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import Cookies from "js-cookie";
// export const apiSlice = createApi({
//   reducerPath: "api",
//   baseQuery: fetchBaseQuery({
//     baseUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
//     prepareHeaders: (headers) => {
//       headers.set("Content-Type", "application/json");
//       headers.set("Accept", "application/json");

//       const userData = Cookies.get("CRM_USER")
//         ? JSON.parse(Cookies.get("CRM_USER"))
//         : null;

//       const token = Cookies.get("token") ? JSON.parse(Cookies.get("token")) : null;

//       if (token) {
//         try {
//           const paredToken = token;

//           if (paredToken) {
//             headers.set("Authorization", `Bearer ${paredToken}`);
//           }
//         } catch (error) {
//           console.error("Invalid userData cookie:", error);
//         }
//       }

//       return headers;
//     },
//   }),
//   tagTypes: ["auth", "leads"],
//   endpoints: (builder) => ({}),
// });
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { HYDRATE } from "next-redux-wrapper";
import Cookies from "js-cookie";

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,

    prepareHeaders: (headers) => {
      const tokenCookie = Cookies.get("token");

      if (tokenCookie) {
        let token = tokenCookie;

        // Support JSON-encoded tokens as well as plain strings.
        try {
          const parsedToken = JSON.parse(tokenCookie);

          if (typeof parsedToken === "string") {
            token = parsedToken;
          }
        } catch {
          // The cookie is already a plain string.
        }

        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }

      return headers;
    },
  }),

  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },

  tagTypes: ["Wishlist", "Cart", "Product", "User"],

  endpoints: () => ({}),
});