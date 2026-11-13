"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/components/quotation/history/History.module.css";
import {
  useQuotationHistoryQuery,
  useStatusMutation,
} from "@/redux/apis/quotationApi";
import { useToast } from "@/custom-hooks/toast/ToastProvider";

const History = () => {
  const router = useRouter();
  const { slug } = router.query;

  const { showToast } = useToast();

  const [status, setStatus] = useState({
    quotation: "not_shared",
    invoice: null,
  });

  const {
    data: quotationHistory,
    isLoading,
    isFetching,
    isError,
  } = useQuotationHistoryQuery(
    { quotation_id: slug },
    {
      skip: !router.isReady || !slug,
    },
  );

  const historyData = quotationHistory?.data;

  const timeline = historyData?.activity_timeline ?? [];
  const summary = historyData?.quotation ?? {};
  const invoice = historyData?.invoice ?? {};

  const lastSent = timeline.find((item) => item.type === "sent");

  const [updateStatus, { isLoading: isUpdating }] = useStatusMutation();

  useEffect(() => {
    if (!historyData) return;

    setStatus({
      quotation: historyData?.quotation?.status || "not_shared",
      invoice: historyData?.invoice?.status || "not_sent",
    });
  }, [historyData]);

  const handleUpdate = async (body, rollback) => {
    try {
      const res = await updateStatus({
        quotation_id: slug,
        body,
      }).unwrap();

      showToast(res?.message || "Status updated successfully", "success");
    } catch (err) {
      rollback();

      showToast(
        err?.data?.message || err?.error || "Failed to update status",
        "error",
      );
    }
  };

  const onQuotationChange = (event) => {
    const prevStatus = status.quotation;
    const prevInvoice = status.invoice;

    const next = event.target.value;

    const nextInvoice =
      next === "approved" ? status.invoice || "not_sent" : "not_sent";

    setStatus((prev) => ({
      ...prev,
      quotation: next,
      invoice: nextInvoice,
    }));

    handleUpdate(
      {
        quotation_status: next,
        invoice_status: nextInvoice,
      },
      () => {
        setStatus((prev) => ({
          ...prev,
          quotation: prevStatus,
          invoice: prevInvoice,
        }));
      },
    );
  };

  const onInvoiceChange = (event) => {
    const prevInvoice = status.invoice;
    const next = event.target.value;

    setStatus((prev) => ({
      ...prev,
      invoice: next,
    }));

    handleUpdate(
      {
        quotation_status: status.quotation,
        invoice_status: next,
      },
      () => {
        setStatus((prev) => ({
          ...prev,
          invoice: prevInvoice,
        }));
      },
    );
  };

  return (
    <main className="content">
      <div className="page-header">
        <div>
          <div className="breadcrumb welcome-text">
            <p>
              <Link href="/dashboard">Dashboard</Link>
              <span>/</span>
              <Link href="/quotations">Quotations</Link>
              <span>/</span>
              <span>{slug || "Quotation"}</span>
            </p>
          </div>

          <h2>Send &amp; approval history</h2>
        </div>

        <div className="back">
          <button
            type="button"
            onClick={() => router.back()}
            className="back-btn"
          >
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className={styles.quoActivityPage}>
        {/* Summary Cards */}
        <div className={styles.statsGrid}>
          <div className={`${styles.summaryCard} rpt-kpi tone-teal`}>
            <p>Quotation sent to</p>

            <h3>{summary?.send_count ?? 0}</h3>

            <small>{lastSent?.emails?.join(", ") || "-"}</small>
          </div>

          <div className={`${styles.summaryCard} rpt-kpi tone-green`}>
            <p>Quotation first approval</p>

            <h3 className="text-capitalize">
              {summary?.status || summary?.responded_by?.email || "-"}
            </h3>

            <small>{summary?.responded_by?.email || "-"}</small>
          </div>

          <div className={`${styles.summaryCard} rpt-kpi tone-purple`}>
            <p>Invoice sent to</p>

            <h3>{invoice?.send_count ?? 0}</h3>

            <small>{invoice?.responded_by?.email || "-"}</small>
          </div>

          <div className={`${styles.summaryCard} rpt-kpi tone-orange`}>
            <p>Invoice approved by</p>

            <h3 className="text-capitalize">
              {invoice?.status || invoice?.responded_by?.email || "-"}
            </h3>

            <small>{invoice?.responded_by?.email || "-"}</small>
          </div>
        </div>

        {/* Timeline */}
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
              {isLoading || isFetching ? (
                <li className={styles["tone-blue"]}>
                  <p>Loading quotation history...</p>
                </li>
              ) : isError ? (
                <li className={styles["tone-blue"]}>
                  <p>Unable to load quotation history. Please try again.</p>
                </li>
              ) : timeline.length ? (
                timeline.map((item, index) => (
                  <li
                    key={`${item.type}-${item.when}-${index}`}
                    className={styles[`tone-${item.tone}`] || ""}
                  >
                    <h4>{item.title}</h4>

                    <p>{item.text}</p>

                    {item.quotation_number && (
                      <p>
                        {item.quotation_number} (v{item.quotation_version})
                      </p>
                    )}

                    {item.cc?.length > 0 && <p>CC: {item.cc.join(", ")}</p>}

                    <small>{item.when}</small>
                  </li>
                ))
              ) : (
                <li className={styles["tone-blue"]}>
                  <p>No quotation history available.</p>
                </li>
              )}
            </ol>
          </div>
        </section>

        {/* Update Status */}
        <section className="common-table-section">
          <div className="common-table-card rpt-card">
            <div className="common-table-header">
              <div>
                <h3>Update status</h3>

                <p className="rpt-sub">Manual override if needed</p>
              </div>
            </div>

            <form
              className={styles.quotationTopMeta}
              onSubmit={(event) => event.preventDefault()}
            >
              <div className={styles.qmetaField}>
                <span>Quotation</span>

                <select
                  name="quotation_status"
                  className={`quotation-status-select is-${status.quotation}`}
                  value={status.quotation}
                  onChange={onQuotationChange}
                  disabled={isUpdating}
                >
                  <option value="not_shared">Not shared</option>

                  <option value="shared">Shared, approval pending</option>

                  <option value="approved">Approved</option>

                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className={styles.qmetaField}>
                <span>Invoice</span>

                {status.quotation === "approved" ? (
                  <select
                    name="invoice_status"
                    className={`quotation-status-select is-${status.invoice}`}
                    value={status.invoice || "not_sent"}
                    onChange={onInvoiceChange}
                    disabled={isUpdating}
                  >
                    <option value="not_sent">Not sent</option>

                    <option value="sent">Sent</option>

                    <option value="approved">Approved</option>

                    <option value="rejected">Rejected</option>
                  </select>
                ) : (
                  "-"
                )}
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
};

export default History;
