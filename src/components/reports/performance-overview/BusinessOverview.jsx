import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  Tooltip,
} from "recharts";
import styles from "@/components/reports/performance-overview/BusinessOverview.module.css";

const STAT_FIELDS = [
  { label: "Total Revenue", key: "yearRevenue", tone: "blue" },
  { label: "Won Deals", key: "wonDeals", tone: "teal" },
  { label: "Lost Deals", key: "lostDeals", tone: "orange" },
  { label: "Pipeline Value", key: "pipelineValue", tone: "purple" },
  { label: "Expected Revenue", key: "expectedRevenue", tone: "green" },
  { label: "Win Rate", key: "winRate", tone: "yellow" },
];

const BAR_COLOR = "#3a72bf";
const BAR_COLOR_TOP = "#1f4e95";

const BusinessOverview = ({ data }) => {
  const stats = STAT_FIELDS.map((stat) => ({
    ...stat,
    value: data?.[stat.key] ?? "—",
  }));
  const months = data?.months ?? [];
  const maxHeight = Math.max(0, ...months.map((month) => Number(month.h) || 0));

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

        <div style={{ width: "100%", height: 240, marginTop: 16 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={months}
              margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
              barCategoryGap="30%"
            >
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9aa5bd", fontSize: 12 }}
                dy={10}
              />
              <Tooltip
                cursor={{ fill: "rgba(58, 114, 191, 0.06)" }}
                formatter={(value) => [value, "Relative"]}
              />
              <Bar
                dataKey="h"
                maxBarSize={28}
                radius={[6, 6, 0, 0]}
                minPointSize={0}
              >
                {months.map((month) => (
                  <Cell
                    key={month.label}
                    fill={
                      Number(month.h) === maxHeight && maxHeight > 0
                        ? BAR_COLOR_TOP
                        : BAR_COLOR
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default BusinessOverview;
