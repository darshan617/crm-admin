import Layout from "@/components/layout/Layout";
import UpdateQuotationForm from "@/components/quotation/update-quotation-form/UpdateQuotationForm";
import usePermissions from "@/custom-hooks/permissions/usePermissions";
import React from "react";

const UpdateQuotation = () => {
  const { canEdit } = usePermissions();

  return (
    <Layout>
      {canEdit("quotations") && <UpdateQuotationForm />}
    </Layout>
  );
};

export default UpdateQuotation;
