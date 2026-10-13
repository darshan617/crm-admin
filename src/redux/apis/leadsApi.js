import { apiSlice } from "../apiSlice";

const leadsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllLeads: builder.query({
      query: () => ({
        url: "/leads",
        method: "GET",
      }),
      providesTags: ["leads"],
    }),
    getDdData: builder.query({
      query: () => ({
        url: "leads/create",
        method: "GET",
      }),
      providesTags: ["leads"],
    }),
  }),
});

export const { useGetAllLeadsQuery, useGetDdDataQuery } = leadsApi;
