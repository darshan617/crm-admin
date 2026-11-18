import React from "react";
import Link from "next/link";
import { LuIndianRupee } from "react-icons/lu";
import { GoTrophy } from "react-icons/go";
import { AiOutlinePercentage } from "react-icons/ai";
import { VscGitBranch } from "react-icons/vsc";
import { FiTarget } from "react-icons/fi";
import styles from "@/components/reports/report-summary/ReportSummary.module.css";

const KPI_FIELDS = [
  { label: "Total Sales", key: "totalSales", tone: "blue", Icon: LuIndianRupee },
  { label: "Won Deals", key: "wonDeals", tone: "teal", Icon: GoTrophy },
  {
    label: "Win Rate",
    key: "winRate",
    tone: "green",
    Icon: AiOutlinePercentage,
  },
  {
    label: "Pipeline Value",
    key: "pipelineValue",
    tone: "purple",
    Icon: VscGitBranch,
  },
  {
    label: "Target Achievement",
    key: "targetAchievement",
    tone: "orange",
    Icon: FiTarget,
  },
];

const toneClass = {
  blue: styles.toneBlue,
  teal: styles.toneTeal,
  green: styles.toneGreen,
  purple: styles.tonePurple,
  orange: styles.toneOrange,
};

const ReportSummary = ({ data, isLoading, isError }) => {
  const kpis = KPI_FIELDS.map((kpi) => ({
    ...kpi,
    value: isLoading ? "…" : isError ? "—" : (data?.[kpi.key] ?? "—"),
  }));

  return (
    <>
      <div className="page-header">
        <div>
          <div className="breadcrumb welcome-text">
            <p>
              <Link href="/crm/dashboard">Dashboard</Link> <span>/</span>
            </p>
          </div>
          <h2>Reports</h2>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {kpis.map(({ label, value, tone, Icon }) => (
          <div
            key={label}
            className={`${styles.summaryCard} ${toneClass[tone]}`}
          >
            <div className={styles.cardIcon}>
              <Icon size={24} aria-hidden="true" />
            </div>
            <p>{label}</p>
            <h3>{value}</h3>
          </div>
        ))}
      </div>
    </>
  );
};

export default ReportSummary;
