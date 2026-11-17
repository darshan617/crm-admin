import { apiSlice } from "../apiSlice";

const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ body }) => ({
        url: "/auth/login",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["auth"],
    }),
    myProfile: builder.query({
      query: () => ({
        url: "/auth/profile",
        method: "GET",
      }),
      providesTags: ["auth"],
    }),
    updateProfile: builder.mutation({
      query: ({ body }) => ({
        url: "/auth/profile/update",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["auth"],
    }),
    chanagePassword: builder.mutation({
      query: ({ body }) => ({
        url: "/auth/change-password",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useMyProfileQuery,
  useUpdateProfileMutation,
  useChanagePasswordMutation,
} = authApi;
