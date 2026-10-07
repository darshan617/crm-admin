import Layout from "@/components/layout/Layout";
import AllLeads from "@/components/leads/all-leads/AllLeads";
import LeadSummary from "@/components/leads/lead-summary/LeadSummary";
import React from "react";

const index = () => {
  return (
    <Layout>
      <div className="content">
        <LeadSummary />
        <AllLeads />
      </div>  
    </Layout>
  );
};

export default index;
