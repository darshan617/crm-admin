import { apiSlice } from "../apiSlice";

const ProviderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProvider: builder.query({
      query: () => ({
        url: "/providers",
        method: "GET",
      }),
      providesTags: ["providers"],
    }),

    getProviderPlan: builder.query({
      query: ({ id, variant }) => ({
        url: `/providers/${id}/plans`,
        method: "GET",
        params: variant ? { variant } : {},
      }),
      providesTags: ["providers"],
    }),
  }),
});

export const { useGetProviderQuery, useGetProviderPlanQuery } = ProviderApi;
