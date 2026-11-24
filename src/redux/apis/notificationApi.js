import { apiSlice } from "../apiSlice";

const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    notification: builder.query({
      query: () => ({
        url: "/notifications",
        method: "GET",
      }),
      providesTags: ["notifications"],
    }),
    notificationRead: builder.mutation({
      query: (body) => ({
        url: "/notifications/read",
        method: "POST",
        body,
      }),
      invalidatesTags: ["notifications"],
    }),
    notificationDelete: builder.mutation({
      query: (body) => ({
        url: "/notifications/delete",
        method: "POST",
        body,
      }),
      invalidatesTags: ["notifications"],
    }),
  }),
});

export const { useNotificationQuery, useNotificationReadMutation, useNotificationDeleteMutation } =
  notificationApi;
