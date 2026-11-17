"use client";

import React, { useState } from "react";
import styles from "@/components/account-setting/AccountSetting.module.css";
import { useChanagePasswordMutation } from "@/redux/apis/authApi";
import { useToast } from "@/custom-hooks/toast/ToastProvider";

const initialForm = {
  current_password: "",
  password: "",
  password_confirmation: "",
};

const fields = [
  {
    name: "current_password",
    label: "Current Password",
    autoComplete: "current-password",
  },
  {
    name: "password",
    label: "New Password",
    autoComplete: "new-password",
    minLength: 6,
  },
  {
    name: "password_confirmation",
    label: "Confirm Password",
    autoComplete: "new-password",
  },
];

const AccountSetting = () => {
  const [form, setForm] = useState(initialForm);

  const [chanagePassword, { isLoading }] = useChanagePasswordMutation();

  const { showToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.password_confirmation) {
      showToast("New password and confirm password do not match.", "error");
      return;
    }

    if (form.password.length < 6) {
      showToast("New password must be at least 6 characters.", "error");
      return;
    }

    if (form.current_password === form.password) {
      showToast(
        "New password must be different from current password.",
        "error",
      );
      return;
    }

    try {
      const response = await chanagePassword({
        body: {
          current_password: form.current_password,
          password: form.password,
          password_confirmation: form.password_confirmation,
        },
      }).unwrap();

      showToast(
        response?.message || "Password updated successfully.",
        "success",
      );

      setForm({ ...initialForm });
    } catch (error) {
      const validationErrors = error?.data?.errors;

      const firstError = validationErrors
        ? Object.values(validationErrors).flat()[0]
        : null;

      showToast(
        firstError ||
          error?.data?.message ||
          "Failed to update password. Please try again.",
        "error",
      );
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h4 className={styles.cardTitle}>Change Password</h4>

        <form onSubmit={handleSubmit}>
          <div className={styles.fields}>
            {fields.map((field) => (
              <div className={styles.formGroup} key={field.name}>
                <label htmlFor={field.name}>
                  {field.label} <span>*</span>
                </label>

                <input
                  id={field.name}
                  type="password"
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  autoComplete={field.autoComplete}
                  minLength={field.minLength}
                  required
                  disabled={isLoading}
                />
              </div>
            ))}
          </div>

          <div className={styles.submitRow}>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountSetting;
