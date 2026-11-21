"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "@/components/my-profile/MyProfile.module.css";
import Cookies from "js-cookie";
import {
  useMyProfileQuery,
  useUpdateProfileMutation,
} from "@/redux/apis/authApi";
import { useToast } from "@/custom-hooks/toast/ToastProvider";

const MAX_SIZE_MB = 2;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const MyProfile = () => {
  const { data, isLoading, isError, refetch } = useMyProfileQuery();
  const { showToast } = useToast();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

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

  // cleanup local preview object URL
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ---------- Avatar upload ---------- */
  const handleAvatarClick = () => {
    if (!isUploading) fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow selecting the same file again
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      showToast("Only JPG, PNG or WEBP images are allowed.", "error");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      showToast(`Image must be smaller than ${MAX_SIZE_MB}MB.`, "error");
      return;
    }

    setPreview(URL.createObjectURL(file));
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file); // <-- field name must match your backend

      const response = await updateProfile({ body: formData }).unwrap();

      // refresh profile so avatar_url comes from the API
      const result = await refetch();
      const newUrl =
        result?.data?.data?.profile?.avatar_url ||
        response?.data?.profile?.avatar_url ||
        response?.data?.avatar_url ||
        response?.data?.user?.avatar_url;

      const user = JSON.parse(Cookies.get("CRM_USER") || "{}");
      Cookies.set("CRM_USER", JSON.stringify({ ...user, avatar_url: newUrl }));
      window.dispatchEvent(new Event("crm-user-updated"));

      showToast(response?.message || "Profile picture updated.", "success");
    } catch (error) {
      showToast(error?.data?.message || "Failed to upload picture.", "error");
    } finally {
      setPreview(null);
      setIsUploading(false);
    }
  };

  /* ---------- Name submit ---------- */
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

  const profile = data?.data?.profile;
  const avatarSrc = preview || profile?.avatar_url;
  const nameInitial = (profile?.name || form.user_name || "U")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <main>
      <div className={styles.crmEmpShell}>
        <div className={styles.mainContent}>
          <div className={`${styles.commonTableCard} ${styles.profileCard}`}>
            <div className={styles.profileHeader}>
              <div className={styles.avatarWrap}>
                <div
                  className={styles.avatar}
                  onClick={handleAvatarClick}
                  role="button"
                  tabIndex={0}
                  title="Click to change profile picture"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleAvatarClick();
                  }}
                >
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt={profile?.name || "Profile"}
                      className={styles.avatarImg}
                    />
                  ) : (
                    <span>{nameInitial}</span>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleAvatarChange}
                  hidden
                />
              </div>

              <div>
                <h5 className="text-capitalize">{profile?.name || "User"}</h5>
                <p>{profile?.role_label || "N/A"}</p>
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
