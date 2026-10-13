import AccountSummary from "@/components/dashboard/account-summary/AccountSummary";
import PendingApproval from "@/components/dashboard/pending-approval/PendingApproval";
import TeamPerformance from "@/components/dashboard/team-performance/TeamPerformance";
import Layout from "@/components/layout/Layout";
import React from "react";
import { useDashboardQuery } from "@/redux/apis/dashboardApi";

const Dashboard = () => {
  const { data: dashboardResponse } = useDashboardQuery();

  const dashboardData = dashboardResponse?.data;

  return (
    <Layout>
      <div className="content">
        <AccountSummary
          summary={dashboardData?.summary}
          user={dashboardData?.user}
        />
        <TeamPerformance team={dashboardData?.team} />
        <PendingApproval
          summary={dashboardData?.summary}
          recentActivities={dashboardData?.recent_activities}
        />
      </div>
    </Layout>
  );
};

export default Dashboard;