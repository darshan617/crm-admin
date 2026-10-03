import React from "react";
import styles from "@/components/dashboard/pending-approval/PendingApproval.module.css"
import { FiFileText, FiPercent, FiPhoneCall } from "react-icons/fi";
import { LuCalendarDays, LuUserRoundPlus } from "react-icons/lu";
import { FaCheck } from "react-icons/fa"; 
import { IoMdCheckmark } from "react-icons/io";

const PendingApproval = () => {
  return (
    <section className={styles.approvalActivitySection}>
      {/* <!-- Pending Approvals --> */}
      <div className="approval-column">
        <div className={styles.commonTableHeader}>
          <h3>Pending Approvals</h3>
          <a href="#" className={styles.viewAll}>
            View All Tasks
          </a>
        </div>

        <div className={styles.approvalList}>
          {/* <!-- Item 1 --> */}
          <div className={styles.approvalItem }>
            <div className={`${styles.approvalIcon} ${styles.blue} `}>
              <FiPercent   />
            </div>

            <span>Discount Approval</span>

            <strong>22</strong>
          </div>

          {/* <!-- Item 2 --> */}
          <div className={styles.approvalItem }>
            <div className={`${styles.approvalIcon} ${styles.orange} `}>
              <FiPhoneCall />
            </div>

            <span>Pending Quotations</span>

            <strong>5</strong>
          </div>

          {/* <!-- Item 3 --> */}
          <div className={styles.approvalItem }>
            <div className={`${styles.approvalIcon} ${styles.purple}`}>
              <LuUserRoundPlus />
            </div>

            <span>New Lead Assignments</span>

            <strong>12</strong>
          </div>

          {/* <!-- Item 4 --> */}
          <div className={styles.approvalItem }>
            <div className={`${styles.approvalIcon} ${styles.teal}`}>
              <LuCalendarDays />
            </div>

            <span>Lead Assignment Requests</span>

            <strong>2</strong>
          </div>
        </div>
      </div>

      {/* <!-- Recent Activities --> */}
      <div className="activity-column">
        <div className={styles.commonTableHeader}>
          <h3>Recent Activities</h3>
          <a href="#" className={styles.viewAll}>
            View All
          </a>
        </div>

        <div className={styles.activityCard}>
          {/* <!-- Activity 1 --> */}
          <div className={styles.activityItem}>
            <div className={`${styles.activityIcon} ${styles.blue}`}>
              <FiPhoneCall />
            </div>

            <div className={styles.activityContent}>
              <p>
                Call completed with
                <span>Reliance Retail</span>
              </p>
              <small>10 mins ago</small>
            </div>
          </div>

          {/* <!-- Activity 2 --> */}
          <div className={styles.activityItem}>
            <div className={`${styles.activityIcon} ${styles.orange}`}>
              <FiFileText />
            </div>

            <div className={styles.activityContent}>
              <p>
                Quotation created for
                <span>Tech Mahindra</span>
              </p>
              <small>45 mins ago</small>
            </div>
          </div>

          {/* <!-- Activity 3 --> */}
          <div className={styles.activityItem}>
            <div className={`${styles.activityIcon} ${styles.teal}`}>
              <IoMdCheckmark  />
            </div>

            <div className={styles.activityContent}>
              <p>
                Deal moved to Negotiation for
                <span>Wipro</span>
              </p>
              <small>2 hours ago</small>
            </div>
          </div>

          {/* <!-- Activity 4 --> */}
          <div className={styles.activityItem}>
            <div className={`${styles.activityIcon} ${styles.purple}`}>
              <LuUserRoundPlus />
            </div>

            <div className={styles.activityContent}>
              <p>
                Lead updated
                <span>Infosys Enterprise</span>
              </p>
              <small>3 hours ago</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PendingApproval;
