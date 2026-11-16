import { apiSlice } from "../apiSlice";

const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    dashboard: builder.query({
      query: (params) => ({
        url: "/dashboard",
        method: "GET",
        params,
      }),
      providesTags: ["auth"],
    }),
  }),
});

export const { useDashboardQuery } = dashboardApi;
