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
        page_no,
        items_per_page,
        item_per_page,
      } = {}) => {
        const pageNo = page_no ?? page ?? 1;
        const perPage = items_per_page ?? item_per_page ?? 10;
        const params = new URLSearchParams({
          search,
          tab,
          status,
          date_type,
          from,
          to,
          page: String(pageNo),
          page_no: String(pageNo),
          items_per_page: String(perPage),
          item_per_page: String(perPage),
          per_page: String(perPage),
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
      // GET /quotations/email-suggestions?q=
      query: ({ q = "" } = {}) => ({
        url: `/quotations/email-suggestions?q=${encodeURIComponent(q)}`,
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
    requestDiscount: builder.mutation({
      query: ({ quotation_id, employee, requested_discount, remark }) => ({
        url: `/quotations/${quotation_id}/discount-request`,
        method: "POST",
        body: { employee, requested_discount, remark },
      }),
      invalidatesTags: ["quotation"],
    }),
    decideDiscountRequest: builder.mutation({
      query: ({ id, action }) => ({
        url: `/quotations/${id}/discount-request/respond`,
        method: "POST",
        body: { action },
      }),
      invalidatesTags: ["quotation"],
    }),
    getDiscountRequests: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value == null || value === "") return;
          searchParams.set(key, String(value));
        });

        const query = searchParams.toString();

        return {
          url: query
            ? `/quotations/discount-requests?${query}`
            : `/quotations/discount-requests`,
          method: "GET",
        };
      },
      providesTags: ["quotation"],
    }),

    requestDiscountEmployee: builder.query({
      query: ({ quotation_id }) => ({
        url: `/quotations/${quotation_id}/discount-request`,
        method: "GET",
      }),
      providesTags: ["quotation"],
    }),
    emailSuggestions: builder.query({
      query: ({ q = "" } = {}) => ({
        url: `/quotations/email-suggestions?q=${encodeURIComponent(q)}`,
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
  useRequestDiscountMutation,
  useGetDiscountRequestsQuery,
  useDecideDiscountRequestMutation,
  useRequestDiscountEmployeeQuery,
  useEmailSuggestionsQuery,
} = quotationApi;
