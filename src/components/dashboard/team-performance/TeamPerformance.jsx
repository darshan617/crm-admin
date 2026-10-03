import React from "react";
import Link from "next/link";
import { IoIosAdd } from "react-icons/io";
import { BsFileEarmarkArrowUp } from "react-icons/bs";
import { LuFilePlus2 } from "react-icons/lu";
import { FiUserPlus } from "react-icons/fi";
import styles from "@/components/dashboard/team-performance/TeamPerformance.module.css";

const TeamPerformance = () => {
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

  const team = [
    {
      name: "Wilson Thomas",
      role: "Sales Executive",
      color: "purple",
      leads: 85,
      calling: 60,
      deals: 25,
      conv: 25,
    },
    {
      name: "Maria Gonzalez",
      role: "Marketing Manager",
      color: "blue",
      leads: 95,
      calling: 70,
      deals: 30,
      conv: 31,
    },
    {
      name: "Ali Chen",
      role: "Product Designer",
      color: "teal",
      leads: 80,
      calling: 50,
      deals: 20,
      conv: 25,
    },
    {
      name: "Samantha Lee",
      role: "Customer Success",
      color: "purple",
      leads: 70,
      calling: 40,
      deals: 15,
      conv: 21,
    },
    {
      name: "Michael Tran",
      role: "Sales",
      color: "blue",
      leads: 85,
      calling: 50,
      deals: 22,
      conv: 26,
    },
  ];

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

      {/* TEAM PERFORMANCE */}
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
                {team.map((member) => (
                  <tr
                    key={member.name}
                    className={`${styles.teamPrRow} ${styles.tableRow}`}
                  >
                    <td className={styles.customer}>
                      <div className={styles.avatar}>{member.name[0]}</div>
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
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default TeamPerformance;
