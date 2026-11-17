import React from "react";
import Link from "next/link";
import {
  FiTrendingUp,
  FiUsers,
  FiBriefcase,
  FiFileText,
  FiActivity,
} from "react-icons/fi";
import styles from "@/components/reports/report-category/ReportCategory.module.css";
const categories = [
  {
    title: "Sales Performance",
    description: "Won, lost and open quotation value.",
    tone: "teal",
    Icon: FiTrendingUp,
    moreHref: "/crm/reports/sales",
    links: [
      { label: "Pipeline (7)", href: "/crm/reports/pipeline" },
      { label: "Won deals (4)", href: "/crm/reports/won" },
      { label: "Lost deals (0)", href: "/crm/reports/lost" },
    ],
  },
  {
    title: "Lead Performance",
    description: "Lead volume, source and assignment.",
    tone: "purple",
    Icon: FiUsers,
    moreHref: "/crm/reports/leads",
    links: [
      { label: "Top source (5)", href: "/crm/reports/sources" },
      { label: "Conversion (100%)", href: "/crm/reports/conversion" },
      { label: "Unassigned (4)", href: "/crm/reports/unassigned" },
    ],
  },
  {
    title: "Deal / Opportunity",
    description: "Open quotations still in the pipeline.",
    tone: "orange",
    Icon: FiBriefcase,
    moreHref: "/crm/reports/deals",
    links: [
      { label: "By stage (7)", href: "/crm/reports/deals" },
      { label: "This month (5)", href: "/crm/reports/deals-month" },
      { label: "This quarter (7)", href: "/crm/reports/deals-quarter" },
    ],
  },
  {
    title: "Quotations",
    description: "Shared, approved and discounted quotations.",
    tone: "yellow",
    Icon: FiFileText,
    moreHref: "/crm/reports/quotations",
    links: [
      { label: "Sent (4)", href: "/crm/reports/sent" },
      { label: "Approved (4)", href: "/crm/reports/won" },
      { label: "Discounted (11)", href: "/crm/reports/discounted" },
    ],
  },
  {
    title: "Activities",
    description: "Follow-ups logged against leads.",
    tone: "purple",
    Icon: FiActivity,
    moreHref: "/crm/reports/activities",
    links: [
      { label: "Logged (26)", href: "/crm/reports/activities" },
      { label: "Scheduled (10)", href: "/crm/reports/scheduled" },
      { label: "Overdue (6)", href: "/crm/reports/overdue" },
    ],
  },
];

const ReportCategory = () => {
  return (
    <>
      <h3 className={styles.rptSectionTitle}>Report Categories</h3>

      <div className={styles.rptCats}>
        {categories.map(
          ({ title, description, tone, Icon, moreHref, links }) => (
            <div
              key={title}
              className={`${styles.rptCat} ${styles[`tone-${tone}`]}`}
            >
              <div className={styles.rptCatIcon}>
                <Icon size={24} aria-hidden="true" />
              </div>
              <h4>{title}</h4>
              <p>{description}</p>

              <div className={styles.rptCatLinks}>
                {links.map((link) => (
                  <Link key={link.label} href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </div>

              <Link href={moreHref} className={styles.rptCatMore}>
                View Reports →
              </Link>
            </div>
          ),
        )}
      </div>
    </>
  );
};

export default ReportCategory;
