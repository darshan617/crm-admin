import DiscountApproval from "@/components/discount-approval/DiscountApproval";
import Layout from "@/components/layout/Layout";
import usePermissions from "@/custom-hooks/permissions/usePermissions";
import React from "react";

const DiscountApprovalPage = () => {
  const { canView } = usePermissions();

  return (
    <Layout>
      {canView("discount_approval") && <DiscountApproval />}
    </Layout>
  );
};

export default DiscountApprovalPage;
