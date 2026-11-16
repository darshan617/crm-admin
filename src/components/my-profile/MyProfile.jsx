"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import styles from "@/components/my-profile/MyProfile.module.css";

const MyProfile = () => {
  const [form, setForm] = useState({
    user_name: "SUPERADMIN",
    role: "Superadmin",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <main className="">
      <div className={styles.crmEmpShell}>
        {/* Main Content */}
        <div className={styles.mainContent}>
          

          <div className={`${styles.commonTableCard} ${styles.profileCard}`}>
            <div className={styles.profileHeader}>
              <div className={styles.avatar}>
                {form.user_name?.charAt(0).toUpperCase() || "S"}
              </div>

              <div>
                <h5>{form.user_name}</h5>
                <p>{form.role}</p>
              </div>
            </div>

            <h4 className={styles.sectionTitle}>Profile Information</h4>

            <form>
              <div className={styles.crmEmpFields}>
                <div className={styles.formGroup}>
                  <label htmlFor="user_name">
                    Name <span>*</span>
                  </label>

                  <input
                    id="user_name"
                    type="text"
                    name="user_name"
                    value={form.user_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="role">Role</label>

                  <input id="role" type="text" value={form.role} disabled />
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitBtn}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MyProfile;
