import Layout from "@/components/layout/Layout";
import History from "@/components/quotation/history/History";
import usePermissions from "@/custom-hooks/permissions/usePermissions";
import React from "react";

const HistoryPage = () => {
  const { canView } = usePermissions();

  return (
    <Layout>
      {canView("quotations") && <History />}
    </Layout>
  );
};

export default HistoryPage;
