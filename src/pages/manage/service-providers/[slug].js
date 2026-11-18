import Layout from "@/components/layout/Layout";
import ProviderPlan from "@/components/manage/service-provider/provider-plans/ProviderPlan";
import usePermissions from "@/custom-hooks/permissions/usePermissions";
import React from "react";

const Providers = () => {
  const { canView, ready } = usePermissions();

  return (
    <Layout>
      {ready && canView("services_providers") && <ProviderPlan />}
    </Layout>
  );
};

export default Providers