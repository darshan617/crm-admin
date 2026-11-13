import { apiSlice } from "../apiSlice";

const crmDeals = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    crmDeals: builder.query({
      query: () => ({
        url: "/deals",
        method: "GET",
      }),
      invalidatesTags: ["crmDeals"],
    }),
  }),
});

export const { useCrmDealsQuery } = crmDeals;
