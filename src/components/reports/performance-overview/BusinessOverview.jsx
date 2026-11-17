import React from "react";
import styles from "@/components/reports/performance-overview/BusinessOverview.module.css";

const stats = [
  { label: "Total Revenue", value: "₹37,538", tone: "blue" },
  { label: "Won Deals", value: "4", tone: "teal" },
  { label: "Lost Deals", value: "0", tone: "orange" },
  { label: "Pipeline Value", value: "₹1 L", tone: "purple" },
  { label: "Expected Revenue", value: "₹59,611", tone: "green" },
  { label: "Win Rate", value: "100%", tone: "yellow" },
];

const months = [
  { label: "Dec", height: 0 },
  { label: "Jan", height: 0 },
  { label: "Feb", height: 0 },
  { label: "Mar", height: 0 },
  { label: "Apr", height: 0 },
  { label: "May", height: 0 },
  { label: "Jun", height: 0 },
  { label: "Jul", height: 0 },
  { label: "Aug", height: 0 },
  { label: "Sep", height: 0 },
  { label: "Oct", height: 31 },
  { label: "Nov", height: 100 },
];

const BusinessOverview = () => {
  return (
    <section className="common-table-section mt-4">
      <div className={`common-table-card ${styles.rptCard}`}>
        <div className="common-table-header">
          <div>
            <h3>Business Performance Overview</h3>
            <p className={styles.rptSub}>
              Organization-wide sales and pipeline snapshot
            </p>
          </div>
          <div className={styles.rptRange}>Last 12 Months</div>
        </div>

        <div className={styles.rptOverviewStats}>
          {stats.map(({ label, value, tone }) => (
            <div key={label} className={styles[`tone-${tone}`]}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>

        <div className={styles.rptBars}>
          {months.map(({ label, height }) => (
            <div key={label} className={styles.rptBarCol}>
              <div className={styles.rptBar} style={{ "--h": `${height}%` }} />
              <small>{label}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessOverview;
