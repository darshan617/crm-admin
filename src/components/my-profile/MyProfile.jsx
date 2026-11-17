"use client";

import React, { useEffect, useState } from "react";
import styles from "@/components/my-profile/MyProfile.module.css";
import Cookies from "js-cookie";
import {
  useMyProfileQuery,
  useUpdateProfileMutation,
} from "@/redux/apis/authApi";
import { useToast } from "@/custom-hooks/toast/ToastProvider";

const MyProfile = () => {
  const { data, isLoading, isError, refetch } = useMyProfileQuery();
  const { showToast } = useToast();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [form, setForm] = useState({
    user_name: "",
    role: "",
    user_email: "",
    user_mobile: "",
  });

  useEffect(() => {
    const profile = data?.data?.profile;

    if (profile) {
      setForm({
        user_name: profile.name ?? "",
        role: profile.role_label ?? profile.role ?? "",
        user_email: profile.email ?? "",
        user_mobile: profile.mobile ?? "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.user_name.trim());

    try {
      const response = await updateProfile({ body: formData }).unwrap();

      const user = JSON.parse(Cookies.get("CRM_USER") || "{}");
      Cookies.set(
        "CRM_USER",
        JSON.stringify({ ...user, name: form.user_name.trim() }),
      );
      window.dispatchEvent(new Event("crm-user-updated"));

      showToast(
        response?.message || "Profile updated successfully.",
        "success",
      );
    } catch (error) {
      showToast(error?.data?.message || "Failed to update profile.", "error");
    }
  };

  if (isLoading) {
    return <p>Loading profile...</p>;
  }

  if (isError) {
    return (
      <div>
        <p>Failed to load profile.</p>
        <button type="button" onClick={() => refetch()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <main>
      <div className={styles.crmEmpShell}>
        <div className={styles.mainContent}>
          <div className={`${styles.commonTableCard} ${styles.profileCard}`}>
            <div className={styles.profileHeader}>
              <div className={styles.avatar}>
                {data?.data?.profile?.name?.charAt(0).toUpperCase() || "U"}
              </div>

              <div>
                <h5 className="text-capitalize">
                  {" "}
                  {data?.data?.profile?.name || "User"}
                </h5>
                <p>{data?.data?.profile?.role_label || "N/A"}</p>
              </div>
            </div>

            <h4 className={styles.sectionTitle}>Profile Information</h4>

            <form onSubmit={handleSubmit}>
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

                  <input
                    id="role"
                    type="text"
                    name="role"
                    value={form.role}
                    disabled
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="user_email">
                    Email <span>*</span>
                  </label>

                  <input
                    id="user_email"
                    type="email"
                    name="user_email"
                    value={form.user_email}
                    onChange={handleChange}
                    disabled
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="user_mobile">
                    Mobile <span>*</span>
                  </label>

                  <input
                    id="user_mobile"
                    type="tel"
                    name="user_mobile"
                    value={form.user_mobile}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);

                      setForm((prev) => ({
                        ...prev,
                        user_mobile: value,
                      }));
                    }}
                    maxLength={10}
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    disabled
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save"}
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
