import { FiUser, FiUserCheck, FiCalendar, FiList } from "react-icons/fi";

import styles from "./EmployeeSummary.module.css";
import { BsFillCalendarCheckFill } from "react-icons/bs";
import { RiFileList2Fill } from "react-icons/ri";

const formatToday = () =>
  new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function EmployeeSummary({
  summary = {},
  from = "",
  to = "",
  onChange = () => {},
}) {
  const summaryCards = [
    {
      label: "Total Employee",
      value: summary?.total ?? 0,
      icon: FiUser,
      tone: "toneBlue",
    },
    {
      label: "Active Employee",
      value: summary?.active ?? 0,
      icon: FiUserCheck,
      tone: "toneGreen",
    },
    {
      label: "Total Leads Assigned",
      value: summary?.total_leads_assigned ?? 0,
      icon: BsFillCalendarCheckFill,
      tone: "tonePurple",
    },
    {
      label: "Pending Tasks",
      value: summary?.pending_tasks ?? 0,
      icon: RiFileList2Fill,
      tone: "toneOrange",
    },
  ];

  return (
    <section className={styles.summarySection}>
      <div className={styles.summaryTop}>
        <div className={styles.summaryTitle}>
          <h3>Account Summary</h3>
          <span>(As on {formatToday()})</span>
        </div>

        <div className={styles.dateRange}>
          <input
            type="date"
            value={from}
            onChange={(e) => onChange("from", e.target.value)}
            className={styles.dateInput}
          />
          <input
            type="date"
            value={to}
            onChange={(e) => onChange("to", e.target.value)}
            className={styles.dateInput}
          />
        </div>
      </div>

      <div className={styles.summaryGrid}>
        {summaryCards.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className={styles.summaryCard}>
            <div className={`${styles.summaryIcon} ${styles[tone]}`}>
              <Icon size={18} />
            </div>
            <p className={styles.summaryLabel}>{label}</p>
            <h3 className={styles.summaryValue}>{value}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
