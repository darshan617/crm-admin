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
  }),
});

export const { useNotificationQuery } = notificationApi;
