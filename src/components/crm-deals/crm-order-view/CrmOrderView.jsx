"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiCheck, FiFile, FiFilePlus, FiFileText } from "react-icons/fi";
import styles from "@/components/crm-deals/crm-order-view/CrmOrderView.module.css";
import { useCrmDealsDetailsQuery } from "@/redux/apis/crmDeals";

const CrmOrderView = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [poMode, setPoMode] = useState("generated");

  const { data, isLoading, isFetching, isError, refetch } =
    useCrmDealsDetailsQuery({ id: slug }, { skip: !router.isReady || !slug });

  const details = data?.data;
  const deal = details?.deal ?? {};
  const order = details?.order ?? {};
  const items = details?.items ?? [];
  const po = details?.po ?? {};
  const poJourney = details?.po_journey ?? [];

  const billingCycles = details?.billing_cycle_options ?? [];

  const canActivate = details?.can_activate ?? false;
  const converted = details?.converted ?? false;
  const actionLabel = details?.action_label || "Activate";

  const defaultCycle = details?.default_cycle || "";
  const defaultStart = details?.default_start || "";

  const handleActivate = (e) => {
    e.preventDefault();

    if (!confirm("Activate this order?")) return;

    const formData = new FormData(e.currentTarget);
    console.log(Object.fromEntries(formData));
  };

  const handlePoSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    console.log(Object.fromEntries(formData));
  };

  if (!router.isReady || isLoading || isFetching) {
    return <div className="content">Loading deal details...</div>;
  }

  if (isError) {
    return (
      <div className="content">
        <p>Failed to load deal details.</p>
        <button type="button" onClick={() => refetch()}>
          Try Again
        </button>
      </div>
    );
  }

  if (!details?.deal) {
    return <div className="content">Deal not found.</div>;
  }

  return (
    <div className={`${styles.page} container mt-4`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Order preview</h1>

          <div className={styles.crumbs}>
            <Link href="/crm-deals">CRM Deals</Link>
            <span>›</span>
            <span>#{order.order_no || "Preview"}</span>
          </div>
        </div>

        <Link href="/crm-deals" className="back-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </Link>
      </div>

      {/* Order Summary */}
      <section className={styles.card}>
        <div className={styles.orderTitle}>
          <h2>Order #{order.order_no || "Preview"}</h2>

          {!converted && (
            <span className={styles.badgeWarn}>
              {order.status_label || "Not activated"}
            </span>
          )}

          <span className={styles.badgeMuted}>CRM</span>
        </div>

        <div className={styles.meta}>
          Created {deal.created_at || "-"}
          <span> · </span>
          Quote {deal.quotation_no || "-"}
        </div>

        <form onSubmit={handleActivate} className={styles.actions}>
          {canActivate && (
            <>
              <label className={styles.fieldLabel} htmlFor="start_date">
                Start Date
              </label>

              <input
                type="date"
                name="start_date"
                id="start_date"
                className={`${styles.control} ${styles.dateInput}`}
                defaultValue={defaultStart}
                required
              />

              <label className={styles.fieldLabel} htmlFor="billing_cycle">
                Billing Cycle
              </label>

              <select
                name="billing_cycle"
                id="billing_cycle"
                className={`${styles.control} ${styles.select}`}
                defaultValue={defaultCycle}
              >
                {billingCycles.map((cycle) => (
                  <option key={cycle} value={cycle}>
                    {cycle}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className={`${styles.btn} ${styles.btnGreen}`}
              >
                <FiCheck />
                {actionLabel}
              </button>
            </>
          )}

          <Link
            href={`/quotations/${deal.id}`}
            className={`${styles.btn} ${styles.btnOutline}`}
          >
            <FiFileText />
            View Quotation
          </Link>

          <Link
            href={`/quotations/${deal.id}`}
            target="_blank"
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            <FiFile />
            View Invoice
          </Link>
        </form>
      </section>

      {/* Order Details */}
      <section className={styles.card}>
        <div className={styles.details}>
          {[
            ["Order Type", deal.deal_type_label || "-"],
            ["Plan", order.plan_name || deal.plan_name || "-"],
            ["Domain", order.domain_name || deal.domain_name || "-"],
            ["Order", `#${order.order_no || "Preview"}`],
            ["Type", deal.deal_type || "-"],
            ["Billing Cycle", order.period || deal.quotation_period || "-"],
            ["Start Date", converted ? defaultStart : "—"],
            ["Next Renewal", deal.next_renewal || "—"],
            [
              "Amount",
              `₹${Number(order.total_amount ?? deal.total_amount ?? 0).toLocaleString("en-IN")}`,
            ],
            ["Employee", order.employee || deal.assigned_to || "-"],
          ].map(([label, value]) => (
            <div key={label}>
              <div className={styles.label}>{label}</div>
              <div className={styles.value}>{value}</div>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.split}>
        {/* Customer */}
        <section className={styles.card}>
          <h3 className={styles.sectionTitle}>Customer</h3>

          <div className={styles.customerName}>
            {order.customer_name || deal.name || "-"}
          </div>

          <div className={styles.customerCompany}>
            {order.company_name || deal.company_name || "-"}
          </div>

          <div className={styles.customerGrid}>
            <div>
              <div className={styles.label}>Email</div>
              <div className={styles.customerValue}>
                {order.email || deal.email || "-"}
              </div>
            </div>

            <div>
              <div className={styles.label}>Mobile</div>
              <div className={styles.customerValue}>{deal.mobile || "-"}</div>
            </div>

            <div>
              <div className={styles.label}>Company</div>
              <div className={styles.customerValue}>
                {deal.legal_name || deal.company_name || "-"}
              </div>
            </div>

            <div>
              <div className={styles.label}>GSTIN</div>
              <div className={styles.customerValue}>{deal.gstin || "-"}</div>
            </div>

            <div className={styles.span2}>
              <div className={styles.label}>Billing address</div>
              <div className={styles.customerValue}>{deal.address || "-"}</div>
            </div>
          </div>
        </section>

        {/* Order Items */}
        <section className={styles.card}>
          <h3 className={styles.sectionTitle}>Order Items</h3>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td className={styles.muted}>{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>₹{Number(item.unit_price).toLocaleString("en-IN")}</td>
                    <td>₹{Number(item.total).toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.total}>
            <div>
              <div className={styles.label}>Grand total</div>
              <div className={styles.totalAmount}>
                ₹
                {Number(
                  order.total_amount ?? deal.total_amount ?? 0,
                ).toLocaleString("en-IN")}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* PO Journey */}
      <section className={styles.card}>
        <h3 className={styles.sectionTitle}>PO Journey</h3>

        <div className={styles.stepper}>
          <div className={styles.stepperLine} />

          <div className={styles.steps}>
            {poJourney.map((step, index) => (
              <div className={styles.step} key={index}>
                <span className={styles.dot} />
                <div className={styles.stepLabel}>{step.label}</div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handlePoSubmit}>
          <label className={styles.sourceLabel}>PO Source</label>

          <div className={styles.radios}>
            <label className={styles.radio} htmlFor="po_mode_generated">
              <input
                type="radio"
                name="po_mode"
                id="po_mode_generated"
                value="generated"
                checked={poMode === "generated"}
                onChange={(e) => setPoMode(e.target.value)}
              />
              Generate PO
            </label>

            <label className={styles.radio} htmlFor="po_mode_uploaded">
              <input
                type="radio"
                name="po_mode"
                id="po_mode_uploaded"
                value="uploaded"
                checked={poMode === "uploaded"}
                onChange={(e) => setPoMode(e.target.value)}
              />
              Upload PO (CRM / SAP)
            </label>
          </div>

          <small className={styles.hint}>
            Companies using their own CRM/SAP PO can upload a PDF instead of our
            format.
          </small>

          {poMode === "uploaded" && (
            <div className={styles.uploadGrid}>
              <div>
                <label htmlFor="po_number">External PO Number</label>
                <input
                  id="po_number"
                  type="text"
                  name="po_number"
                  className={styles.control}
                  placeholder="From CRM / SAP"
                  defaultValue={po.po_number || ""}
                />
              </div>

              <div>
                <label htmlFor="po_date">PO Date</label>
                <input
                  id="po_date"
                  type="date"
                  name="po_date"
                  className={styles.control}
                  defaultValue={po.po_date || ""}
                />
              </div>

              <div>
                <label htmlFor="po_document">Upload PO PDF</label>
                <input
                  id="po_document"
                  type="file"
                  name="po_document"
                  className={`${styles.control} ${styles.fileInput}`}
                  accept="application/pdf,.pdf"
                />
              </div>
            </div>
          )}

          <div className={styles.submitRow}>
            <button
              type="submit"
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              <FiFilePlus />
              {poMode === "generated" ? "Generate PO" : "Upload PO"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default CrmOrderView;
