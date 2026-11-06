import { apiSlice } from "../apiSlice";

const followUpApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFollowUps: builder.query({
      query: ({ filter = "today", page = 1 } = {}) => ({
        url: "/followups",
        method: "GET",
        params: {
          filter,
          page,
        },
      }),
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
