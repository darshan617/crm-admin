import { apiSlice } from "../apiSlice";

const followUpApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getFollowUps: builder.query({
      query: ({ filter = "today", page = 1, items_per_page, search } = {}) => {
        const params = {
          filter,
          page,
          page_no: page,
        };

        if (items_per_page) {
          params.items_per_page = items_per_page;
          params.per_page = items_per_page;
        }
        if (search) params.search = search;

        return {
          url: "/followups",
          method: "GET",
          params,
        };
      },
      providesTags: ["followUp"],
    }),
    getFollowUpAssignOptions: builder.query({
      query: () => ({
        url: "/followups/assign-options",
        method: "GET",
      }),
      providesTags: ["followUp", "employees"],
    }),
    assignFollowUps: builder.mutation({
      query: ({ body }) => ({
        url: "/followups/assign",
        method: "POST",
        body,
      }),
      invalidatesTags: ["followUp"],
    }),
    deleteFollowUps: builder.mutation({
      query: ({ body }) => ({
        url: "/followups/delete",
        method: "POST",
        body,
      }),
      invalidatesTags: ["followUp"],
    }),
    downloadFollowUps: builder.mutation({
      query: ({ body }) => ({
        url: "/followups/download",
        method: "POST",
        body,
        responseHandler: async (response) => {
          const contentType = response.headers.get("content-type") || "";

          if (contentType.includes("application/json")) {
            return response.json();
          }

          const disposition = response.headers.get("content-disposition") || "";
          const filename = disposition.match(/filename="?([^";]+)"?/i)?.[1];

          return {
            blob: await response.blob(),
            filename: filename || "selected-follow-ups",
          };
        },
      }),
    }),
    followUpDetail: builder.query({
      query: ({ id }) => ({
        url: `/followups/${id}`,
        method: "GET",
      }),
      providesTags: ["followUp"],
    }),
    addFollowUp: builder.mutation({
      query: ({ body, id }) => ({
        url: `/add-followup/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["followUp"],
    }),
  }),
});

export const {
  useGetFollowUpsQuery,
  useLazyGetFollowUpsQuery,
  useGetFollowUpAssignOptionsQuery,
  useAssignFollowUpsMutation,
  useDeleteFollowUpsMutation,
  useDownloadFollowUpsMutation,
  useFollowUpDetailQuery,
  useAddFollowUpMutation,
} = followUpApi;
