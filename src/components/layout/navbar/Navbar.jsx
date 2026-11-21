import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { FiBell, FiSearch, FiChevronDown, FiX, FiUser } from "react-icons/fi";
import styles from "./Navbar.module.css";
import {
  TbLayoutSidebarLeftExpand,
  TbLayoutSidebarRightExpand,
} from "react-icons/tb";
import { CiSettings } from "react-icons/ci";
import { MdLogout } from "react-icons/md";
import Cookies from "js-cookie";
import { useToast } from "@/custom-hooks/toast/ToastProvider";
import { useRouter } from "next/router";
import Image from "next/image";
import { useMyProfileQuery } from "@/redux/apis/authApi";

const subscribeToUserCookie = (onStoreChange) => {
  window.addEventListener("crm-user-updated", onStoreChange);
  return () => window.removeEventListener("crm-user-updated", onStoreChange);
};
const getUserCookieSnapshot = () => Cookies.get("CRM_USER") || null;
const getServerUserCookieSnapshot = () => null;

const resolveAvatarUrl = (avatar) => {
  if (!avatar || typeof avatar !== "string") return "";

  if (
    avatar.startsWith("http://") ||
    avatar.startsWith("https://") ||
    avatar.startsWith("blob:") ||
    avatar.startsWith("data:")
  ) {
    return avatar;
  }

  const base = (process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "").replace(
    /\/+$/,
    "",
  );

  if (!base) return avatar;

  return `${base}/${avatar.replace(/^\/+/, "")}`;
};

const Navbar = ({ sidebarCollapsed, onToggleSidebar }) => {
  const { showToast } = useToast();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Support Ticket",
      message: "A new support ticket has been created.",
      time: "5 minutes ago",
      unread: true,
    },
    {
      id: 2,
      title: "Payment Received",
      message: "Payment of ₹12,500 received successfully.",
      time: "20 minutes ago",
      unread: true,
    },
    {
      id: 3,
      title: "Invoice Pending",
      message: "Invoice #INV1025 is pending payment.",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 4,
      title: "New Customer",
      message: "A new customer has been registered.",
      time: "2 hours ago",
      unread: false,
    },
    {
      id: 5,
      title: "Ticket Escalated",
      message: "Support ticket SUP0011 has been escalated.",
      time: "3 hours ago",
      unread: false,
    },
  ]);
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
  const { data: profileResponse } = useMyProfileQuery(undefined, {
    skip: !userCookie,
  });
  const profile = profileResponse?.data?.profile;
  const displayName = profile?.name || userData?.name || "";
  const nameInitial = displayName.trim().charAt(0).toUpperCase() || "-";
  const avatarSrc = resolveAvatarUrl(
    profile?.avatar_url || userData?.avatar_url,
  );
  const [avatarFailed, setAvatarFailed] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    setAvatarFailed(false);
  }, [avatarSrc]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markOneRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );

  const handleLogout = () => {
    try {
      (Cookies?.remove("CRM_USER"),
        Cookies?.remove("token"),
        localStorage.removeItem("UP"),
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
      if (e.key === "Escape") {
        setProfileOpen(false);
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <>
      <header className={styles.navbar}>
        <div className={styles.brand}>
          <Image
            className={styles.brandLogo}
            src="/logo.png"
            alt="Tizz Group"
            width={150}
            height={42}
            priority
            unoptimized
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
            onClick={() => setNotificationOpen(true)}
          >
            <FiBell />
            {unreadCount > 0 && (
              <span className={styles.notificationDot}>{unreadCount}</span>
            )}
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
                {avatarSrc && !avatarFailed ? (
                  <img
                    src={avatarSrc}
                    alt={displayName || "Profile"}
                    className={styles.avatarImg}
                    onError={() => setAvatarFailed(true)}
                  />
                ) : (
                  nameInitial
                )}
              </div>
              <div className={styles.profileInfo}>
                <h5 className="text-capitalize">{displayName || "-"}</h5>
                <small>{userData?.role || profile?.role_label || "-"}</small>
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
                  <div
                    className={`${styles.profileAvatar} ${
                      avatarSrc && !avatarFailed ? styles.profileAvatarPhoto : ""
                    }`}
                  >
                    {avatarSrc && !avatarFailed ? (
                      <img
                        src={avatarSrc}
                        alt={displayName || "Profile"}
                        className={styles.avatarImg}
                      />
                    ) : (
                      <span className="text-capitalize">{nameInitial}</span>
                    )}
                  </div>
                  <h2 className="text-capitalize">{displayName || "-"}</h2>
                  <div className={styles.profileMeta}>
                    <span>Partner ID : {userData?.id || "-"}</span>
                    <span className={styles.adminBadge}>
                      {userData?.status || "-"}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.profileMenu}>
                <a href="/my-profile">
                  <FiUser />
                  <span>My Profile</span>
                </a>
                <a href="/account-settings">
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
      </header>

      {/* Notification sidebar */}
      <div
        className={`${styles.notifOverlay} ${
          notificationOpen ? styles.notifOpen : ""
        }`}
        onClick={() => setNotificationOpen(false)}
      />

      <aside
        className={`${styles.notifSidebar} ${
          notificationOpen ? styles.notifOpen : ""
        }`}
        aria-hidden={!notificationOpen}
      >
        <div className={styles.notifHeader}>
          <div>
            <h3>Notifications</h3>
            <p>{unreadCount} new notifications</p>
          </div>

          <button
            type="button"
            className={styles.notifClose}
            aria-label="Close notifications"
            onClick={() => setNotificationOpen(false)}
          >
            <FiX size={22} />
          </button>
        </div>

        <div className={styles.notifBody}>
          {notifications.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`${styles.sideNotification} ${
                item.unread ? styles.unread : ""
              }`}
              onClick={() => markOneRead(item.id)}
            >
              <div className={styles.sideNotificationTop}>
                <h4>{item.title}</h4>
                {item.unread && <span className={styles.sideDot} />}
              </div>
              <p>{item.message}</p>
              <small>{item.time}</small>
            </button>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Navbar;
