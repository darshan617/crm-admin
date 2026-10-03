import React from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiChevronDown, FiMessageSquare } from "react-icons/fi";
import { SIDEBAR_CHAT, SIDEBAR_SECTIONS } from "@/constants/sidebar";
import styles from "./Sidebar.module.css";

const Sidebar = ({ collapsed, onExpandSidebar }) => {
  const [manageOpen, setManageOpen] = useState(true);
  const router = useRouter();
  const currentPath = router.asPath.split(/[?#]/)[0];

  const toggleManage = () => {
    if (collapsed) {
      setManageOpen(true);
      onExpandSidebar();
      return;
    }

    setManageOpen((open) => !open);
  };

  return (
    <aside
      id="main-sidebar"
      className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}
      aria-label="Main navigation"
    >
      <div className={styles.brand}>
        <Image
          className={styles.brandLogo}
          src="/logo.png"
          alt="Tizz Group"
          width={150}
          height={42}
          priority
        />
      </div>
      <nav className={styles.navigation}>
        {SIDEBAR_SECTIONS.map((section) => (
          <React.Fragment key={section.key}>
            <span
              className={`${styles.sectionLabel} ${section.key !== "menu" ? styles.settingsLabel : ""}`}
            >
              {section.name}
            </span>
            {section.items.map((item) => {
              const Icon = item.icon;

              if (item.children) {
                return (
                  <React.Fragment key={item.key}>
                    <button
                      className={`${styles.navItem} ${styles.manage} ${styles.manageButton}`}
                      type="button"
                      aria-label={item.name}
                      aria-expanded={manageOpen}
                      aria-controls="manage-submenu"
                      title={collapsed ? item.name : undefined}
                      onClick={toggleManage}
                    >
                      <span className={styles.navIcon}>
                        <Icon aria-hidden="true" />
                      </span>
                      <span className={styles.navLabel}>{item.name}</span>
                      <FiChevronDown
                        className={`${styles.chevron} ${manageOpen ? styles.chevronOpen : ""}`}
                        aria-hidden="true"
                      />
                    </button>
                    {manageOpen && (
                      <div id="manage-submenu" className={styles.subnav}>
                        {item.children.map((child) => (
                          <Link
                            key={child.key}
                            href={child.url}
                            aria-current={
                              currentPath === child.url ? "page" : undefined
                            }
                            className={
                              currentPath === child.url
                                ? styles.subnavActive
                                : ""
                            }
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </React.Fragment>
                );
              }

              const active =
                currentPath === item.url ||
                (item.key === "dashboard" && currentPath === "/");

              return (
                <Link
                  key={item.key}
                  className={`${styles.navItem} ${active ? styles.active : ""}`}
                  href={item.url}
                  aria-label={item.name}
                  aria-current={active ? "page" : undefined}
                  title={collapsed ? item.name : undefined}
                >
                  <span className={styles.navIcon}>
                    <Icon aria-hidden="true" />
                  </span>
                  <span className={styles.navLabel}>{item.name}</span>
                </Link>
              );
            })}
          </React.Fragment>
        ))}
      </nav>
      <Link
        className={styles.chat}
        href={SIDEBAR_CHAT.url}
        aria-label={SIDEBAR_CHAT.name}
        title={collapsed ? SIDEBAR_CHAT.name : undefined}
      >
        <span className={styles.navIcon}>
          <FiMessageSquare aria-hidden="true" />
        </span>
        <span className={styles.navLabel}>{SIDEBAR_CHAT.name}</span>
      </Link>
    </aside>
  );
};

export default Sidebar;
