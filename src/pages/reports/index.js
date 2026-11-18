import Layout from "@/components/layout/Layout";
import EmployeePerformance from "@/components/reports/employee-performance/EmployeePerformance";
import BusinessOverview from "@/components/reports/performance-overview/BusinessOverview";
import QuickInsights from "@/components/reports/quick-insights/QuickInsights";
import ReportCategory from "@/components/reports/report-category/ReportCategory";
import ReportSummary from "@/components/reports/report-summary/ReportSummary";
import usePermissions from "@/custom-hooks/permissions/usePermissions";
import React from "react";
import { useReportsQuery } from "@/redux/apis/reportsApi";

const ReportsPage = () => {
  const { data, isLoading, isError } = useReportsQuery();
  const report = data?.data;

  const { canView } = usePermissions();

  return (
    <Layout>
      <div className="content">
        {canView("reports") && (
          <>
            <ReportSummary data={report} isLoading={isLoading} isError={isError} />
            <BusinessOverview data={report} />
            <EmployeePerformance employees={report?.employees} />
            <ReportCategory categories={report?.categories} />
            <QuickInsights
          insights={report?.insights}
          forecast={report?.forecast}
        />
          </>
        )}
      </div>
    </Layout>
  );
};

export default ReportsPage;
