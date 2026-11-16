import Layout from "@/components/layout/Layout";
import AccountSidebar from "@/components/my-profile/account-sidebar/AccountSidebar";
import MyProfile from "@/components/my-profile/MyProfile";
import styles from '@/components/my-profile/MyProfile.module.css'
import Link from "next/link";
import React from "react";
import { FiArrowLeft } from "react-icons/fi";

const index = () => {
  return (
    <Layout>
      <div className="row ">
        <div className={styles.pageHeader}>
          <div>
            <div className={styles.breadcrumb}>
              <p>
                <Link href="/dashboard">Dashboard</Link>
                <span>/</span>
                <span>My Profile</span>
              </p>
            </div>

            <h2>My Profile</h2>
          </div>

          <Link href="/dashboard" className={styles.backBtn}>
            <FiArrowLeft size={22} />
            <span>Back</span>
          </Link>
        </div>
        <div className="col-md-3">
          <AccountSidebar />
        </div>
        <div className="col-md-9">
          <MyProfile />
        </div>
      </div>
    </Layout>
  );
};

export default index;
