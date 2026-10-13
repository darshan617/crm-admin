import Layout from "@/components/layout/Layout";
import LeadsDetails from "@/components/leads/leads-details/LeadsDetails";
import React from "react";

const LeadsDetailPage = () => {
  return (
    <Layout>
      <div className="content">
        <LeadsDetails />
      </div>
    </Layout>
  );
};

export default LeadsDetailPage;
