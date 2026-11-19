import Layout from "@/components/layout/Layout";
import AllLeads from "@/components/leads/all-leads/AllLeads";
import LeadSummary from "@/components/leads/lead-summary/LeadSummary";
import { useGetAllLeadsQuery } from "@/redux/apis/leadsApi";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import usePermissions from "@/custom-hooks/permissions/usePermissions";

const index = () => {
  const router = useRouter();
  const { canView } = usePermissions();
  const canSeeLeads =
    canView("leads") || canView("jd_leads") || canView("exhibition_leads");
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");
  const leadType = router?.query?.type;
  const page = Math.max(1, Number(router.query?.page_no) || 1);
  const previousType = useRef(null);

  const setPage = (nextPage, options) => {
    if (!router.isReady) return;

    const pageNumber = Math.max(1, Number(nextPage) || 1);
    const current = Math.max(1, Number(router.query?.page_no) || 1);

    if (pageNumber === current && router.query?.page_no) return;

    const navigate = options?.replace ? router.replace : router.push;

    navigate(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          page_no: String(pageNumber),
        },
      },
      undefined,
      { shallow: true, scroll: false },
    );
  };

  useEffect(() => {
    if (!router.isReady || !leadType) return;

    if (!router.query.page_no) {
      router.replace(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            page_no: "1",
          },
        },
        undefined,
        { shallow: true, scroll: false },
      );
    }
  }, [router, leadType]);

  useEffect(() => {
    if (!leadType) return;

    if (previousType.current && previousType.current !== leadType) {
      setFilters({});
      setSearch("");
    }

    previousType.current = leadType;
  }, [leadType]);

  const { data: allLeadsListData } = useGetAllLeadsQuery(
    {
      source: leadType,
      page_no: page,
      items_per_page: router?.query?.items_per_page || 10,
      ...filters,
      search,
    },
    {
      skip: !leadType || !canSeeLeads,
    },
  );

  const handleFiltersChange = (nextFilters) => {
    setFilters(
      Object.fromEntries(
        Object.entries(nextFilters).filter(
          ([, value]) => value != null && value !== "",
        ),
      ),
    );
    setPage(1);
  };

  const handleSearch = (value) => {
    const next = String(value || "").trim();
    if (next === search) return;

    setSearch(next);
    setPage(1);
  };

  return (
    <Layout>
      <div className="content">
        {canSeeLeads && (
          <>
            <LeadSummary allLeadsListData={allLeadsListData} />
            <AllLeads
              allLeadsListData={allLeadsListData}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              page={page}
              onPageChange={setPage}
              search={search}
              onSearch={handleSearch}
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default index;
