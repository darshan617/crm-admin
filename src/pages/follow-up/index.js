import FollowUp from "@/components/follow-up/FollowUp";
import Layout from "@/components/layout/Layout";
import usePermissions from "@/custom-hooks/permissions/usePermissions";
import React from "react";

const FollowUpPage = () => {
  const { canView } = usePermissions();

  return (
    <Layout>
      {canView("follow_ups") && <FollowUp />}
    </Layout>
  );
};

export default FollowUpPage;
