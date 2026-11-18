import UploaadLeads from '@/components/dashboard/upload-leads/UploaadLeads'
import Layout from '@/components/layout/Layout'
import usePermissions from '@/custom-hooks/permissions/usePermissions'
import React from 'react'

const UploadLeadsPage = () => {
  const { canAdd } = usePermissions();

  return (
    <Layout>
        {canAdd("import_leads") && <UploaadLeads />}
    </Layout>
  )
}

export default UploadLeadsPage