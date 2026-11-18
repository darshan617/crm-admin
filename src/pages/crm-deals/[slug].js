import CrmOrderView from "@/components/crm-deals/crm-order-view/CrmOrderView";
import Layout from "@/components/layout/Layout";
import usePermissions from "@/custom-hooks/permissions/usePermissions";
import React from "react";

const CrmView = () => {
  const { canView } = usePermissions();

  return (
    <Layout>
      {canView("crm_deals") && <CrmOrderView />}
    </Layout>
  );
};

export default CrmView;
