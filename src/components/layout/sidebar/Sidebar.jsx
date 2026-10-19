import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiChevronDown, FiMessageSquare } from "react-icons/fi";
import { SIDEBAR_CHAT, SIDEBAR_SECTIONS } from "@/constants/sidebar";
import styles from "./Sidebar.module.css";

const Sidebar = ({ collapsed, onExpandSidebar }) => {
  const [manageOpen, setManageOpen] = useState(false);

  const router = useRouter();
  const currentPath = router.asPath.split(/[?#]/)[0];

  const handleManageMouseEnter = () => {
    if (collapsed) {
      onExpandSidebar?.();
    }

    setManageOpen(true);
  };

  const handleManageMouseLeave = () => {
    setManageOpen(false);
  };

  const handleManageFocus = () => {
    setManageOpen(true);
  };

  const handleManageBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setManageOpen(false);
    }
  };

  return (
    <aside
      id="main-sidebar"
      className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}
      aria-label="Main navigation"
    >
      <nav className={styles.navigation}>
        {SIDEBAR_SECTIONS.map((section) => (
          <React.Fragment key={section.key}>
            <span
              className={`${styles.sectionLabel} ${
                section.key !== "menu" ? styles.settingsLabel : ""
              }`}
            >
              {section.name}
            </span>

            {section.items.map((item) => {
              const Icon = item.icon;

              if (item.children) {
                return (
                  <div
                    key={item.key}
                    className={styles.manageWrapper}
                    onMouseEnter={handleManageMouseEnter}
                    onMouseLeave={handleManageMouseLeave}
                    onFocus={handleManageFocus}
                    onBlur={handleManageBlur}
                  >
                    <button
                      className={`${styles.navItem} ${styles.manage} ${
                        styles.manageButton
                      }`}
                      type="button"
                      aria-label={item.name}
                      aria-expanded={manageOpen}
                      aria-controls="manage-submenu"
                      title={collapsed ? item.name : undefined}
                    >
                      <span className={styles.navIcon}>
                        <Icon aria-hidden="true" />
                      </span>

                      <span className={styles.navLabel}>{item.name}</span>

                      <FiChevronDown
                        className={`${styles.chevron} ${
                          manageOpen ? styles.chevronOpen : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>

                    <div
                      id="manage-submenu"
                      className={`${styles.subnav} ${
                        manageOpen ? styles.subnavOpen : ""
                      }`}
                      aria-hidden={!manageOpen}
                      inert={!manageOpen}
                    >
                      {item.children.map((child) => {
                        const childActive = currentPath === child.url;

                        return (
                          <Link
                            key={child.key}
                            href={child.url}
                            aria-current={childActive ? "page" : undefined}
                            tabIndex={manageOpen ? 0 : -1}
                            className={childActive ? styles.subnavActive : ""}
                          >
                            {child.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
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
