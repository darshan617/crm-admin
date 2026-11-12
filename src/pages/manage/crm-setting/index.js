import Layout from "@/components/layout/Layout";
import CrmSetting from "@/components/manage/crm-setting/CrmSetting";
import React from "react";

const CrmSettingPage = () => {
  return (
    <Layout>
      <div className="content">
        <CrmSetting />
      </div>
    </Layout>
  );
};

export default CrmSettingPage;
