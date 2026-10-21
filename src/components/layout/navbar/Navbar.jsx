import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { FiBell, FiSearch, FiChevronDown } from "react-icons/fi";
import styles from "./Navbar.module.css";
import {
  TbLayoutSidebarLeftExpand,
  TbLayoutSidebarRightExpand,
} from "react-icons/tb";
import { FaUser } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { MdLogout } from "react-icons/md";
import Cookies from "js-cookie";
import { useToast } from "@/custom-hooks/toast/ToastProvider";
import { useRouter } from "next/router";
import Image from "next/image";
import Sidebar from "../sidebar/Sidebar";

const subscribeToUserCookie = () => () => {};
const getUserCookieSnapshot = () => Cookies.get("CRM_USER") || null;
const getServerUserCookieSnapshot = () => null;

const Navbar = ({ sidebarCollapsed, onToggleSidebar }) => {
  const { showToast } = useToast();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const userCookie = useSyncExternalStore(
    subscribeToUserCookie,
    getUserCookieSnapshot,
    getServerUserCookieSnapshot,
  );
  const userData = useMemo(() => {
    if (!userCookie) return {};

    try {
      return JSON.parse(userCookie);
    } catch (error) {
      console.error("Invalid CRM_USER cookie:", error);
      return {};
    }
  }, [userCookie]);
  const profileRef = useRef(null);

  const handleLogout = () => {
    try {
      (Cookies?.remove("CRM_USER"),
        Cookies?.remove("token"),
        showToast("User Logout Successfully", "success"));
      router?.push("/auth/login");
    } catch (error) {
      console.log(error, "Error in handleLogout");
    }
  };

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

  const handleExpandSidebar = () => {
    setSidebarCollapsed(false);
  };

  return (
    <>
      <header className={styles.navbar}>
        <Sidebar
          collapsed={sidebarCollapsed}
          onExpandSidebar={handleExpandSidebar}
        />

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
              <div className={styles.avatar}>
                {userData?.name?.charAt(0) || "-"}
              </div>
              <div className={styles.profileInfo}>
                <h5>{userData?.name || "-"}</h5>
                <small>{userData?.role || "-"}</small>
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
                    <span>{userData?.name?.charAt(0) || "-"}</span>
                  </div>
                  <h2>{userData?.name || "-"}</h2>
                  <div className={styles.profileMeta}>
                    <span>Partner ID : {userData?.id || "-"}</span>
                    <span className={styles.adminBadge}>
                      {userData?.status || "-"}
                    </span>
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
                <button onClick={handleLogout} className={styles.logout}>
                  <MdLogout />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
      </header>
    </>
  );
};

export default Navbar;
