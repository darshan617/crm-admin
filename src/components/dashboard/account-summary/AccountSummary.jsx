import React from "react";
import styles from "@/components/dashboard/account-summary/AccountSummary.module.css";

import { FiPhoneCall } from "react-icons/fi";
import { LuCalendarClock, LuClipboardCheck } from "react-icons/lu";
import { CiClock2 } from "react-icons/ci";
import { AiOutlineExclamationCircle } from "react-icons/ai";

const AccountSummary = ({ summary, user }) => {
  const summaryCards = [
    {
      title: "Total Leads",
      value: summary?.total_leads ?? 0,
      icon: <FiPhoneCall />,
      color: styles.blue,
    },
    {
      title: "Pending Follow-ups",
      value: summary?.pending_follow_ups ?? 0,
      icon: <LuClipboardCheck />,
      color: styles.green,
    },
    {
      title: "Pending Quotations",
      value: summary?.pending_quotations ?? 0,
      icon: <CiClock2 />,
      color: styles.yellow,
    },
    {
      title: "Meetings Scheduled",
      value: summary?.meetings_scheduled ?? 0,
      icon: <LuCalendarClock />,
      color: styles.purple,
    },
    {
      title: "Overdue Tasks",
      value: summary?.overdue_tasks ?? 0,
      icon: <AiOutlineExclamationCircle />,
      color: styles.red,
    },
  ];

  return (
    <section>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.welcomeText}>Welcome,</p>
          <h2>{user?.name || "User"}</h2>
        </div>

        <div className={styles.summarySection}>
          <div className={styles.commonTableHeader}>
            <div className={styles.summaryHeader}>
              <h3>Account Summary</h3>
            </div>

            <div className={styles.dateRange}>
              <div className={styles.dateInput}>
                <input type="date" />
              </div>

              <div className={styles.dateInput}>
                <input type="date" />
              </div>
            </div>
          </div>

          <div className={`${styles.summaryGrid} stats-grid`}>
            {summaryCards.map((card, index) => (
              <div
                key={index}
                className={`${styles.summaryCard} ${card.color}`}
              >
                <div className={styles.cardIcon}>{card.icon}</div>

                <p>{card.title}</p>
                <h3>{card.value}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccountSummary;