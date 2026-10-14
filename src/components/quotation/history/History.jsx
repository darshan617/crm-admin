import { useRouter } from "next/router";
import React, { useState } from "react";
import styles from "@/components/quotation/history/History.module.css";
const History = () => {
  const router = useRouter();

  const [status, setStatus] = useState('shared');

  return (
    <main className="content">
      <div className="page-header">
        <div>
          <div className="breadcrumb welcome-text">
            <p>
              <a href="/dashboard">Dashboard</a>
              <span>/</span>
              <a href="quotations">Quotations</a>
              <span>/</span>
              <a href="/hquotations">TCCPLQ00043A-B</a>
            </p>
          </div>
          <h2>Send &amp; approval history</h2>
        </div>
        <div className="back">
          <a onClick={() => router.back()} className="back-btn">
            <span>Back</span>
          </a>
        </div>
      </div>

      <div className={styles.quoActivityPage}>
        <div className={styles.statsGrid}>
          <div className={`${styles.summaryCard} rpt-kpi tone-teal`}>
            <p>Quotation sent to</p>
            <h3>0</h3>
            <small>johnn@example.com</small>
          </div>
          <div className={`${styles.summaryCard} rpt-kpi tone-green`}>
            <p>Quotation first approval</p>
            <h3>Pending</h3>
            <small>Waiting for customer</small>
          </div>
          <div className={`${styles.summaryCard} rpt-kpi tone-purple`}>
            <p>Invoice sent to</p>
            <h3>0</h3>
            <small>Not sent yet</small>
          </div>
          <div className={`${styles.summaryCard} rpt-kpi tone-orange`}>
            <p>Invoice approved by</p>
            <h3>Pending</h3>
            <small>Waiting for invoice response</small>
          </div>
        </div>

        <section className="common-table-section">
          <div className="common-table-card rpt-card">
            <div className="common-table-header">
              <div>
                <h3>Timeline</h3>
                <p className="rpt-sub">
                  Who received the mail and who responded, in order
                </p>
              </div>
            </div>
            <ol className={styles.quoActivityTimeline}>
              <li className="tone-blue">
                <h4>Quotation created</h4>
                <p>Created for johnn@example.com</p>
                <small>13 Oct 2026, 01:10 PM</small>
              </li>
            </ol>
          </div>
        </section>

        <section className="common-table-section">
          <div className="common-table-card rpt-card">
            <div className="common-table-header">
              <div>
                <h3>Update status</h3>
                <p className="rpt-sub">Manual override if needed</p>
              </div>
            </div>

            <form method="POST" action="/" className={styles.quotationTopMeta}>
              <input
                type="hidden"
                name="_token"
                value="3TeuxQV8i3ObQfpNsvBcGWpKBqUHzPbgeZMipeLr"
                autoComplete="off"
              />

              <div className={styles.qmetaField}>
                <span>Quotation</span>
                <select
                  name="quotation_status"
                  className={`quotation-status-select is-${status}`}
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                  }}
                >
                  <option value="not_shared">Not shared</option>
                  <option value="shared">Shared, approval pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className={styles.qmetaField}>
                <span>Invoice</span>
                <strong>—</strong>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
};

export default History;
