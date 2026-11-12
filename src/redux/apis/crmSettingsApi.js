import { apiSlice } from "../apiSlice";

const crmSettingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    leadsSource: builder.query({
      query: () => ({
        url: "/settings/lead-sources",
        method: "GET",
      }),
      providesTags: ["crmLeads"],
    }),
    createLeads: builder.mutation({
      query: ({ body }) => ({
        url: "/settings/lead-sources/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["crmLeads"],
    }),
  }),
});

export const { useLeadsSourceQuery, useCreateLeadsMutation } = crmSettingsApi;
