import Layout from "@/components/layout/Layout";
import CrmSetting from "@/components/manage/crm-setting/CrmSetting";
import usePermissions from "@/custom-hooks/permissions/usePermissions";
import React from "react";

const CrmSettingPage = () => {
  const { canView, ready } = usePermissions();

  return (
    <Layout>
      <div className="content">
        {ready && canView("crm_settings") && <CrmSetting />}
      </div>
    </Layout>
  );
};

export default CrmSettingPage;
