import React from "react";
import Link from "next/link";

import { IoIosAdd } from "react-icons/io";
import { BsFileEarmarkArrowUp } from "react-icons/bs";
import { LuFilePlus2 } from "react-icons/lu";
import { FiUserPlus } from "react-icons/fi";

import styles from "@/components/dashboard/team-performance/TeamPerformance.module.css";

const TeamPerformance = ({ team }) => {
  const quickActions = [
    { href: "/add-new-leads", icon: IoIosAdd, label: "Add Leads" },
    {
      href: "/upload-leads",
      icon: BsFileEarmarkArrowUp,
      label: "Upload Leads",
    },
    {
      href: "/",
      icon: LuFilePlus2,
      label: "Add Quotation",
    },
    { href: "/", icon: FiUserPlus, label: "Add Employee" },
  ];

  const filters = [
    { label: "Today", active: false },
    { label: "Last 7 days", active: true },
    { label: "Last Month", active: false },
  ];

  const teamMembers = (Array.isArray(team) ? team : []).map((m) => ({
    name: m?.name ?? "Unknown",
    role: m?.role ?? "",
    leads: m?.leads ?? 0,
    calling: m?.calling ?? 0,
    deals: m?.deals ?? 0,
    conv: m?.conversion ?? 0,
  }));

  const stats = [
    { label: "LEADS", key: "leads" },
    { label: "CALLING", key: "calling" },
    { label: "DEALS", key: "deals" },
    { label: "CONV", key: "conv" },
  ];

  return (
    <>
      <div className={styles.newQuickActions}>
        {quickActions.map(({ href, icon: Icon, label }) => (
          <Link key={label} href={href} className={styles.quickBtn}>
            <Icon />
            <span>{label}</span>
          </Link>
        ))}
      </div>

      <section className={styles.commonTableSection}>
        <div className={styles.commonTableCard}>
          <div className={styles.commonTableHeader}>
            <div>
              <h3>TEAM PERFORMANCE</h3>
            </div>

            <div className={styles.salesFilter}>
              {filters.map((f) => (
                <button
                  key={f.label}
                  className={f.active ? styles.active : undefined}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <table className={styles.teamTable}>
              <tbody className={styles.tableBody}>
                {teamMembers.slice(0, 5).map((member, index) => (
                  <tr
                    key={`${member.name}-${index}`}
                    className={`${styles.teamPrRow} ${styles.tableRow}`}
                  >
                    <td className={styles.customer}>
                      <div className={styles.avatar}>
                        {member.name?.[0] || "U"}
                      </div>

                      <div>
                        <h5>{member.name}</h5>
                        <p>{member.role}</p>
                      </div>
                    </td>

                    {stats.map((s) => (
                      <td key={s.key} className={styles.teamNum}>
                        <small>{s.label}</small>
                        <strong>{member[s.key]}</strong>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <a href="/reports" className={styles.viewAll}>
                View All
              </a>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default TeamPerformance;
