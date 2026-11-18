import Layout from "@/components/layout/Layout";
import ServiceProvider from "@/components/manage/service-provider/ServiceProvider";
import usePermissions from "@/custom-hooks/permissions/usePermissions";
import React from "react";

const index = () => {
  const { canView, ready } = usePermissions();

  return (
    <Layout>
      {ready && canView("services_providers") && <ServiceProvider />}
    </Layout>
  );
};

export default index;
