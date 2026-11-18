
import React, { useEffect, useState } from "react";
import styles from "./Layout.module.css";
import Navbar from "./navbar/Navbar";
import Sidebar from "./sidebar/Sidebar";

const COMPACT_SIDEBAR_QUERY = "(max-width: 1100px)";

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(COMPACT_SIDEBAR_QUERY);

    const handleChange = (event) => {
      const compact = event.matches;
      setIsCompact(compact);
      setSidebarCollapsed(compact);
    };

    handleChange(media);
    media.addEventListener("change", handleChange);

    return () => {
      media.removeEventListener("change", handleChange);
    };
  }, []);

  const handleToggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const handleExpandSidebar = () => {
    setSidebarCollapsed(false);
  };

  const handleCloseSidebar = () => {
    if (isCompact) {
      setSidebarCollapsed(true);
    }
  };

  return (
    <div
      className={`${styles.layout} ${
        !sidebarCollapsed ? styles.expanded : ""
      }`}
    >
      <Sidebar
        collapsed={sidebarCollapsed}
        onExpandSidebar={handleExpandSidebar}
      />

      {isCompact && !sidebarCollapsed && (
        <div
          className={styles.sidebarOverlay}
          onClick={handleCloseSidebar}
          aria-hidden="true"
        />
      )}

      <Navbar
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
      />

      <main className={styles.content} onClick={handleCloseSidebar}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
