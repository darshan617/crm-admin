import React, { useState } from "react";
import AccountSummary from "@/components/dashboard/account-summary/AccountSummary";
import PendingApproval from "@/components/dashboard/pending-approval/PendingApproval";
import TeamPerformance from "@/components/dashboard/team-performance/TeamPerformance";
import Layout from "@/components/layout/Layout";
import usePermissions from "@/custom-hooks/permissions/usePermissions";
import { useDashboardQuery } from "@/redux/apis/dashboardApi";

const Dashboard = () => {
  const { canView } = usePermissions();
  const [filters, setFilters] = useState({ period: "7d", from: "", to: "" });
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value),
  );

  const { data: dashboardResponse } = useDashboardQuery(params);

  const dashboardData = dashboardResponse?.data;

  const periodOptions = dashboardData?.filters?.period_options ?? [];
  const defaultRange = {
    from: dashboardData?.filters?.from || "",
    to: dashboardData?.filters?.to || "",
  };

  const handlePeriodChange = (period) => {
    setFilters({ period, from: "", to: "" });
  };

  const handleRangeChange = ({ from, to }) => {
    setFilters({ period: "", from, to });
  };

  const showDashboard = canView("dashboard");

  return (
    <Layout>
      <div className="content">
        {showDashboard && (
          <>
            <AccountSummary
              summary={dashboardData?.summary}
              user={dashboardData?.user}
              filters={filters}
              defaultRange={defaultRange}
              onRangeChange={handleRangeChange}
            />

            <TeamPerformance
              team={dashboardData?.team}
              filters={filters}
              periodOptions={periodOptions}
              onPeriodChange={handlePeriodChange}
            />

            <PendingApproval
              summary={dashboardData?.summary}
              recentActivities={dashboardData?.recent_activities}
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
