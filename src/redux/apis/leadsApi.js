import { apiSlice } from "../apiSlice";

const leadsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllLeads: builder.query({
      query: ({
        source,
        page_no = 1,
        items_per_page = 10,
        ...filters
      } = {}) => {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
          if (value == null || value === "") return;
          params.set(key, String(value));
        });

        if (source) params.set("source", String(source));
        params.set("page_no", String(page_no));
        params.set("items_per_page", String(items_per_page));

        return {
          url: `/leads?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["leads"],
    }),
    getDdData: builder.query({
      query: () => ({
        url: "leads/create",
        method: "GET",
      }),
      providesTags: ["leads"],
    }),
    createLead: builder.mutation({
      query: ({ body }) => ({
        url: "/lead-create",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["leads"],
    }),
    getSingleLeadDeatils: builder.query({
      query: ({ lead_id }) => ({
        url: `/leads/${lead_id}`,
        method: "GET",
      }),
      providesTags: ["leads"],
    }),
    updateLead: builder.mutation({
      query: ({ body, lead_id }) => ({
        url: `/leads/${lead_id}/update`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["leads"],
    }),
    contactandServicePlanDelete: builder.mutation({
      query: ({ body, lead_id, id, type }) => ({
        url: `/leads/${lead_id}/${type}/${id}/delete`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["leads"],
    }),
    leadDocumentDelete: builder.mutation({
      query: ({ body, lead_id }) => ({
        url: `/leads/${lead_id}/documents/delete`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["leads"],
    }),
    uploadLeads: builder.mutation({
      query: ({ body }) => ({
        url: "/leads/upload",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["leads"],
    }),
    previewLeadsUpload: builder.mutation({
      query: ({ body }) => ({
        url: "/leads/uploads/preview",
        method: "POST",
        body,
      }),
    }),
    confirmLeadsUpload: builder.mutation({
      query: ({ body }) => ({
        url: "/leads/uploads/confirm",
        method: "POST",
        body,
      }),
      invalidatesTags: ["leads"],
    }),
    checkLeadDomain: builder.query({
      query: ({ domain }) => ({
        url: `/leads/check-domain?domain=${domain}`,
        method: "GET",
      }),
      providesTags: ["quotation"],
    }),
    checkGst: builder.mutation({
      query: ({ body }) => ({
        url: "/quotations/gstin",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["leads"],
    }),
    getCountryStateCity: builder.query({
      query: ({ country, state, city } = {}) => {
        const params = new URLSearchParams();
        if (country) params.set("country", country);
        if (state) params.set("state", state);
        if (city) params.set("city", city);
        const query = params.toString();

        return {
          url: query ? `/locations?${query}` : "/locations",
          method: "GET",
        };
      },
      providesTags: ["leads"],
    }),
  }),
});

export const locationNames = (payload, key) => {
  const list = payload?.data?.[key];
  if (!Array.isArray(list)) return [];

  return list
    .map((item) =>
      typeof item === "string" ? item : item?.name || item?.label || "",
    )
    .map((name) => name.trim())
    .filter(Boolean);
};

export const normalizedLocation = (payload) => {
  const data = payload?.data ?? {};
  const labeled =
    data.label && typeof data.label === "object" ? data.label : null;
  const source =
    (data.normalized && typeof data.normalized === "object" && data.normalized) ||
    labeled ||
    data;
  const name = (value) =>
    (typeof value === "string" ? value : value?.name || value?.label || "").trim();

  return {
    valid: payload?.success !== false && data.valid !== false,
    country: name(source.country),
    state: name(source.state),
    city: name(source.city),
    label:
      (typeof source.label === "string" && source.label.trim()) ||
      (typeof data.label === "string" && data.label.trim()) ||
      "",
    message: payload?.message || data.message || "",
  };
};

export const {
  useGetAllLeadsQuery,
  useGetDdDataQuery,
  useCreateLeadMutation,
  useGetSingleLeadDeatilsQuery,
  useUpdateLeadMutation,
  useContactandServicePlanDeleteMutation,
  useLeadDocumentDeleteMutation,
  useUploadLeadsMutation,
  usePreviewLeadsUploadMutation,
  useConfirmLeadsUploadMutation,
  useCheckLeadDomainQuery,
  useCheckGstMutation,
  useGetCountryStateCityQuery,
} = leadsApi;
