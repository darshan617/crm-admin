import Layout from "@/components/layout/Layout";
import LeadSourcesPage from "@/components/manage/crm-setting/CrmSetting";
import React from "react";

const crmSettingPage = () => {
  return (
    <Layout>
      <div className="content">
        <LeadSourcesPage />
      </div>
    </Layout>
  );
};

export default crmSettingPage;
