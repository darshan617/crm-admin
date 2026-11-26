"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiCheck, FiFile, FiFilePlus, FiFileText } from "react-icons/fi";
import styles from "@/components/crm-deals/crm-order-view/CrmOrderView.module.css";
import {
  useCrmDealsDetailsQuery,
  useDealsActivateMutation,
  useDealsPoSourceMutation,
  useUpdateDealPaymentStatusMutation,
} from "@/redux/apis/crmDeals";
import { useToast } from "@/custom-hooks/toast/ToastProvider";
import usePermissions from "@/custom-hooks/permissions/usePermissions";

const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatAmount = (value) =>
  `₹${Number(value ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// Short alias used in the Order Items table and summary
const inr = formatAmount;

const CrmOrderView = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { showToast } = useToast();
  const { canView, canEdit, loginAs, ready } = usePermissions();
  const canSeeDeals = canView("crm_deals");
  const canEditDeal = canEdit("crm_deals");
  const canUpdatePaymentStatus =
    ready &&
    String(loginAs || "")
      .trim()
      .toLowerCase() === "account manager";

  const [poMode, setPoMode] = useState("generated");
  const [updatePaymentStatus, { isLoading: isPaymentStatusUpdating }] =
    useUpdateDealPaymentStatusMutation();

  const { data, isLoading, isError, refetch } = useCrmDealsDetailsQuery(
    { id: slug },
    { skip: !router.isReady || !slug || !canSeeDeals },
  );
  const [DealsPoSource, { isLoading: isPoSubmitting }] =
    useDealsPoSourceMutation();

  const [DealsActivate, { isLoading: isActivating }] =
    useDealsActivateMutation();

  const details = data?.data;
  const deal = details?.deal ?? {};
  const order = details?.order ?? {};
  const items = details?.items ?? [];
  const po = details?.po ?? {};
  const poJourney = details?.po_journey ?? [];
  const totals = details?.totals ?? {};
  const paymentStatus = String(
    order?.payment_status ?? deal?.payment_status ?? "pending",
  ).toLowerCase();
  const paymentStatusLabel =
    paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1);

  // Amounts for the Order Items summary (rename fields to match your API)
  const discount = Number(order.discount_amount ?? 0);
  const cgst = Number(order.cgst_amount ?? 0);
  const sgst = Number(order.sgst_amount ?? 0);

  const billingCycles = details?.billing_cycle_options ?? [];

  const canActivate = details?.can_activate ?? false;
  const converted = details?.converted ?? false;
  const actionLabel = details?.action_label || "Activate";

  const defaultCycle = details?.default_cycle || "";
  const defaultStart = details?.default_start || "";

  const hasPo = Boolean(po?.id || po?.po_number || po?.po_mode || po?.mode);
  const savedPoMode = po?.po_mode || po?.mode || "";
  const poDocumentUrl = po?.po_url || "/";

  const handleActivate = async (e) => {
    e.preventDefault();
    if (!canEditDeal) return;

    const formData = new FormData(e.currentTarget);

    const body = {
      start_date: formData.get("start_date"),
      billing_cycle: formData.get("billing_cycle"),
    };

    try {
      const response = await DealsActivate({ id: slug, body }).unwrap();
      if (response?.success) {
        showToast(response?.message);
        refetch();
      }
      console.log(response);
    } catch (error) {
      showToast(error?.data?.message, "error");
    }
  };

  const handlePoSubmit = async (e) => {
    e.preventDefault();
    if (!canEditDeal) return;

    const form = e.currentTarget;
    const formValues = new FormData(form);

    const poNumber = String(formValues.get("po_number") || "").trim();
    const poDate = formValues.get("po_date");
    const poDocument = formValues.get("po_document");

    if (!poDate) {
      showToast("Please select the PO date.", "error");
      return;
    }

    if (poMode === "uploaded" && !poDocument?.name) {
      showToast("Please upload the PO PDF.", "error");
      return;
    }

    const body = new FormData();
    body.append("po_mode", poMode);
    body.append("po_number", poNumber);
    body.append("po_date", poDate);

    if (poMode === "uploaded") {
      body.append("po_document", poDocument);
    }

    try {
      const response = await DealsPoSource({
        id: slug,
        body,
      }).unwrap();

      showToast(response?.message);

      form.reset();
      setPoMode("generated");
      refetch();
    } catch (error) {
      showToast(error?.data?.message);
    }
  };

  const handlePaymentStatusSubmit = async (e) => {
    e.preventDefault();
    if (!canUpdatePaymentStatus) return;

    const formData = new FormData(e.currentTarget);
    const nextStatus = String(
      formData.get("payment_status") || "",
    ).toLowerCase();

    if (!["pending", "paid"].includes(nextStatus)) {
      showToast("Please select a valid payment status.", "error");
      return;
    }

    try {
      const response = await updatePaymentStatus({
        body: {
          deal_id: Number(deal?.id || slug),
          payment_status: nextStatus,
        },
      }).unwrap();

      if (response?.success === false || response?.status === false) {
        showToast(
          response?.message || "Failed to update payment status.",
          "error",
        );
        return;
      }

      showToast(response?.message || "Payment status updated successfully.");
      refetch();
    } catch (error) {
      showToast(
        error?.data?.message ||
          error?.message ||
          "Failed to update payment status.",
        "error",
      );
    }
  };

  // isFetching is intentionally not used here, so the page doesn't
  // unmount while refetch() runs after a successful PO submit.
  if (!canSeeDeals) return null;

  if (!router.isReady || isLoading) {
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
          <div className="d-flex gap-2">
            <h2>Order #{order.order_no || "Preview"}</h2>

            {converted && (
              <span className={styles.badgeWarn}>
                {order?.status_label || "Not activated"}
              </span>
            )}

            <span className={styles.badgeMuted}>CRM</span>
          </div>
          <div className={styles.meta}>
            Created {deal?.created_at || "-"}
            <span> · </span>
            Quote {deal?.quotation_no || "-"}
          </div>
        </div>

        <div className={styles.summaryActions}>
          <form
            onSubmit={handleActivate}
            className={`${styles.actions} ${styles.orderActions}`}
          >
            {canActivate && canEditDeal && (
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
                  disabled={isActivating}
                  className={`${styles.btn} ${styles.btnGreen}`}
                >
                  <FiCheck />
                  {isActivating ? "Activating..." : actionLabel}
                </button>
              </>
            )}

            <div className={styles.documentActions}>
              {details?.links?.view_quotation && (
                <Link
                  href={details.links.view_quotation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.viewPoDocument} btn d-flex gap-1 align-items-center`}
                >
                  <FiFileText />
                  View Quotation
                </Link>
              )}

              {details?.links?.proforma_invoice_pdf_url && (
                <Link
                  href={details.links.proforma_invoice_pdf_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.viewInvoice} btn d-flex gap-1 align-items-center`}
                >
                  <FiFile />
                  View Proforma Invoice
                </Link>
              )}

              {details?.links?.tax_invoice_pdf_url && (
                <Link
                  href={details.links.tax_invoice_pdf_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.viewInvoice} btn d-flex gap-1 align-items-center`}
                >
                  <FiFile />
                  View Tax Invoice
                </Link>
              )}
            </div>
          </form>

          {canUpdatePaymentStatus && (
            <form
              onSubmit={handlePaymentStatusSubmit}
              className={`${styles.actions} ${styles.paymentActions}`}
            >
              <label className={styles.fieldLabel} htmlFor="payment_status">
                Payment Status
              </label>

              <select
                key={paymentStatus}
                name="payment_status"
                id="payment_status"
                className={`${styles.control} ${styles.select}`}
                defaultValue={paymentStatus}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>

              <button
                type="submit"
                disabled={isPaymentStatusUpdating}
                className={`${styles.btn} ${styles.btnPrimary}`}
              >
                {isPaymentStatusUpdating
                  ? "Updating..."
                  : "Update Payment Status"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Order Details */}
      <section className={styles.card1}>
        <div className={styles.details}>
          {[
            ["Order Type", deal.deal_type_label || "-"],
            ["Plan", order.plan_name || deal.plan_name || "-"],
            ["Domain", order.domain_name || deal.domain_name || "-"],
            ["Order", `#${order.order_no || "Preview"}`],
            ["Type", deal.deal_type || "-"],
            ["Billing Cycle", order.period || deal.quotation_period || "-"],
            ["Payment Status", paymentStatusLabel],
            ["Start Date", converted ? defaultStart : "—"],
            ["Next Renewal", deal.renewal_date || "—"],
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
        <section className={styles.card1}>
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
        <section className={styles.card1}>
          <h3 className={styles.sectionTitle}>Order Items</h3>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Description</th>
                  <th className={styles.end}>Qty</th>
                  <th className={styles.end}>Unit Price</th>
                  <th className={styles.end}>Total</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td className={styles.muted}>{item.description}</td>
                    <td className={styles.end}>{item.quantity}</td>
                    <td className={styles.end}>{inr(item.unit_price)}</td>
                    <td className={styles.end}>{inr(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.summaryWrap}>
            <div className={styles.summary}>
              <div className={styles.row}>
                <span className={styles.label}>Subtotal</span>
                <span>{inr(totals?.sub_total ?? 0)}</span>
              </div>

              {discount >= 0 && (
                <div className={styles.row}>
                  <span className={styles.label}>
                    Discount {totals?.discount_percent ?? 0}%
                  </span>
                  <span>- {inr(totals?.discount_amount ?? 0)}</span>
                </div>
              )}

              <div className={styles.row}>
                <span className={styles.label}>Taxable</span>
                <span>{inr(totals?.taxable_amount ?? 0)}</span>
              </div>

              {cgst >= 0 && (
                <div className={styles.row}>
                  <span className={styles.label}>CGST 9%</span>
                  <span>{inr(totals?.cgst_total ?? 0)}</span>
                </div>
              )}

              {sgst >= 0 && (
                <div className={styles.row}>
                  <span className={styles.label}>SGST 9%</span>
                  <span>{inr(totals?.sgst_total ?? 0)}</span>
                </div>
              )}

              <div className={styles.grandTotal}>
                <span className={styles.grandLabel}>Grand total</span>
                <span className={styles.grandAmount}>
                  {inr(totals?.grand_total ?? 0)}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* PO Journey */}
      <section className={styles.card1}>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <h6 className="mb-0">PO Journey</h6>

          {hasPo && (
            <a
              href={poDocumentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.viewPoDocument} btn d-flex`}
            >
              <FiFileText className="me-1 " /> View PO Document
            </a>
          )}
        </div>

        <div className="d-flex justify-content-center mb-4">
          <div className="position-relative w-100" style={{ maxWidth: 320 }}>
            <div
              className="position-absolute start-0 end-0"
              style={{ top: 12, height: 2, background: "#dee2e6" }}
            />

            <div className="d-flex justify-content-between position-relative">
              {poJourney.map((step, index) => {
                const isDone = Boolean(step?.done ?? step?.completed);

                return (
                  <div
                    className="text-center"
                    style={{ width: 90 }}
                    key={index}
                  >
                    <span
                      className={`${styles.odStepDot} ${
                        isDone ? styles.done : ""
                      }`}
                    >
                      {isDone ? "✓" : ""}
                    </span>
                    <div
                      className={`small mt-2 ${
                        isDone ? "fw-semibold" : "text-muted"
                      }`}
                    >
                      {step.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {hasPo ? (
          <div className="row g-3">
            <div className="col-6 col-md-3">
              <div className={styles.label}>PO Mode</div>
              <div className={styles.value}>
                <span className="badge bg-secondary">
                  {savedPoMode === "uploaded" ? "Uploaded" : "Generated"}
                </span>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className={styles.label}>PO Number</div>
              <div className={styles.value}>{po.po_number || "-"}</div>
            </div>

            <div className="col-6 col-md-3">
              <div className={styles.label}>PO Date</div>
              <div className={styles.value}>{formatDate(po.po_date)}</div>
            </div>

            <div className="col-6 col-md-3">
              <div className={styles.label}>PO Amount</div>
              <div className={styles.value}>
                {formatAmount(
                  po.amount ?? order.total_amount ?? deal.total_amount,
                )}
              </div>
            </div>
          </div>
        ) : canEditDeal ? (
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
              Companies using their own CRM/SAP PO can upload a PDF instead of
              our format.
            </small>

            {poMode === "generated" && (
              <div className={styles.generateGrid}>
                <div className="row g-2 mb-2">
                  <div className="col-md-4">
                    <label className="form-label" htmlFor="gen_po_number">
                      PO Number <span className="text-muted">(optional)</span>
                    </label>
                    <input
                      id="gen_po_number"
                      type="text"
                      name="po_number"
                      className="form-control form-control-sm"
                      placeholder="Leave blank if not available"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label" htmlFor="gen_po_date">
                      PO Date
                    </label>
                    <input
                      id="gen_po_date"
                      type="date"
                      name="po_date"
                      className="form-control form-control-sm"
                      defaultValue={po.po_date || ""}
                    />
                  </div>
                </div>
              </div>
            )}

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
                disabled={isPoSubmitting}
                className={`${styles.btn} ${styles.btnPrimary}`}
              >
                <FiFilePlus />
                {isPoSubmitting
                  ? "Submitting..."
                  : poMode === "generated"
                    ? "Generate PO"
                    : "Upload PO"}
              </button>
            </div>
          </form>
        ) : null}
      </section>
    </div>
  );
};

export default CrmOrderView;
