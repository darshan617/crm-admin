"use client";

import React, { useState } from "react";
import { LuSearch, LuChevronRight, LuChevronLeft } from "react-icons/lu";
import styles from "@/components/follow-up/FollowUp.module.css";
import { useRouter } from "next/router";

const followups = [
  {
    id: 55,
    letter: "M",
    company: "MALAD RESIDENCY",
    contact: "Kapil Maurya",
    role: "Project Manager",
    email: "kapil@goyalinfotech.com",
    phone: "8658997588",
    status: { label: "Quote Send", type: "quotation-sent" },
    assignee: { name: "Pratik V", letter: "P" },
    date: "24 Sep, 2026 12:00 AM",
  },
  {
    id: 52,
    letter: "W",
    company: "WNS GLOBAL SERVICES PRIVATE LIMITED",
    contact: "Pratik Vardekar",
    role: "Desinger",
    email: "pratik@goyalinfotech.com",
    phone: "8010840157",
    status: { label: "Quote Send", type: "quotation-sent" },
    assignee: { name: "Pratik V", letter: "P" },
    date: "24 Sep, 2026 12:00 AM",
  },
  {
    id: 56,
    letter: "V",
    company: "VASAI-VIRAR SHAHAR MAHANAGARPALIKA",
    contact: "Supriya Prabhu",
    role: "Senior Developer",
    email: "supriya@goyalinfotech.com",
    phone: "9887545645",
    status: { label: "Approved", type: "new" },
    assignee: { name: "Darshan Bane", letter: "D" },
    date: "24 Sep, 2026 12:00 AM",
  },
  {
    id: 53,
    letter: "I",
    company: "IT TEAMWORK",
    contact: "Janvi Singh",
    role: "Project Manager",
    email: "janvi@goyalinfotech.com",
    phone: "9112075167",
    status: { label: "Quote Send", type: "quotation-sent" },
    assignee: { name: "Pratik V", letter: "P" },
    date: "24 Sep, 2026 12:00 AM",
  },
  {
    id: 57,
    letter: "W",
    company: "WNS GLOBAL SERVICES PRIVATE LIMITED",
    contact: "gauri",
    role: "Manager",
    email: "gauri@goyalinfotech.com",
    phone: "9658752777",
    status: { label: "Approved", type: "new" },
    assignee: { name: "Pratik V", letter: "P" },
    date: "24 Sep, 2026 12:00 AM",
  },
  {
    id: 63,
    letter: "K",
    company: "KIRLOSKAR PNEUMATIC COMPANY LIMITED",
    contact: "Mittal Solanki",
    role: "Figma Designer",
    email: "mittal@goyalinfotech.com",
    phone: "8010940157",
    status: { label: "Quote Send", type: "quotation-sent" },
    assignee: { name: "Darshan Bane", letter: "D" },
    date: "29 Sep, 2026 12:00 AM",
  },
  {
    id: 61,
    letter: "T",
    company: "TIZZY PROPERTIES PRIVATE LIMITED",
    contact: "Govind",
    role: "P Manager",
    email: "websites@tizzycloud.com",
    phone: "9876543210",
    status: { label: "Quote Send", type: "quotation-sent" },
    assignee: { name: "Darshan Bane", letter: "D" },
    date: "29 Sep, 2026 12:00 AM",
  },
  {
    id: 62,
    letter: "T",
    company: "TIZZY CLOUD",
    contact: "Tizzy Cloud Website Designers",
    role: "P Manager",
    email: "test21@gmail.com",
    phone: "9619667145",
    status: { label: "New", type: "new" },
    assignee: { name: "Darshan Bane", letter: "D" },
    date: "29 Sep, 2026 12:00 AM",
  },
  {
    id: 68,
    letter: "M",
    company: "MINISTRY OF RAILWAYS",
    contact: "Sushil",
    role: "Jr. PHP Laravel Developer",
    email: "sushil@goyalinfotech.com",
    phone: "8010840152",
    status: { label: "Quote Send", type: "quotation-sent" },
    assignee: { name: "Darshan Bane", letter: "D" },
    date: "05 Oct, 2026 12:00 AM",
  },
  {
    id: 70,
    letter: "C",
    company: "CENTRAL WARE HOUSING CORP.LTD.",
    contact: "Darshan B",
    role: "Accounts",
    email: "darshan1@goyalinfotech.com",
    phone: "9658745858",
    status: { label: "Contacted", type: "contacted" },
    assignee: { name: "Darshan Bane", letter: "D" },
    date: "06 Oct, 2026 12:00 AM",
  },
];

