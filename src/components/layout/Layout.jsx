import React, { useState } from "react";
import Navbar from "./navbar/Navbar";
import Sidebar from "./sidebar/Sidebar";
import styles from "./Layout.module.css";

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div
      className={`${styles.layout} ${sidebarCollapsed ? styles.collapsed : styles.expanded}`}
    >
      <Sidebar
        collapsed={sidebarCollapsed}
        onExpandSidebar={() => setSidebarCollapsed(false)}
      />
      <Navbar
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((collapsed) => !collapsed)}
      />
      <main className={styles.content}>{children}</main>
    </div>
  );
};

export default Layout;
