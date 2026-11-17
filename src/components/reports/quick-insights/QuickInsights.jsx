import React from "react";
import styles from "@/components/reports/quick-insights/QuickInsights.module.css";

// Replace these with your API data later.
const insights = [
  {
    label: "Top Lead Source",
    value: "Unknown",
    note: "33% of leads",
    tone: "blue",
  },
  {
    label: "Top Employee",
    value: "Account Manager User",
    note: "0 won deals",
    tone: "teal",
  },
  {
    label: "Highest Value Deal",
    value: "₹18,902",
    note: "TRUPTI TRADERS",
    tone: "purple",
  },
  {
    label: "Highest Won Deal",
    value: "₹18,360",
    note: "SWR KARNATAKA · 13 Nov 2026",
    tone: "orange",
  },
  {
    label: "Follow-up Tasks",
    value: "6 overdue",
    note: "Need attention",
    tone: "yellow",
  },
];

// `width` is the bar fill in percent.
const forecast = [
  { label: "Current Pipeline", value: "₹1 L", width: 100, tone: "navy" },
  { label: "Expected Revenue", value: "₹59,611", width: 59, tone: "blue" },
  { label: "Still Valid", value: "₹18,902", width: 19, tone: "sky" },
  { label: "Closing This Month", value: "₹73,841", width: 74, tone: "teal" },
  { label: "Closing This Quarter", value: "₹1 L", width: 100, tone: "purple" },
];

const QuickInsights = () => {
  return (
    <>
      <h3 className={styles.rptSectionTitle}>Quick Insights</h3>

      <div className={styles.rptInsights}>
        {insights.map(({ label, value, note, tone }) => (
          <div
            key={label}
            className={`${styles.rptInsight} ${styles[`tone-${tone}`]}`}
          >
            <span>{label}</span>
            <strong>{value}</strong>
            <p>{note}</p>
          </div>
        ))}
      </div>

      <section className="common-table-section mt-4">
        <div className={`common-table-card ${styles.rptCard}`}>
          <div className="common-table-header">
            <div>
              <h3>Sales Forecast</h3>
              <p className={styles.rptSub}>Pipeline-based revenue projection</p>
            </div>
            <div className={styles.rptRange}>Last 12 Months</div>
          </div>

          <div className={styles.rptForecast}>
            {forecast.map(({ label, value, width, tone }) => (
              <div
                key={label}
                className={`${styles.rptForecastRow} ${styles[`tone-${tone}`]}`}
              >
                <div className={styles.rptForecastLabel}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
                <div className={styles.rptForecastTrack}>
                  <span style={{ "--w": `${width}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default QuickInsights;
