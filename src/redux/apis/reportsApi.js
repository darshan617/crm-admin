import { apiSlice } from "../apiSlice";

const reportsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    reports: builder.query({
      query: (params) => ({
        url: "/reports",
        method: "GET",
        params,
      }),
      providesTags: ["reports"],
    }),
    reportDetail: builder.query({
      query: (report) => ({
        url: `/reports/${report}`,
        method: "GET",
      }),
      providesTags: ["reports"],
    }),
  }),
});

export const { useReportsQuery, useReportDetailQuery } = reportsApi;
