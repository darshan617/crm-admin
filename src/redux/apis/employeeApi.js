import { apiSlice } from "../apiSlice";

const employeeApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getEmployees: builder.query({
      query: ({
        search = "",
        status = "",
        role = "",
        from = "",
        to = "",
        page = 1,
        perPage = "",
      }) => {
        const params = new URLSearchParams();

        if (search) params.set("search", search);
        if (status) params.set("status", status);
        if (role) params.set("role", role);
        if (from) params.set("from", from);
        if (to) params.set("to", to);
        if (perPage) params.set("per_page", String(perPage));
        params.set("page", String(page));

        return {
          url: `/employees?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["employees"],
    }),
    getEmployee: builder.query({
      query: ({ id }) => ({
        url: `/employees/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, { id }) => [{ type: "employees", id }],
    }),
    createEmployee: builder.mutation({
      query: ({ body }) => ({
        url: "/employees/create",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["employees"],
    }),
    updateEmployee: builder.mutation({
      query: ({ id, body }) => ({
        url: `/employees/${id}/update`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["employees"],
    }),
    getEmployeePermissions: builder.query({
      query: ({ type = "role", role = "", employeeId = "" }) => {
        const params = new URLSearchParams();

        params.set("type", type);
        params.set("role", role || "");
        params.set("employee_id", employeeId ? String(employeeId) : "");

        return {
          url: `/employees/permissions?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["employees"],
    }),
    saveEmployeePermissions: builder.mutation({
      query: ({ body }) => ({
        url: "/employees/permissions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["employees"],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useGetEmployeePermissionsQuery,
  useSaveEmployeePermissionsMutation,
} = employeeApi;
