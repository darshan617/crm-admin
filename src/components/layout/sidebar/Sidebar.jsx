import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiChevronDown, FiMessageSquare } from "react-icons/fi";
import { SIDEBAR_CHAT, SIDEBAR_SECTIONS } from "@/constants/sidebar";
import styles from "./Sidebar.module.css";
import usePermissions from "@/custom-hooks/permissions/usePermissions";
import { useMonthlyTargetQuery } from "@/redux/apis/crmDeals";

const Sidebar = ({ collapsed, onExpandSidebar }) => {
  const [manageOpen, setManageOpen] = useState(false);
  const { canView, loginAs, ready } = usePermissions();
  const isRestrictedTargetRole = ["admin", "super_admin"].includes(
    String(loginAs || "")
      .trim()
      .toLowerCase(),
  );
  const canSeeMonthlyTarget = ready && !isRestrictedTargetRole;
  const {
    data: monthlyTargetResponse,
    isLoading: isMonthlyTargetLoading,
    isError: isMonthlyTargetError,
  } = useMonthlyTargetQuery(undefined, {
    skip: collapsed || !canSeeMonthlyTarget,
  });

  const router = useRouter();
  const currentPath = router.asPath.split(/[?#]/)[0];
  const handleManageMouseEnter = () => {
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

  const target = monthlyTargetResponse?.data;
  const rawProgress = Number(target?.progress ?? target?.percent ?? 0);
  const progress = Number.isFinite(rawProgress)
    ? Math.min(100, Math.max(0, rawProgress))
    : 0;
  const currencySymbol = target?.currency_symbol || "₹";
  const amountLabel =
    target?.amount_label ||
    (target?.amount != null
      ? `${currencySymbol}${Number(target.amount).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "—");
  const statusText = isMonthlyTargetError
    ? "Unable to load target"
    : isMonthlyTargetLoading
      ? "Loading target..."
      : target?.status_text || "Target data unavailable";

  return (
    <aside
      id="main-sidebar"
      className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}
      aria-label="Main navigation"
    >
      <nav className={styles.navigation}>
        {SIDEBAR_SECTIONS?.map((section) => (
          <React.Fragment key={section?.key}>
            <span
              className={`${styles.sectionLabel} ${
                section.key !== "menu" ? styles.settingsLabel : ""
              }`}
            >
              {section?.name}
            </span>

            {section?.items?.map((item) => {
              const Icon = item.icon;

              if (item.children) {
                const visibleChildren = item.children.filter(
                  (child) => ready && canView(child.moduleKey),
                );

                if (!visibleChildren.length) return null;

                return (
                  <div
                    key={item?.key}
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

                      <span className={styles.navLabel}>{item?.name}</span>

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
                      {visibleChildren.map((child) => {
                        const childActive = currentPath === child.url;

                        return (
                          <Link
                            key={child?.key}
                            href={child?.url}
                            aria-current={childActive ? "page" : undefined}
                            tabIndex={manageOpen ? 0 : -1}
                            className={childActive ? styles.subnavActive : ""}
                          >
                            {child?.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              if (!canView(item.moduleKey)) return null;

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

      <div className={styles.footer}>
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
        {!collapsed && canSeeMonthlyTarget && (
          <div className={styles.monthlyTarget} aria-label="Monthly target">
            <div className={styles.monthlyTargetTitle}>
              {target?.title || "Monthly Target"}
            </div>
            <div className={styles.monthlyTargetPeriod}>
              {target?.period_label || target?.period || ""}
            </div>
            <div className={styles.monthlyTargetAmount}>{amountLabel}</div>
            <div className={styles.monthlyTargetStatus} title={statusText}>
              {statusText}
            </div>
            <div
              className={styles.monthlyTargetRing}
              style={{ "--progress": `${progress}%` }}
              role="img"
              aria-label={`${progress}% of monthly target`}
            />
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
