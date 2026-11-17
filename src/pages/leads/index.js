import Layout from "@/components/layout/Layout";
import AllLeads from "@/components/leads/all-leads/AllLeads";
import LeadSummary from "@/components/leads/lead-summary/LeadSummary";
import { useGetAllLeadsQuery } from "@/redux/apis/leadsApi";
import { useRouter } from "next/router";
import React from "react";
import usePermissions from "@/custom-hooks/permissions/usePermissions";

const index = () => {
  const router = useRouter();
  const { canView } = usePermissions();
  const canSeeLeads =
    canView("leads") || canView("jd_leads") || canView("exhibition_leads");
  const { data: allLeadsListData } = useGetAllLeadsQuery(
    {
      source: router?.query?.type,
      page_no: router?.query?.page_no || 1,
      items_per_page: router?.query?.items_per_page || 10,
    },
    {
      skip: !router?.query?.type || !canSeeLeads,
    },
  );

  return (
    <Layout>
      <div className="content">
        {canSeeLeads && (
          <>
            <LeadSummary allLeadsListData={allLeadsListData} />
            <AllLeads allLeadsListData={allLeadsListData} />
          </>
        )}
      </div>
    </Layout>
  );
};

export default index;
