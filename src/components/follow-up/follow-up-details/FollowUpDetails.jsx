import React, { useState } from "react";
import Link from "next/link";
import styles from "@/components/follow-up/follow-up-details/FollowUpDetails.module.css";
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/router";

const FollowUpDetails = () => {
  const [leadStatus, setLeadStatus] = useState("Quote Send");
  const [assignedTo, setAssignedTo] = useState("Pratik V");
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpNote, setFollowUpNote] = useState("");

  const router = useRouter();

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

  const employees = ["Darshan Bane", "Janvi Singh", "Pratik V"];

  const [followUpHistory, setFollowUpHistory] = useState([
    {
      date: null,
      status: "Quote Send",
      assignedTo: "Pratik V",
      addedAt: "16 Oct 2026, 1:34 PM",
      note: "",
    },
    {
      date: "24 Sep 2026, 12:00 AM",
      status: "Quote Send",
      assignedTo: "Pratik V",
      addedAt: "05 Oct 2026, 4:25 PM",
      note: "",
    },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!leadStatus) {
      alert("Please select a lead status.");
      return;
    }

    const newFollowUp = {
      date: followUpDate
        ? new Date(followUpDate).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : null,
      status: leadStatus,
      assignedTo: assignedTo || "Unassigned",
      addedAt: new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
      note: followUpNote,
    };

    setFollowUpHistory((prevHistory) => [newFollowUp, ...prevHistory]);

    setFollowUpNote("");
    setFollowUpDate("");

    alert("Follow-up added successfully!");
  };

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

          <h2>Follow-Up Detail</h2>
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
        <section className="common-table-section">
          <div className="common-table-card p-16">
            <div className={styles.cardHeader}>
              <h3>MALAD RESIDENCY</h3>

              <a onClick={() => router.push("/leads/leads-details/332")}  className={styles.addCreditBtn}>
                View Lead
              </a>
            </div>

            <div className={styles.followupLeadMeta}>
              <p>Kapil Maurya — Project Manager</p>
              <p>kapil@goyalinfotech.com · 8658997588</p>
              <p>
                Status: <strong>Quote Send</strong>
                {" · "}Assigned: <strong>Pratik V</strong>
              </p>
            </div>

            <div className={styles.cardHeader} style={{ marginTop: 18 }}>
              <h3>Follow-Up History ({followUpHistory.length})</h3>
            </div>

            <div className={styles.followupLog}>
              {followUpHistory.map((item, index) => (
                <div className={styles.followupLogItem} key={index}>
                  <div className={styles.followupLogTop}>
                    <strong>{item.date || "No date"}</strong>

                    <span className="badge quotation-sent">{item.status}</span>
                  </div>

                  <p>{item.assignedTo}</p>

                  {item.note && <p>{item.note}</p>}

                  <small>Added {item.addedAt}</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="common-table-section">
          <div className="common-table-card p-16">
            <div className={styles.cardHeader}>
              <h3>Add Follow-Up</h3>
            </div>

            <form className="followup-form" noValidate onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  Lead Status <span>*</span>
                </label>

                <select
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
                <label>Assigned To</label>

                <select
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
                <label>Follow Up Date &amp; Time</label>

                <div className="date-input">
                  <input
                    type="datetime-local"
                    name="follow_up_date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Note</label>

                <textarea
                  name="follow_up_note"
                  placeholder="What was discussed / next step"
                  value={followUpNote}
                  onChange={(e) => setFollowUpNote(e.target.value)}
                  style={{ border: "1px solid #e0e4e9" }}
                />
              </div>

              <div className={styles.submitWrap}>
                <button type="submit" className={styles.submitBtn}>
                  Save Follow-Up
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
