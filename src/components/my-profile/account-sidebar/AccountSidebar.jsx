import React from "react";
import styles from "@/components/my-profile/MyProfile.module.css";
import { FiSettings, FiUser } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/router";
const AccountSidebar = () => {
  const accountLinks = [
    {
      label: "My Profile",
      href: "/my-profile",
      icon: FiUser,
    },
    {
      label: "Settings",
      href: "/account-settings",
      icon: FiSettings,
    },
  ];

  const router = useRouter();
  return (
    <div className={`${styles.commonTableCard1} ${styles.employeePanelCard}`}>
      <p className={styles.employeePanelTitle}>Account</p>

      <ul className={styles.employeePanelList}>
        {accountLinks.map((item) => {
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${styles.employeePanelLink} ${
                  router.pathname === item.href ? styles.active : ""
                }`}
              >
                <Icon size={24} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AccountSidebar;
