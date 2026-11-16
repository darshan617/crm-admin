import React, { useState } from "react";
import styles from "@/components/account-setting/AccountSetting.module.css";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h4 className={styles.cardTitle}>Change Password</h4>

        <form>
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
                />
              </div>
            ))}
          </div>

          <div className={styles.submitRow}>
            <button type="submit" className={styles.submitBtn}>
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountSetting;
