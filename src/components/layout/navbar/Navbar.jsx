import React, { useState, useRef, useEffect } from "react";
import { FiBell, FiSearch, FiChevronDown } from "react-icons/fi";
import styles from "./Navbar.module.css";
import {
  TbLayoutSidebarLeftExpand,
  TbLayoutSidebarRightExpand,
} from "react-icons/tb";
import { FaUser } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { MdLogout } from "react-icons/md";

const Navbar = ({ sidebarCollapsed, onToggleSidebar }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

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
          <TbLayoutSidebarLeftExpand size={24} />
        ) : (
          <TbLayoutSidebarRightExpand size={24} />
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
          <span className={styles.notificationDot}>5</span>
        </button>

        <div className={styles.profileWrapper} ref={profileRef}>
          <button
            type="button"
            className={styles.profile}
            aria-haspopup="menu"
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen((o) => !o)}
          >
            <div className={styles.avatar}>J</div>
            <div className={styles.profileInfo}>
              <h5>Janak</h5>
              <small>Super Admin</small>
            </div>
            <FiChevronDown
              className={`${styles.profileArrow} ${
                profileOpen ? styles.arrowOpen : ""
              }`}
            />
          </button>

          <div
            className={`${styles.profileDropdown} ${
              profileOpen ? styles.show : ""
            }`}
          >
            <div className={styles.profileCard}>
              <div className={styles.profilePattern}></div>
              <div className={styles.profileContent}>
                <div className={styles.profileAvatar}>
                  <span>J</span>
                </div>
                <h2>Janak Singh</h2>
                <div className={styles.profileMeta}>
                  <span>Partner ID : P123456</span>
                  <span className={styles.adminBadge}>Admin</span>
                </div>
              </div>
            </div>

            <div className={styles.profileMenu}>
              <a href="/">
                <FaUser />
                <span>My Profile</span>
              </a>
              <a href="/">
                <CiSettings />
                <span>Settings</span>
              </a>
              <div className={styles.profileDivider}></div>
              <a href="/" className={styles.logout}>
                <MdLogout />
                <span>Logout</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;