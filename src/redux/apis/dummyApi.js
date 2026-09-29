import { apiSlice } from "../apiSlice";

const dummyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    dummyApi: builder.query({
      query: () => {
        return {
          url: "/posts",
          method: "GET",
        };
      },
      providesTags: ["test"],
    }),
  }),
});
