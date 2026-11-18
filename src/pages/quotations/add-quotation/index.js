import Layout from "@/components/layout/Layout";
import AddQuotationForm from "@/components/quotation/add-quotation-form/AddQuotationForm";
import usePermissions from "@/custom-hooks/permissions/usePermissions";
import React from "react";

const AddQuotation = () => {
  const { canAdd } = usePermissions();
  const canCreateQuotation =
    canAdd("quotations") || canAdd("create_quotations");

  return (
    <Layout>
      {canCreateQuotation && <AddQuotationForm />}
    </Layout>
  );
};

export default AddQuotation