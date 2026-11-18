import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
} from "recharts";
import styles from "@/components/reports/quick-insights/QuickInsights.module.css";

const FORECAST_COLORS = {
  navy: "#1e4f96",
  blue: "#0355ac",
  sky: "#60a5fa",
  teal: "#14b8a6",
  purple: "#8b5cf6",
};

const TRACK_COLOR = "#edf2f7";

const ForecastBar = ({ width, color }) => (
  <div style={{ width: "100%", height: 14 }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        layout="vertical"
        data={[{ name: "bar", width }]}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      >
        <XAxis type="number" domain={[0, 100]} hide />
        <YAxis type="category" dataKey="name" hide />
        <Bar
          dataKey="width"
          barSize={10}
          radius={10}
          background={{ fill: TRACK_COLOR, radius: 10 }}
          isAnimationActive={false}
        >
          <Cell fill={color} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const QuickInsights = ({ insights = [], forecast = [] }) => {
  return (
    <>
      <h3 className={styles.rptSectionTitle}>Quick Insights</h3>

      <div className={styles.rptInsights}>
        {insights.map(({ label, value, meta, tone }) => (
          <div
            key={label}
            className={`${styles.rptInsight} ${styles[`tone-${tone}`] || ""}`}
          >
            <span>{label}</span>
            <strong>{value}</strong>
            <p>{meta}</p>
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
            {forecast.map(({ label, value, pct, tone }) => (
              <div key={label} className={styles.rptForecastRow}>
                <div
                  className={styles.rptForecastLabel}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
                <ForecastBar
                  width={pct}
                  color={FORECAST_COLORS[tone] || FORECAST_COLORS.blue}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default QuickInsights;
