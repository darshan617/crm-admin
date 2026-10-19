
import React, { useEffect, useState } from "react";
import styles from "./Layout.module.css";
import Navbar from "./navbar/Navbar";
import Sidebar from "./sidebar/Sidebar";

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 992;
      setIsMobile(mobile);

      if (!mobile) {
        setSidebarCollapsed(false);
      } else {
        setSidebarCollapsed(true);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleToggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const handleExpandSidebar = () => {
    setSidebarCollapsed(false);
  };

  const handleCloseSidebar = () => {
    if (isMobile) {
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

      {isMobile && !sidebarCollapsed && (
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
