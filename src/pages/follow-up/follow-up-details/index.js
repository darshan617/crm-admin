import FollowUpDetails from "@/components/follow-up/follow-up-details/FollowUpDetails";
import Layout from "@/components/layout/Layout";
import usePermissions from "@/custom-hooks/permissions/usePermissions";
import React from "react";

const FollowUpDetailsPage = () => {
  const { canView } = usePermissions();

  return (
    <Layout>
      {canView("follow_ups") && <FollowUpDetails />}
    </Layout>
  );
};

export default FollowUpDetailsPage;
