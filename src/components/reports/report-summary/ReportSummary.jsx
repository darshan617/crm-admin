import React from "react";
import Link from "next/link";
import { LuIndianRupee } from "react-icons/lu";
import { GoTrophy } from "react-icons/go";
import { AiOutlinePercentage } from "react-icons/ai";
import { VscGitBranch } from "react-icons/vsc";
import { FiTarget } from "react-icons/fi";
import styles from "@/components/reports/report-summary/ReportSummary.module.css";

const kpis = [
  { label: "Total Sales", value: "₹37,538", tone: "blue", Icon: LuIndianRupee },
  { label: "Won Deals", value: "4", tone: "teal", Icon: GoTrophy },
  {
    label: "Win Rate",
    value: "100%",
    tone: "green",
    Icon: AiOutlinePercentage,
  },
  {
    label: "Pipeline Value",
    value: "₹1 L",
    tone: "purple",
    Icon: VscGitBranch,
  },
  { label: "Target Achievement", value: "27%", tone: "orange", Icon: FiTarget },
];

const toneClass = {
  blue: styles.toneBlue,
  teal: styles.toneTeal,
  green: styles.toneGreen,
  purple: styles.tonePurple,
  orange: styles.toneOrange,
};

const ReportSummary = () => {
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
