import CrmDeals from "@/components/crm-deals/CrmDeals";
import Layout from "@/components/layout/Layout";
import usePermissions from "@/custom-hooks/permissions/usePermissions";
import React from "react";

const CrmDealsPage = () => {
  const { canView } = usePermissions();

  return (
    <Layout>
      {canView("crm_deals") && <CrmDeals />}
    </Layout>
  );
};

export default CrmDealsPage;