const Followup = () => {
  const [selected, setSelected] = useState([]);

  const allSelected = selected.length === followups.length;

  const toggleAll = () =>
    setSelected(allSelected ? [] : followups.map((f) => f.id));

  const toggleOne = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const router = useRouter();

  return (
    <main className="content">
      <div className="crm-page">
        <div className="page-header">
          <div className="">
            <div className="breadcrumb welcome-text">
              <p>
                <a href="#">Dashboard</a>
                <span>/</span>{" "}
              </p>
            </div>
            <h2>Follow-Ups </h2>
          </div>
        </div>

        <section className="common-table-section">
          <div className={styles.crmLeadTabs}>
            <a href="#" className={styles.active}>
              All Follow-Ups
            </a>
            <a href="#" className="">
              Overdue
            </a>
            <a href="#" className="">
              Today
            </a>
            <a href="#" className="">
              Upcoming
            </a>
          </div>

          <div className="common-table-card">
            <div className="common-table-header crm-lead-header">
              <div className={styles.crmLeadTitle}>
                <p>
                  Showing <strong>1 - 10</strong> from <strong>18</strong>{" "}
                  Follow-Ups
                </p>

                <span className="header-divider"></span>

                <label className={styles.itemsSelected}>
                  <input
                    type="checkbox"
                    id="selectAll"
                    checked={allSelected}
                    onChange={toggleAll}
                  />
                  <div>
                    <span id="selectedLeadCount">{selected.length}</span>
                    /10 Items Selected
                  </div>
                </label>
              </div>

              <form
                method="GET"
                action="#"
                className="table-search"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="text"
                  id="partnerSearch"
                  name="search"
                  defaultValue=""
                  placeholder="Search Follow-Ups"
                />
                <LuSearch
                  size={24}
                  aria-hidden="true"
                  className="lucide lucide-search"
                />
              </form>
            </div>

            <div className="table-filter">
              <div className="border-line"></div>
              <button className="filter-btn" id="toggleFilter" type="button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="9"
                  viewBox="0 0 12 9"
                  fill="none"
                >
                  <path
                    d="M0.75 0.75H10.75M2.75 4.25H8.75M4.25 7.75H7.25"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Filters</span>
              </button>
            </div>

            <table className="crm-lead-table">
              <thead>
                <tr className="table-head">
                  <td className="select-col">
                    <input
                      type="checkbox"
                      id="selectAllTable"
                      checked={allSelected}
                      onChange={toggleAll}
                    />
                  </td>
                  <td>Customer Name</td>
                  <td>Contact Information</td>
                  <td className={styles.statusCol}>Status</td>
                  <td>Follow Up Date</td>
                </tr>
              </thead>

              <tbody className="table-body">
                {followups.map((f) => (
                  <tr
                    key={f.id}
                    className="crm-lead-row table-row"
                    style={{ cursor: "pointer" }}
                  >
                    <td className="select-col" data-label="">
                      <input
                        type="checkbox"
                        name="selected_leads[]"
                        value={f.id}
                        checked={selected.includes(f.id)}
                        onChange={() => toggleOne(f.id)}
                      />
                    </td>

                    <td className="customer" data-label="Customer">
                      <div className="avatar primary">{f.letter}</div>
                      <div>
                        <h5>{f.company}</h5>
                        <p>
                          {f.contact}
                          {f.role && ` - ${f.role}`}
                        </p>
                      </div>
                    </td>

                    <td className="contact-info" data-label="Contact">
                      <div>
                        <h5>{f.email}</h5>
                        <p>{f.phone}</p>
                      </div>
                    </td>

                    <td className={styles.statusCol} data-label="Status">
                      <span className={`badge ${f.status.type}`}>
                        {f.status.label}
                      </span>
                    </td>

                    <td className="plan-action" data-label="Follow Up Date">
                      <div className={styles.assignedUser}>
                        <div className={styles.userInfo}>
                          <div className={styles.avatarFlex}>
                            <div className="mini-avatar primary">
                              {f.assignee.letter}
                            </div>
                            <h5>{f.assignee.name}</h5>
                          </div>
                          <small>
                            Follow up on&nbsp;
                            <strong>{f.date}</strong>
                          </small>
                        </div>

                        <div className="actions">
                          <a href="#" className="action-btn">
                            <LuChevronRight
                              onClick={() => router.push("/follow-up/follow-up-details")}
                              size={24}
                              aria-hidden="true"
                              className="lucide lucide-chevron-right"
                            />
                          </a>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="table-pagination">
              <a href="#" className="page-btn">
                <LuChevronLeft
                  size={24}
                  aria-hidden="true"
                  className="lucide lucide-chevron-left"
                />
              </a>
              <a href="#" className="page-btn active">
                1
              </a>
              <a href="#" className="page-btn ">
                2
              </a>
              <a href="#" className="page-btn">
                <LuChevronRight
                  size={24}
                  aria-hidden="true"
                  className="lucide lucide-chevron-right"
                />
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Followup;
