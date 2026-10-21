import { apiSlice } from "../apiSlice";

const quotationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllQuotations: builder.query({
      query: ({ search = "", tab = "all", status = "", date_type = "", from = "", to = "", page = 1 }) => {
        const params = new URLSearchParams({
          search,
          tab,
          status,
          date_type,
          from,
          to,
          page: String(page),
        });

        return {
          url: `/quotations?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["quotation"],
    }),
  }),
});

export const { useGetAllQuotationsQuery } = quotationApi;
