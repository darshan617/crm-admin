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
  }),
});

export const {
  useGetAllLeadsQuery,
  useGetDdDataQuery,
  useCreateLeadMutation,
  useGetSingleLeadDeatilsQuery,
  useUpdateLeadMutation,
} = leadsApi;
