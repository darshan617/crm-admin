import AccountSetting from "@/components/account-setting/AccountSetting";
import Layout from "@/components/layout/Layout";
import AccountSidebar from "@/components/my-profile/account-sidebar/AccountSidebar";
import styles from '@/components/account-setting/AccountSetting.module.css'
import React from "react";
import Link from "next/link";

const index = () => {
  return (
    <Layout>
      <div className={styles.header}>
        <div>
          <p className={styles.breadcrumb}>
            <Link href="/dashboard">Dashboard</Link>
            <span>/</span>
            <Link href="/my-profile">My Profile</Link>
            <span>/</span>
            <span>Settings</span>
          </p>

          <h2 className={styles.title}>Settings</h2>
        </div>

        <Link href="/profile" className={styles.backBtn}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          <span>Back</span>
        </Link>
      </div>
      <div className="row">
        <div className="col-md-3">
          <AccountSidebar />
        </div>
        <div className="col-md-9">
          <AccountSetting />
        </div>
      </div>
    </Layout>
  );
};

export default index;
