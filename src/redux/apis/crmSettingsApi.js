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
    updateLeads: builder.mutation({
      query: ({ body, id }) => ({
        url: `/settings/lead-sources/${id}/update`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["crmLeads"],
    }),
    deleteLeads: builder.mutation({
      query: ({ body, id }) => ({
        url: `/settings/lead-sources/${id}/delete`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["crmLeads"],
    }),
    leadsStatus: builder.query({
      query: () => ({
        url: "/settings/lead-status",
        method: "GET",
      }),
      providesTags: ["crmLeads"],
    }),
    createStatus: builder.mutation({
      query: ({ body }) => ({
        url: "/settings/lead-status/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["crmLeads"],
    }),
    updateStatus: builder.mutation({
      query: ({ body, id }) => ({
        url: `/settings/lead-status/${id}/update`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["crmLeads"],
    }),
    deleteLeadsStatus: builder.mutation({
      query: ({ body, id }) => ({
        url: `/settings/lead-status/${id}/delete`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["crmLeads"],
    }),
    leadsBifurcation: builder.query({
      query: () => ({
        url: "/settings/lead-bifurcation",
        method: "GET",
      }),
      providesTags: ["crmLeads"],
    }),
    createBifurcation: builder.mutation({
      query: ({ body }) => ({
        url: "/settings/lead-bifurcation/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["crmLeads"],
    }),
    updateBifurcation: builder.mutation({
      query: ({ body, id }) => ({
        url: `/settings/lead-bifurcation/${id}/update`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["crmLeads"],
    }),
    deleteLeadsBifurcation: builder.mutation({
      query: ({ body, id }) => ({
        url: `/settings/lead-bifurcation/${id}/delete`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["crmLeads"],
    }),

    leadsPriority: builder.query({
      query: () => ({
        url: "/settings/lead-priority",
        method: "GET",
      }),
      providesTags: ["crmLeads"],
    }),
    createPriority: builder.mutation({
      query: ({ body }) => ({
        url: "/settings/lead-priority/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["crmLeads"],
    }),
    updatePriority: builder.mutation({
      query: ({ body, id }) => ({
        url: `/settings/lead-priority/${id}/update`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["crmLeads"],
    }),
    deleteLeadsPriority: builder.mutation({
      query: ({ body, id }) => ({
        url: `/settings/lead-priority/${id}/delete`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["crmLeads"],
    }),

    leadsDesignation: builder.query({
      query: () => ({
        url: "/settings/designation",
        method: "GET",
      }),
      providesTags: ["crmLeads"],
    }),

    leadsDesignationSearch: builder.query({
      query: (search = "") => ({
        url: "/settings/designation",
        method: "GET",
        params: { search },
      }),
      providesTags: ["crmLeads"],
    }),

    createDesignation: builder.mutation({
      query: ({ body }) => ({
        url: "/settings/designation/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["crmLeads"],
    }),
    updateDesignation: builder.mutation({
      query: ({ body, id }) => ({
        url: `/settings/designation/${id}/update`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["crmLeads"],
    }),
    deleteLeadsDesignation: builder.mutation({
      query: ({ body, id }) => ({
        url: `/settings/designation/${id}/delete`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["crmLeads"],
    }),
  }),
});

export const {
  useLeadsSourceQuery,
  useCreateLeadsMutation,
  useUpdateLeadsMutation,
  useDeleteLeadsMutation,
  useLeadsStatusQuery,
  useCreateStatusMutation,
  useUpdateStatusMutation,
  useDeleteLeadsStatusMutation,
  useLeadsBifurcationQuery,
  useCreateBifurcationMutation,
  useUpdateBifurcationMutation,
  useDeleteLeadsBifurcationMutation,
  useLeadsPriorityQuery,
  useCreatePriorityMutation,
  useUpdatePriorityMutation,
  useDeleteLeadsPriorityMutation,
  useLeadsDesignationQuery,
  useCreateDesignationMutation,
  useUpdateDesignationMutation,
  useDeleteLeadsDesignationMutation,
  useLeadsDesignationSearchQuery,
} = crmSettingsApi;
