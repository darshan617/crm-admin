import Layout from "@/components/layout/Layout";
import QuotationDetail from "@/components/quotation/quotation-detail/QuotationDetail";
import usePermissions from "@/custom-hooks/permissions/usePermissions";
import React from "react";

const index = () => {
  const { canView } = usePermissions();

  return (
    <Layout>
      {canView("quotations") && <QuotationDetail />}
    </Layout>
  );
};

export default index