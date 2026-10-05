import AccountSummary from "@/components/dashboard/account-summary/AccountSummary";
import PendingApproval from "@/components/dashboard/pending-approval/PendingApproval";
import TeamPerformance from "@/components/dashboard/team-performance/TeamPerformance";
import Layout from "@/components/layout/Layout";
import React from "react";

const dashboard = () => {
  return <Layout>
    <div className="content">
    <AccountSummary />
    <TeamPerformance />
    <PendingApproval />
    </div>
  </Layout>;
};

export default dashboard;
