"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import styles from "@/components/crm-deals/CrmDeals.module.css";
import { IoEyeOutline, IoSearch } from "react-icons/io5";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useCrmDealsQuery } from "@/redux/apis/crmDeals";

export default function CrmDeals() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const page = Number(router.query.page) || 1;

  const { data, isLoading, isError } = useCrmDealsQuery({
    page,
    search,
  });

  const deals = data?.data?.deals ?? [];
  const pagination = data?.data?.pagination;

  const currentPage = pagination?.current_page || 1;
  const lastPage = pagination?.last_page || 1;
  const total = pagination?.total ?? deals.length;

  return (
    <section className="content">
      <div className="page-header">
        <div>
          <div className="breadcrumb welcome-text">
            <p>
              <Link href="/crm/dashboard">Dashboard</Link>
              <span>/</span> CRM Deals
            </p>
          </div>
          <h2>CRM Deals</h2>
        </div>
      </div>

      <section className="common-table-section crm-quo-list">
        <div className="common-table-card">
          <div className="common-table-header crm-quo-header">
            <div className="crm-quo-title">
              <p>
                Showing <strong>{total}</strong> deals
              </p>
            </div>

            <form
              className="table-search"
              onSubmit={(e) => {
                e.preventDefault();
                router.push("/crm/deals?page=1");
              }}
            >
              <input
                type="text"
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search company, quote, employee"
                autoComplete="off"
              />
              <IoSearch />
            </form>
          </div>

          <table className="crm-quo-table">
            <thead>
              <tr className="table-head">
                <td className="order-id">Id</td>
                <td className="order-id">Contact Information</td>
                <td className="order-id">Plan</td>
                <td className="status-col">Status</td>
                <td className="status-col">Assigned To</td>
              </tr>
            </thead>

            <tbody className="table-body">
              {isLoading ? (
                <tr>
                  <td colSpan={5}>Loading...</td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5}>Failed to load deals.</td>
                </tr>
              ) : deals.length === 0 ? (
                <tr>
                  <td colSpan={5}>No deals found.</td>
                </tr>
              ) : (
                deals.map((deal) => (
                  <tr className="crm-quo-row table-row" key={deal?.id}>
                    <td className="order-id" data-label="Id">
                      <Link
                        href={`/crm/quotations/${deal?.id}`}
                        className="quotation-id"
                      >
                        {deal?.quotation_no}
                      </Link>
                    </td>

                    <td className="customer" data-label="Contact">
                      <div className="avatar blue">
                        {deal?.company_name?.charAt(0)}
                      </div>

                      <div>
                        <h5>{deal?.company_name}</h5>
                        <p>
                          {deal?.name} · Deal #{deal?.id}
                        </p>
                      </div>
                    </td>

                    <td className="plan-info" data-label="Plan">
                      <div className="plan-icon">
                        <img
                          src="https://img.icons8.com/color/48/microsoft.png"
                          alt="Plan"
                        />
                      </div>

                      <div>
                        <h5>{deal?.plan_name}</h5>

                        <p className="plan-meta">
                          <span>{deal?.deal_type_label}</span>
                          <span>{deal?.quantity} Licenses</span>
                          <span>{deal?.quotation_period}</span>
                          <span>
                            ₹{" "}
                            {Number(deal?.total_amount).toLocaleString("en-IN")}
                          </span>
                        </p>
                      </div>
                    </td>

                    <td className="status-col" data-label="Status">
                      <span className="badge approved">
                        {deal?.crm_order_no}
                      </span>
                    </td>

                    <td className="plan-action" data-label="Assigned To">
                      <div className={styles.assignedUser}>
                        <div className="user-info">
                          <div className={styles.avatarFlex}>
                            <div className="mini-avatar primary">
                              {deal?.assigned_to?.charAt(0)}
                            </div>

                            <h5>{deal?.assigned_to}</h5>
                          </div>

                          <small>Added {deal?.created_at}</small>
                        </div>

                        <div className="actions">
                          <Link
                            href={`/crm-deals/${deal?.id}`}
                            className="action-btn"
                            title="View order"
                          >
                            <IoEyeOutline />
                          </Link>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="table-pagination">
            <button
              type="button"
              className="page-btn"
              disabled={currentPage === 1}
              onClick={() => router.push(`/crm/deals?page=${currentPage - 1}`)}
            >
              <LuChevronLeft />
            </button>

            {Array.from({ length: lastPage }, (_, index) => index + 1).map(
              (pageNumber) => (
                <Link
                  key={pageNumber}
                  href={`/crm/deals?page=${pageNumber}`}
                  className={`page-btn ${
                    currentPage === pageNumber ? "active" : ""
                  }`}
                >
                  {pageNumber}
                </Link>
              ),
            )}

            <button
              type="button"
              className="page-btn"
              disabled={currentPage === lastPage}
              onClick={() => router.push(`/crm/deals?page=${currentPage + 1}`)}
            >
              <LuChevronRight />
            </button>
          </div>
        </div>
      </section>
    </section>
  );
}
