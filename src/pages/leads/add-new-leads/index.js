import Leads from '@/components/dashboard/leads/Leads'
import Layout from '@/components/layout/Layout'
import usePermissions from '@/custom-hooks/permissions/usePermissions'
import React from 'react'

const newLeads = () => {
  const { canAdd } = usePermissions();
  const canCreateLead =
    canAdd("leads") || canAdd("jd_leads") || canAdd("exhibition_leads");

  return (
    <Layout>
        {canCreateLead && <Leads />}
    </Layout>
  )
}

export default newLeads