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
    getQuotationDetail: builder.query({
      query: ({ quotation_id }) => ({
        url: `/quotations/${quotation_id}`,
        method: "GET",
      }),
      providesTags: ["quotation"],
    }),
    updateQuotation: builder.mutation({
      query: ({ body, quotation_id }) => ({
        url: `/quotations/${quotation_id}/update`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["quotation"],
    }),
    quotationHistory: builder.query({
      query: ({ quotation_id }) => ({
        url: `/quotations/${quotation_id}/activity`,
        method: "GET",
      }),
      providesTags: ["quotation"],
    }),
    downloadQuotation: builder.query({
      query: ({ quotation_id }) => ({
        url: `/quotations/${quotation_id}/download`,
        method: "GET",
      }),
      providesTags: ["quotation"],
    }),
    sendMail: builder.mutation({
      query: ({ body }) => ({
        url: `/quotations/send-mail`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["quotation"],
    }),
    getSuggestMail: builder.query({
      query: () => ({
        url: `/quotations/email-suggestions`,
        method: "GET",
      }),
      providesTags: ["quotation"],
    }),
    status: builder.mutation({
      query: ({ body, quotation_id }) => ({
        url: `/quotations/${quotation_id}/status`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["quotation"],
    }),
    downloadInvoice: builder.query({
      query: ({ quotation_id }) => ({
        url: `/quotations/${quotation_id}/invoice/download`,
        method: "GET",
      }),
      providesTags: ["quotation"],
    }),
    sendInvoice: builder.mutation({
      query: ({ body }) => ({
        url: `/quotations/send-invoice-mail`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["quotation"],
    }),
  }),
});

export const {
  useGetAllQuotationsQuery,
  useGetQuotationDdDataQuery,
  useCreateQuotationMutation,
  useCheckQuotaionDomainQuery,
  useGetLeadDataForQuotationQuery,
  useGetQuotationDetailQuery,
  useUpdateQuotationMutation,
  useQuotationHistoryQuery,
  useDownloadQuotationQuery,
  useLazyDownloadQuotationQuery,
  useSendMailMutation,
  useGetSuggestMailQuery,
  useStatusMutation,
  useDownloadInvoiceQuery,
  useLazyDownloadInvoiceQuery,
  useSendInvoiceMutation,
} = quotationApi;
