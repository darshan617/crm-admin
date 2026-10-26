import { apiSlice } from "../apiSlice";

const quotationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllQuotations: builder.query({
      query: ({
        search = "",
        tab = "all",
        status = "",
        date_type = "",
        from = "",
        to = "",
        page = 1,
      }) => {
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
    getQuotationDdData: builder.query({
      query: () => ({
        url: `/quotations/create`,
        method: "GET",
      }),
      providesTags: ["quotation"],
    }),
    createQuotation: builder.mutation({
      query: ({ body }) => ({
        url: `/quotation-create`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["quotation"],
    }),
    checkQuotaionDomain: builder.query({
      query: ({ domain }) => ({
        url: `/quotations/check-domain?domain=${domain}`,
        method: "GET",
      }),
      providesTags: ["quotation"],
    }),
    getLeadDataForQuotation: builder.query({
      query: ({ lead_id }) => ({
        url: `/quotations/create?lead_id=${lead_id}`,
        method: "GET",
      }),
      providesTags: ["quotation"],
    }),
  }),
});

export const {
  useGetAllQuotationsQuery,
  useGetQuotationDdDataQuery,
  useCreateQuotationMutation,
  useCheckQuotaionDomainQuery,
  useGetLeadDataForQuotationQuery,
} = quotationApi;
