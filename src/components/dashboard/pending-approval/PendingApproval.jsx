import React from "react";
import styles from "@/components/dashboard/pending-approval/PendingApproval.module.css";
import { FiPercent, FiPhoneCall } from "react-icons/fi";
import { LuCalendarDays, LuUserRoundPlus } from "react-icons/lu";
import usePermissions from "@/custom-hooks/permissions/usePermissions";

const PendingApproval = ({ recentActivities, summary }) => {
  const { canView } = usePermissions();

  const approvals = [
    {
      title: "Discount Approval",
      value: summary?.pending_discount_approvals ?? 0,
      icon: <FiPercent />,
      color: styles.blue,
      moduleKey: "discount_approval",
    },
    {
      title: "Pending Quotations",
      value: summary?.pending_quotations ?? 0,
      icon: <FiPhoneCall />,
      color: styles.orange,
      moduleKey: "quotations",
    },
    {
      title: "New Lead Assignments",
      value: summary?.new_lead_assignments ?? 0,
      icon: <LuUserRoundPlus />,
      color: styles.purple,
      moduleKey: "leads",
    },
    {
      title: "Lead Assignment Requests",
      value: summary?.pending_lead_assignment_requests ?? 0,
      icon: <LuCalendarDays />,
      color: styles.teal,
      moduleKey: "leads",
    },
  ].filter((item) => canView(item.moduleKey));

  const activityList = (recentActivities?.items || [])?.map((a) => ({
    text: a.message,
    timeAgo: a.time,
    icon: <LuUserRoundPlus />,
    color: styles.purple,
  }));

  const showApprovals = approvals.length > 0;
  const showActivities = canView("dashboard") || canView("leads");

  if (!showApprovals && !showActivities) return null;

  return (
    <section
      className={styles.approvalActivitySection}
      style={
        showApprovals && showActivities
          ? undefined
          : { gridTemplateColumns: "1fr" }
      }
    >
      {showApprovals && (
        <div className="approval-column">
          <div className={styles.commonTableHeader}>
            <h3>Pending Approvals</h3>
            {canView("follow_ups") && (
              <a href="/follow-up" className={styles.viewAll}>
                View All Tasks
              </a>
            )}
          </div>

          <div className={styles.approvalList}>
            {approvals.map((item) => (
              <div key={item.title} className={styles.approvalItem}>
                <div className={`${styles.approvalIcon} ${item.color}`}>
                  {item.icon}
                </div>
                <span>{item.title}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {showActivities && (
        <div className="activity-column">
          <div className={styles.commonTableHeader}>
            <h3>Recent Activities</h3>
            {canView("leads") && (
              <a href="/leads" className={styles.viewAll}>
                View All
              </a>
            )}
          </div>

          <div className={styles.activityCard}>
            {activityList.length === 0 ? (
              <p>No recent activities</p>
            ) : (
              activityList.map((item, index) => (
                <div key={index} className={styles.activityItem}>
                  <div className={`${styles.activityIcon} ${item.color}`}>
                    {item.icon}
                  </div>
                  <div className={styles.activityContent}>
                    <p>{item.text}</p>
                    <small>{item.timeAgo}</small>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default PendingApproval;