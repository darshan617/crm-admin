import Layout from "@/components/layout/Layout";
import AllLeads from "@/components/leads/all-leads/AllLeads";
import LeadSummary from "@/components/leads/lead-summary/LeadSummary";
import { useGetAllLeadsQuery } from "@/redux/apis/leadsApi";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const index = () => {
  const router = useRouter();
  const { data: allLeadsListData } = useGetAllLeadsQuery(
    {
      source: router?.query?.type,
    },
    {
      skip: !router?.query?.type,
    },
  );

  return (
    <Layout>
      <div className="content">
        <LeadSummary allLeadsListData={allLeadsListData} />
        <AllLeads allLeadsListData={allLeadsListData} />
      </div>
    </Layout>
  );
};

export default index;
