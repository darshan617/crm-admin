import Layout from "@/components/layout/Layout";
import EmployeePerformance from "@/components/reports/employee-performance/EmployeePerformance";
import BusinessOverview from "@/components/reports/performance-overview/BusinessOverview";
import QuickInsights from "@/components/reports/quick-insights/QuickInsights";
import ReportCategory from "@/components/reports/report-category/ReportCategory";
import ReportSummary from "@/components/reports/report-summary/ReportSummary";
import usePermissions from "@/custom-hooks/permissions/usePermissions";
import React from "react";

const ReportsPage = () => {
  const { canView } = usePermissions();

  return (
    <Layout>
      <div className="content">
        {canView("reports") && (
          <>
            <ReportSummary />
            <BusinessOverview />
            <EmployeePerformance />
            <ReportCategory />
            <QuickInsights />
          </>
        )}
      </div>
    </Layout>
  );
};

export default ReportsPage;
