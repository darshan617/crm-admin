import Layout from "@/components/layout/Layout";
import Quotation from "@/components/quotation/Quotation";
import usePermissions from "@/custom-hooks/permissions/usePermissions";
import React from "react";

const quotationPage = () => {
  const { canView } = usePermissions();

  return (
    <Layout>
      {canView("quotations") && <Quotation />}
    </Layout>
  );
};

export default quotationPage;
