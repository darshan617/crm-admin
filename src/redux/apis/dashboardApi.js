import { apiSlice } from "../apiSlice";

const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    dashboard: builder.query({
      query: () => ({
        url: "/dashboard",
        method: "GET",
      }),
      providesTags: ["auth"],
    }),
  }),
});

export const { useDashboardQuery } = dashboardApi;
