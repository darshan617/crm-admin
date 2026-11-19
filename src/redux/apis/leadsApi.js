import { apiSlice } from "../apiSlice";

const leadsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllLeads: builder.query({
      query: ({
        source,
        page_no = 1,
        items_per_page = 10,
        ...filters
      } = {}) => {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
          if (value == null || value === "") return;
          params.set(key, String(value));
        });

        if (source) params.set("source", String(source));
        params.set("page_no", String(page_no));
        params.set("items_per_page", String(items_per_page));

        return {
          url: `/leads?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["leads"],
    }),
    getDdData: builder.query({
      query: () => ({
        url: "leads/create",
        method: "GET",
      }),
      providesTags: ["leads"],
    }),
    createLead: builder.mutation({
      query: ({ body }) => ({
        url: "/lead-create",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["leads"],
    }),
    getSingleLeadDeatils: builder.query({
      query: ({ lead_id }) => ({
        url: `/leads/${lead_id}`,
        method: "GET",
      }),
      providesTags: ["leads"],
    }),
    updateLead: builder.mutation({
      query: ({ body, lead_id }) => ({
        url: `/leads/${lead_id}/update`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["leads"],
    }),
    contactandServicePlanDelete: builder.mutation({
      query: ({ body, lead_id, id, type }) => ({
        url: `/leads/${lead_id}/${type}/${id}/delete`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["leads"],
    }),
    leadDocumentDelete: builder.mutation({
      query: ({ body, lead_id }) => ({
        url: `/leads/${lead_id}/documents/delete`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["leads"],
    }),
    uploadLeads: builder.mutation({
      query: ({ body }) => ({
        url: "/leads/upload",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["leads"],
    }),
    checkLeadDomain: builder.query({
      query: ({ domain }) => ({
        url: `/leads/check-domain?domain=${domain}`,
        method: "GET",
      }),
      providesTags: ["quotation"],
    }),
  }),
});

export const {
  useGetAllLeadsQuery,
  useGetDdDataQuery,
  useCreateLeadMutation,
  useGetSingleLeadDeatilsQuery,
  useUpdateLeadMutation,
  useContactandServicePlanDeleteMutation,
  useLeadDocumentDeleteMutation,
  useUploadLeadsMutation,
  useCheckLeadDomainQuery,
} = leadsApi;
