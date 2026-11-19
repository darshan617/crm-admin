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
  useFollowUpDetailQuery,
  useAddFollowUpMutation,
} = followUpApi;
