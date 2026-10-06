import React from "react";
import styles from "@/components/leads/lead-summary/LeadSummary.module.css";
import { FiUpload, FiUserPlus, FiUsers } from "react-icons/fi";
import {
  LuUserRoundCheck,
  LuUserRoundMinus,
  LuUserRoundPlus,
} from "react-icons/lu";
import { GoTrophy } from "react-icons/go";

const LeadSummary = () => {
  return (
    <div className="content">
      <div className="page-header">
        <div className="">
          <div className="breadcrumb welcome-text">
            <p>
              <a href="">Dashboard</a>
              <span>/</span>{" "}
            </p>
          </div>
          <h2>Leads </h2>
        </div>
        <div className={styles.crmActions}>
          <a href="/" className={styles.crmActionBtn}>
            <FiUpload />
            <span>Upload Leads</span>
          </a>

          <a
            href="add-new-lead.php"
            className={`${styles.crmActionBtn} ${styles.active}`}
          >
            <FiUserPlus />
            <span>Add New Leads</span>
          </a>
        </div>
      </div>
      <section className={styles.dashboardStats}>
        <div className={styles.statsGrid}>
          {/* <!-- Card 1 --> */}
          <div className={styles.summaryCard}>
            <div className={`${styles.cardIcon} ${styles.blue}`}>
              <FiUsers size={24}/>
            </div>

            <div className={styles.statContent}>
              <h4>Total Leads</h4>
              <h2>4,250</h2>
            </div>
          </div>

          {/* <!-- Card 2 --> */}
          <div className={styles.summaryCard}>
            <div className={`${styles.cardIcon} ${styles.green}`}>
              <LuUserRoundPlus  size={24}/>
            </div>

            <div className={styles.statContent}>
              <h4>New Leads</h4>
              <h2>145</h2>
            </div>
          </div>

          {/* <!-- Card 3 --> */}
          <div className={styles.summaryCard}>
            <div className={`${styles.cardIcon} ${styles.orange}`}>
              <LuUserRoundCheck size={24} />
            </div>

            <div className={styles.statContent}>
              <h4>Qualified Leads</h4>
              <h2>35</h2>
            </div>
          </div>

          {/* <!-- Card 4 --> */}
          <div className={styles.summaryCard}>
            <div className={`${styles.cardIcon} ${styles.purple}`}>
              <GoTrophy size={24} />
            </div>

            <div className={styles.statContent}>
              <h4>Won Leads</h4>
              <h2>15</h2>
            </div>
          </div>

          {/* <!-- Card 5 --> */}
          <div className={styles.summaryCard}>
            <div className={`${styles.cardIcon} ${styles.red}`}>
              <LuUserRoundMinus size={24} />
            </div>

            <div className={styles.statContent}>
              <h4>Lost Leads</h4>
              <h2>5</h2>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LeadSummary;
