import React from "react";
import styles from "@/components/dashboard/account-summary/AccountSummary.module.css";

import { FiPhoneCall } from "react-icons/fi";
import { LuCalendarClock, LuClipboardCheck } from "react-icons/lu";
import { CiClock2 } from "react-icons/ci";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import usePermissions from "@/custom-hooks/permissions/usePermissions";

const AccountSummary = ({
  summary,
  user,
  filters = {},
  defaultRange = {},
  onRangeChange,
}) => {
  const { canView } = usePermissions();
  const summaryCards = [
    {
      title: "Total Leads",
      value: summary?.total_leads ?? 0,
      icon: <FiPhoneCall />,
      color: styles.blue,
      permission_key: "leads",
    },
    {
      title: "Pending Follow-ups",
      value: summary?.pending_follow_ups ?? 0,
      icon: <LuClipboardCheck />,
      color: styles.green,
      permission_key: "follow_ups",
    },
    {
      title: "Pending Quotations",
      value: summary?.pending_quotations ?? 0,
      icon: <CiClock2 />,
      color: styles.yellow,
      permission_key: "quotations",
    },
    {
      title: "Meetings Scheduled",
      value: summary?.meetings_scheduled ?? 0,
      icon: <LuCalendarClock />,
      color: styles.purple,
      permission_key: "meetings",
    },
    {
      title: "Overdue Tasks",
      value: summary?.overdue_tasks ?? 0,
      icon: <AiOutlineExclamationCircle />,
      color: styles.red,
      permission_key: "follow_ups",
    },
  ];

  const fromValue = filters.from || defaultRange.from || "";
  const toValue = filters.to || defaultRange.to || "";

  const handleFromChange = (e) => {
    onRangeChange?.({ from: e.target.value, to: toValue });
  };

  const handleToChange = (e) => {
    onRangeChange?.({ from: fromValue, to: e.target.value });
  };

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
                <input
                  type="date"
                  name="from"
                  value={fromValue}
                  max={toValue || undefined}
                  onChange={handleFromChange}
                  aria-label="From date"
                />
              </div>

              <div className={styles.dateInput}>
                <input
                  type="date"
                  name="to"
                  value={toValue}
                  min={fromValue || undefined}
                  onChange={handleToChange}
                  aria-label="To date"
                />
              </div>
            </div>
          </div>

          <div className={`${styles.summaryGrid} stats-grid`}>
            {summaryCards.map((card, index) => {
              if (!canView(card.permission_key)) return null;

              return (
                <div
                  key={index}
                  className={`${styles.summaryCard} ${card.color}`}
                >
                  <div className={styles.cardIcon}>{card.icon}</div>

                  <p>{card.title}</p>
                  <h3>{card.value}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccountSummary;
