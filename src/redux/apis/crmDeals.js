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

    DealsPoSource: builder.mutation({
      query: ({ body, id }) => ({
        url: `/deals/${id}/po`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["crmDeals"],
    }),
    DealsActivate: builder.mutation({
      query: ({ body, id }) => ({
        url: `/deals/${id}/activate`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["crmDeals"],
    }),
  }),
});

export const {
  useCrmDealsQuery,
  useCrmDealsDetailsQuery,
  useDealsPoSourceMutation,
  useDealsActivateMutation,
} = crmDeals;
