import React from "react";
import styles from "@/components/dashboard/account-summary/AccountSummary.module.css";
import { FiPhoneCall } from "react-icons/fi";
import {
  LuCalendarClock,
  LuCalendarDays,
  LuClipboardCheck,
} from "react-icons/lu";
import { CiClock2 } from "react-icons/ci";
import { AiOutlineExclamationCircle } from "react-icons/ai";

const AccountSummary = () => {
  return (
    <section>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.welcomeText}>Welcome,</p>
          <h2>Janak Singh</h2>
        </div>

        <div className={styles.summarySection}>
          <div className={styles.commonTableHeader}>
            <div className={styles.summaryHeader}>
              <h3>Account Summary</h3>
            </div>

            <div className={styles.dateRange}>
              <div className={styles.dateInput}>
                <input type="date" />
              </div>

              <div className={styles.dateInput}>
                <input type="date" />
              </div>
            </div>
          </div>

          <div className={`${styles.summaryGrid} stats-grid`}>
            {/* <!-- Card 1 --> */}
            <div className={`${styles.summaryCard} ${styles.blue} `}>
              <div className={styles.cardIcon}>
                <FiPhoneCall />
              </div>
              <p>Total Leads</p>
              <h3>4,250</h3>
            </div>

            {/* <!-- Card 2 --> */}
            <div className={`${styles.summaryCard} ${styles.green}  `}>
              <div className={styles.cardIcon}>
                <LuClipboardCheck />
              </div>
              <p>Pending Follow-ups</p>
              <h3>145</h3>
            </div>

            {/* <!-- Card 3 --> */}
            <div className={`${styles.summaryCard} ${styles.yellow} `}>
              <div className={styles.cardIcon}>
                <CiClock2 />
              </div>
              <p>Pending Quotations</p>
              <h3>35</h3>
            </div>

            {/* <!-- Card 4 --> */}
            <div className={`${styles.summaryCard} ${styles.purple} `}>
              <div className={styles.cardIcon}>
                <LuCalendarClock />
              </div>
              <p>Meetings Scheduled</p>
              <h3>0</h3>
            </div>

            {/* <!-- Card 5 --> */}
            <div className={`${styles.summaryCard} ${styles.red} `}>
              <div className={styles.cardIcon}>
                <AiOutlineExclamationCircle />
              </div>
              <p>Overdue Tasks</p>
              <h3>5</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccountSummary;
