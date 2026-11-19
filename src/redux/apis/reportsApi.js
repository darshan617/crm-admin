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
      query: ({ report, page_no = 1, items_per_page = 10 }) => ({
        url: `/reports/${report}`,
        method: "GET",
        params: {
          page_no,
          items_per_page,
        },
      }),
      providesTags: ["reports"],
    }),
  }),
});

export const { useReportsQuery, useReportDetailQuery } = reportsApi;
