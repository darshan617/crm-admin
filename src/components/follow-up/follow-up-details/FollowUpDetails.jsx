"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/components/follow-up/follow-up-details/FollowUpDetails.module.css";
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/router";
import {
  useAddFollowUpMutation,
  useFollowUpDetailQuery,
} from "@/redux/apis/followUpApi";
import { useToast } from "@/custom-hooks/toast/ToastProvider";

const statuses = [
  "New",
  "Contacted",
  "Qualified",
  "Negotiation",
  "Quote Send",
  "Won",
  "Lost",
  "Nurturing",
];

const formatDate = (value) => {
  if (!value) return "No date";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const FollowUpDetails = () => {
  const router = useRouter();

  const id = router.isReady
    ? Array.isArray(router.query.id)
      ? router.query.id[0]
      : router.query.id
    : undefined;

  const { data, isLoading, isError, error, refetch } = useFollowUpDetailQuery(
    { id },
    { skip: !router.isReady || !id },
  );

  const detail = data?.data || {};
  const lead = detail?.lead || {};

  const employees = Array.isArray(detail?.assignees) ? detail.assignees : [];

  const followUpHistory = Array.isArray(detail?.history) ? detail.history : [];
  const { showToast } = useToast();

  const [leadStatus, setLeadStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpNote, setFollowUpNote] = useState("");

  useEffect(() => {
    if (data?.data?.lead) {
      setLeadStatus(data.data.lead.lead_status || "");
      setAssignedTo(data.data.lead.assigned_to || "");
    }
  }, [data]);

  const [addFollowup, { isLoading: isAddingFollowup }] =
    useAddFollowUpMutation();

  const handleAddFollowup = async (e) => {
    e.preventDefault();

    try {
      const body = {
        lead_status: leadStatus,
        assigned_to: assignedTo,
        follow_up_date: followUpDate
          ? `${followUpDate.replace("T", " ")}:00`
          : null,
        follow_up_note: followUpNote.trim(),
      };

      const response = await addFollowup({
        id,
        body,
      }).unwrap();

      if (response?.status === false) {
        showToast(response?.message || "Failed to add follow-up.", "error");
        return;
      }

      showToast(
        response?.message || "Follow-up added successfully.",
        "success",
      );

      setFollowUpDate("");
      setFollowUpNote("");

      await refetch();
    } catch (error) {
      showToast(
        error?.data?.message ||
          "Something went wrong while adding the follow-up.",
        "error",
      );
    }
  };

  if (!router.isReady || isLoading) {
    return (
      <main className="content">
        <div className="text-center py-5">Loading follow-up details...</div>
      </main>
    );
  }

  if (!id) {
    return (
      <main className="content">
        <div className="text-center py-5">Follow-up ID not found.</div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="content">
        <div className="text-center py-5">
          <p>{error?.data?.message || "Unable to load follow-up details."}</p>

          <button type="button" onClick={refetch}>
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="content">
      <div className="page-header">
        <div>
          <div className="breadcrumb welcome-text">
            <p>
              <Link href="/dashboard">Dashboard</Link>
              <span>/</span>
              <Link href="/follow-up">Follow-Ups</Link>
            </p>
          </div>

          <h2>Follow-Up Detail - {id}</h2>
        </div>

        <div className="back">
          <button
            type="button"
            onClick={() => router.back()}
            className="back-btn"
          >
            <IoArrowBack />
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className={styles.followupDetail}>
        {/* Follow-Up Details and History */}
        <section className="common-table-section">
          <div className="common-table-card p-16">
            <div className={styles.cardHeader}>
              <h3>{lead.company_name || "-"}</h3>

              {lead?.id && (
                <button
                  type="button"
                  onClick={() => router.push(`/leads/leads-details/${lead.id}`)}
                  className={styles.addCreditBtn}
                >
                  View Lead
                </button>
              )}
            </div>

            <div className={styles.followupLeadMeta}>
              <p>
                {lead.name || "-"}
                {lead.designation ? ` — ${lead.designation}` : ""}
              </p>

              <p>
                {lead.email || "-"} · {lead.mobile || "-"}
              </p>

              <p>
                Status: <strong>{lead.lead_status || "-"}</strong>
                {" · "}
                Assigned: <strong>{lead.assigned_to || "-"}</strong>
              </p>
            </div>

            <div className={styles.cardHeader} style={{ marginTop: 18 }}>
              <h3>Follow-Up History ({followUpHistory.length})</h3>
            </div>

            <div className={styles.followupLog}>
              {followUpHistory.length > 0 ? (
                followUpHistory.map((item, index) => (
                  <div
                    className={styles.followupLogItem}
                    key={item.id ?? index}
                  >
                    <div className={styles.followupLogTop}>
                      <strong>
                        {formatDate(item.follow_up_date || item.date)}
                      </strong>

                      <span className="badge quotation-sent">
                        {item.lead_status || item.status || "-"}
                      </span>
                    </div>

                    <p>{item.assigned_to || item.assignedTo || "Unassigned"}</p>

                    {(item.follow_up_note || item.note) && (
                      <p>{item.follow_up_note || item.note}</p>
                    )}

                    <small>
                      Added {formatDate(item.created_at || item.addedAt)}
                    </small>
                  </div>
                ))
              ) : (
                <p>No follow-up history found.</p>
              )}
            </div>
          </div>
        </section>

        {/* Add Follow-Up Form */}
        <section className="common-table-section">
          <div className="common-table-card p-16">
            <div className={styles.cardHeader}>
              <h3>Add Follow-Up</h3>
            </div>

            <form
              className="followup-form"
              noValidate
              onSubmit={handleAddFollowup}
            >
              <div className="form-group">
                <label htmlFor="lead_status">
                  Lead Status <span>*</span>
                </label>

                <select
                  id="lead_status"
                  name="lead_status"
                  value={leadStatus}
                  onChange={(e) => setLeadStatus(e.target.value)}
                  required
                >
                  <option value="">Select Status</option>

                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="assigned_to">Assigned To</label>

                <select
                  id="assigned_to"
                  name="assigned_to"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                >
                  <option value="">Select Employee</option>

                  {employees.map((employee) => (
                    <option key={employee} value={employee}>
                      {employee}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="follow_up_date">
                  Follow Up Date &amp; Time
                </label>

                <div className="date-input">
                  <input
                    id="follow_up_date"
                    type="datetime-local"
                    name="follow_up_date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="follow_up_note">Note</label>

                <textarea
                  id="follow_up_note"
                  name="follow_up_note"
                  placeholder="What was discussed / next step"
                  value={followUpNote}
                  onChange={(e) => setFollowUpNote(e.target.value)}
                  style={{
                    border: "1px solid #e0e4e9",
                  }}
                />
              </div>

              <div className={styles.submitWrap}>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isAddingFollowup}
                  style={{
                    opacity: isAddingFollowup ? 0.6 : 1,
                    cursor: isAddingFollowup ? "not-allowed" : "pointer",
                  }}
                >
                  {isAddingFollowup ? "Saving..." : "Save Follow-Up"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
};

export default FollowUpDetails;
