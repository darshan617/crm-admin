import { apiSlice } from "../apiSlice";

const crmDeals = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    crmDeals: builder.query({
      query: () => ({
        url: "/deals",
        method: "GET",
      }),
      providesTags: ["crmDeals"],
    }),

    crmDealsDetails: builder.query({
      query: ({ id }) => ({
        url: `/deals/${id}`,
        method: "GET",
      }),
      providesTags: ["crmDeals"],
    }),
  }),
});

export const { useCrmDealsQuery, useCrmDealsDetailsQuery } = crmDeals;
