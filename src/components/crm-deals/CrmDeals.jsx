"use client";

import Link from "next/link";
import styles from "@/components/crm-deals/CrmDeals.module.css";
import { IoEyeOutline, IoSearch } from "react-icons/io5";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useCrmDealsQuery } from "@/redux/apis/crmDeals";

export default function CrmDeals() {
  const { data, isLoading, isError } = useCrmDealsQuery();

  const deals = data?.data?.deals ?? [];

  return (
    <section className="content">
      <div className="page-header">
        <div className="">
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
                Showing <strong>{deals.length}</strong> approved deals
              </p>
            </div>
            <form method="GET" action="/crm/deals" className="table-search">
              <input
                type="text"
                name="search"
                defaultValue=""
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
              {isLoading && (
                <tr>
                  <td colSpan={5}>Loading...</td>
                </tr>
              )}

              {isError && (
                <tr>
                  <td colSpan={5}>Failed to load deals.</td>
                </tr>
              )}

              {deals?.map((deal) => (
                <tr className="crm-quo-row table-row" key={deal.id}>
                  <td className="order-id" data-label="Id">
                    <Link
                      href={`/crm/quotations/${deal.id}`}
                      className="quotation-id"
                    >
                      {deal.quotation_id}
                    </Link>
                  </td>
                  <td className="customer" data-label="Contact">
                    <div className="avatar blue">
                      {deal.company_name?.charAt(0)}
                    </div>
                    <div>
                      <h5>{deal.company_name}</h5>
                      <p>
                        {deal.contact_name} · Lead #{deal.lead_id}
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
                      <h5>{deal.plan_name}</h5>
                      <p className="plan-meta">
                        <span>{deal.type}</span>
                        <span>{deal.licenses} Licenses</span>
                        <span>{deal.term}</span>
                        <span>₹ {deal.price}</span>
                      </p>
                    </div>
                  </td>
                  <td className="status-col" data-label="Status">
                    <span className="badge approved">{deal.crm_code}</span>
                  </td>
                  <td className="plan-action" data-label="Assigned To">
                    <div className={styles.assignedUser}>
                      <div className="user-info">
                        <div className={styles.avatarFlex}>
                          <div className="mini-avatar primary">
                            {deal.assigned_to_name?.charAt(0)}
                          </div>
                          <h5>{deal.assigned_to_name}</h5>
                        </div>
                        <small>Added {deal.created_at}</small>
                      </div>
                      <div className="actions">
                        <Link
                          href={`/crm/deals/${deal.id}/view`}
                          className="action-btn"
                          title="View order"
                        >
                          <IoEyeOutline />
                        </Link>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="table-pagination">
            <a href="#" className="page-btn">
              <LuChevronLeft />
            </a>
            <Link href="/crm/deals?page=1" className="page-btn active">
              1
            </Link>
            <a href="#" className="page-btn">
              <LuChevronRight />
            </a>
          </div>
        </div>
      </section>
    </section>
  );
}
