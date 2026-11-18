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

const ICONS = {
  "trending-up": FiTrendingUp,
  users: FiUsers,
  briefcase: FiBriefcase,
  "file-text": FiFileText,
  activity: FiActivity,
};

const toLocalHref = (href) => {
  if (!href) return "/reports";
  const path = href.startsWith("http")
    ? new URL(href).pathname
    : href;
  const slug = path.split("/").filter(Boolean).pop();
  return slug ? `/reports/${slug}` : "/reports";
};

const ReportCategory = ({ categories = [] }) => {
  return (
    <>
      <h3 className={styles.rptSectionTitle}>Report Categories</h3>

      <div className={styles.rptCats}>
        {categories.map(({ icon, title, desc, tone, href, links }) => {
          const Icon = ICONS[icon] || FiFileText;

          return (
            <div
              key={title}
              className={`${styles.rptCat} ${styles[`tone-${tone}`] || ""}`}
            >
              <div className={styles.rptCatIcon}>
                <Icon size={24} aria-hidden="true" />
              </div>
              <h4>{title}</h4>
              <p>{desc}</p>

              <div className={styles.rptCatLinks}>
                {links?.map((link) => (
                  <Link key={link.text} href={toLocalHref(link.href)}>
                    {link.text}
                  </Link>
                ))}
              </div>

              <Link href={toLocalHref(href)} className={styles.rptCatMore}>
                View Reports →
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ReportCategory;
