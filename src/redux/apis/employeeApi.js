import { apiSlice } from "../apiSlice";

const employeeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query({
      query: ({
        search = "",
        status = "",
        role = "",
        from = "",
        to = "",
        page = 1,
      }) => {
        const params = new URLSearchParams();

        if (search) params.set("search", search);
        if (status) params.set("status", status);
        if (role) params.set("role", role);
        if (from) params.set("from", from);
        if (to) params.set("to", to);
        params.set("page", String(page));

        return {
          url: `/employees?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["employees"],
    }),
    createEmployee: builder.mutation({
      query: ({ body }) => ({
        url: "/employees/create",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["employees"],
    }),
  }),
});

export const { useGetEmployeesQuery, useCreateEmployeeMutation } = employeeApi;
