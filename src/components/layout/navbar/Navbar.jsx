import React from "react";
import { FiBell, FiMenu, FiSearch } from "react-icons/fi";
import styles from "./Navbar.module.css";
import {
  TbLayoutSidebarLeftExpand,
  TbLayoutSidebarRightExpand,
} from "react-icons/tb";

const Navbar = ({ sidebarCollapsed, onToggleSidebar }) => {
  return (
    <header className={styles.navbar}>
      <button
        className={styles.sidebarButton}
        type="button"
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!sidebarCollapsed}
        aria-controls="main-sidebar"
        title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={onToggleSidebar}
      >
        {sidebarCollapsed ? (
          <TbLayoutSidebarLeftExpand />
        ) : (
          <TbLayoutSidebarRightExpand />
        )}
      </button>
      <label className={styles.search}>
        <span className={styles.visuallyHidden}>Search</span>
        <input type="search" placeholder="Search" />
        <FiSearch aria-hidden="true" />
      </label>
      <div className={styles.account}>
        <button
          className={styles.notification}
          type="button"
          aria-label="Notifications"
          title="Notifications"
        >
          <FiBell />
          <span className={styles.notificationDot} />
        </button>
        <div className={styles.user}>
          <span className={styles.avatar}>J</span>
          <span className={styles.userDetails}>
            <strong>Janak</strong>
            <small>Super Admin</small>
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
