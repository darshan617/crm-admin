import { apiSlice } from "../apiSlice";

const crmDeals = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    crmDeals: builder.query({
      query: ({
        search = "",
        status = "",
        deal_type = "",
        assigned_to = "",
        po_status = "",
        date_type = "",
        from = "",
        to = "",
        sort = "",
        sort_dir = "",
        page_no = 1,
        item_per_page = 10,
      } = {}) => {
        const params = new URLSearchParams();

        Object.entries({
          search,
          status,
          deal_type,
          assigned_to,
          po_status,
          date_type,
          from,
          to,
          sort,
          sort_dir,
          page_no,
          item_per_page,
        }).forEach(([key, value]) => {
          if (value == null || value === "") return;
          params.set(key, String(value));
        });

        return {
          url: `/deals?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["crmDeals"],
    }),

    crmDealsDetails: builder.query({
      query: ({ id }) => ({
        url: `/deals/${id}`,
        method: "GET",
      }),
      providesTags: ["crmDeals"],
    }),

    DealsPoSource: builder.mutation({
      query: ({ body, id }) => ({
        url: `/deals/${id}/po`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["crmDeals"],
    }),
    DealsActivate: builder.mutation({
      query: ({ body, id }) => ({
        url: `/deals/${id}/activate`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["crmDeals"],
    }),
    sendDealInvoice: builder.mutation({
      query: ({ body }) => ({
        url: `/deals/send-invoice`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["crmDeals"],
    }),
    updateDealPaymentStatus: builder.mutation({
      query: ({ body }) => ({
        url: `/deals/payment-status`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["crmDeals"],
    }),
    monthlyTarget: builder.query({
      query: () => ({
        url: `/monthly-target`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCrmDealsQuery,
  useCrmDealsDetailsQuery,
  useDealsPoSourceMutation,
  useDealsActivateMutation,
  useSendDealInvoiceMutation,
  useUpdateDealPaymentStatusMutation,
  useMonthlyTargetQuery,
} = crmDeals;
