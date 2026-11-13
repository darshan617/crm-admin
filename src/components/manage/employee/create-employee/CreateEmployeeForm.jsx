import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./CreateEmployeeForm.module.css";
import { FiEye, FiEyeOff, FiUpload, FiUser } from "react-icons/fi";
import {
  useCreateEmployeeMutation,
  useGetEmployeeQuery,
  useUpdateEmployeeMutation,
} from "@/redux/apis/employeeApi";
import { useToast } from "@/custom-hooks/toast/ToastProvider";
import { useRouter } from "next/router";

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin (Admin)" },
  { value: "sales_executive", label: "Sales Executive" },
];

const MANAGER_OPTIONS = ["Pratik Vardekar", "Janvi Singh", "Rahul Sharma"];

const getAvatarUrl = (avatar) => {
  if (!avatar || typeof avatar !== "string") return "";

  if (
    avatar.startsWith("http://") ||
    avatar.startsWith("https://") ||
    avatar.startsWith("blob:") ||
    avatar.startsWith("data:")
  ) {
    return avatar;
  }

  const base = (process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "").replace(
    /\/+$/,
    "",
  );

  if (!base) return "";

  return `${base}/${avatar.replace(/^\/+/, "")}`;
};

const CreateEmployeeForm = ({ employeeId }) => {
  const router = useRouter();
  const { showToast } = useToast();
  const imageInputRef = useRef(null);
  const isEdit = Boolean(employeeId);
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [formState, setFormState] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    role: "",
    manager: "",
    max_quot_discount: "",
    status: "active",
    jd_lead_assign: "no",
  });
  const [error, setError] = useState(null);
  const {
    data,
    isLoading: isFetching,
    isUninitialized,
    isError,
  } = useGetEmployeeQuery({ id: employeeId }, { skip: !employeeId });
  const [createEmployee, { isLoading: isCreating }] =
    useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: isUpdating }] =
    useUpdateEmployeeMutation();
  const isSaving = isCreating || isUpdating;

  const employee = useMemo(() => {
    const payload = data?.data?.employee || data?.employee || data?.data;

    if (!payload || Array.isArray(payload) || payload.id == null) return null;

    return payload;
  }, [data]);

  useEffect(() => {
    if (!employee) return;

    setFormState({
      name: employee?.name || "",
      mobile: String(employee?.mobile || "")
        .replace(/\D/g, "")
        .slice(0, 10),
      email: employee?.email || "",
      password: "",
      role: employee?.role || "",
      manager: employee?.manager || "",
      max_quot_discount:
        employee?.max_quot_discount == null
          ? ""
          : String(employee.max_quot_discount),
      status: employee?.status || "active",
      jd_lead_assign: employee?.jd_lead_assign || "no",
    });
    setAvatar(null);
    setImagePreview(getAvatarUrl(employee?.avatar));
    setError(null);
  }, [employee]);

  const roleOptions = useMemo(() => {
    if (
      formState?.role &&
      !ROLE_OPTIONS.some((option) => option.value === formState.role)
    ) {
      return [{ value: formState.role, label: formState.role }, ...ROLE_OPTIONS];
    }

    return ROLE_OPTIONS;
  }, [formState?.role]);

  const managerOptions = useMemo(() => {
    if (formState?.manager && !MANAGER_OPTIONS.includes(formState.manager)) {
      return [formState.manager, ...MANAGER_OPTIONS];
    }

    return MANAGER_OPTIONS;
  }, [formState?.manager]);

  const handleChange = (e) => {
    const { name, value } = e?.target;

    setFormState((prev) => ({
      ...prev,
      [name]: name === "mobile" ? value.replace(/\D/g, "").slice(0, 10) : value,
    }));
    setError((current) => ({
      ...current,
      [name]: null,
    }));
  };

  const handleImageChange = (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;

    const extension = file?.name?.split(".").pop()?.toLowerCase();
    const allowedTypes = ["jpeg", "jpg", "png", "gif", "webp", "svg"];

    if (!allowedTypes.includes(extension)) {
      setError((current) => ({
        ...current,
        avatar: "Please choose a JPEG, PNG, GIF, WEBP, or SVG image.",
      }));
      e.target.value = "";
      return;
    }

    if (file?.size > 5 * 1024 * 1024) {
      setError((current) => ({
        ...current,
        avatar: "Image must be 5MB or smaller.",
      }));
      e.target.value = "";
      return;
    }

    setAvatar(file);
    setError((current) => ({
      ...current,
      avatar: null,
    }));

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newError = {};

    if (!formState?.name?.trim()) {
      newError.name = "Please enter name.";
    }

    if (!formState?.mobile?.trim()) {
      newError.mobile = "Please enter phone number.";
    } else if (formState?.mobile?.length < 10) {
      newError.mobile = "Please enter a valid phone number.";
    }

    if (!formState?.email?.trim()) {
      newError.email = "Please enter email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState?.email)) {
      newError.email = "Please enter a valid email.";
    }

    if (!isEdit && !formState?.password) {
      newError.password = "Please enter password.";
    } else if (formState?.password && formState?.password?.length < 6) {
      newError.password = "Password must be at least 6 characters.";
    }

    if (!formState?.role) {
      newError.role = "Please select a role.";
    }

    if (!formState?.manager) {
      newError.manager = "Please select a manager.";
    }

    if (!formState?.max_quot_discount?.trim()) {
      newError.max_quot_discount = "Please enter max quot discount.";
    }

    if (!formState?.status) {
      newError.status = "Please select status.";
    }

    setError(newError);

    if (Object.keys(newError).length > 0) {
      showToast("Please fill all required fields in the form.", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const fields = {
        name: formState?.name,
        email: formState?.email,
        mobile: formState?.mobile,
        role: formState?.role,
        manager: formState?.manager,
        max_quot_discount: formState?.max_quot_discount,
        status: formState?.status || "active",
        jd_lead_assign: formState?.jd_lead_assign,
      };

      if (!isEdit || formState?.password) {
        fields.password = formState?.password;
      }

      let body = fields;

      if (avatar) {
        const formData = new FormData();
        Object.entries(fields).forEach(([key, value]) => {
          formData.append(key, value ?? "");
        });
        formData.append("avatar", avatar);
        body = formData;
      }

      const res = isEdit
        ? await updateEmployee({ id: employeeId, body }).unwrap()
        : await createEmployee({ body }).unwrap();

      if (res?.success) {
        showToast(res?.message, "success");
        router?.push("/manage/employee");
      } else {
        showToast(res?.message || res?.error?.message, "error");
      }
    } catch (submitError) {
      console.log(submitError, "Error in handleSubmit");

      const fieldErrors = submitError?.data?.errors;
      if (fieldErrors) {
        const newError = {};
        Object.keys(fieldErrors).forEach((key) => {
          newError[key] = Array.isArray(fieldErrors[key])
            ? fieldErrors[key][0]
            : fieldErrors[key];
        });
        setError(newError);
      }

      showToast(submitError?.data?.message, "error");
    }
  };

  if (isEdit && !employee) {
    return (
      <div className={styles.card}>
        {isFetching || isUninitialized ? (
          <p className={styles.imageHint}>Loading employee...</p>
        ) : (
          <p className={styles.errorMessage}>
            {isError
              ? "Unable to load employee."
              : "Employee details were not found."}
          </p>
        )}
      </div>
    );
  }

  return (
    <form
      className={styles.card}
      onSubmit={handleSubmit}
      autoComplete="off"
      noValidate
    >
      <section>
        <h2 className={styles.sectionTitle}>Account image</h2>

        <div className={styles.imageRow}>
          <div className={styles.avatar}>
            {imagePreview ? (
              <img src={imagePreview} alt="Selected employee" />
            ) : (
              <FiUser size={28} />
            )}
          </div>

          <div>
            <button
              type="button"
              className={styles.chooseImage}
              onClick={() => imageInputRef.current?.click()}
            >
              <FiUpload size={15} />
              Choose Image
            </button>
            <p className={styles.imageHint}>
              JPEG, PNG, GIF, WEBP or SVG. Maximum size 5MB.
            </p>
            {error?.avatar && (
              <p className={styles.errorMessage}>{error.avatar}</p>
            )}
            <input
              ref={imageInputRef}
              className={styles.fileInput}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
              onChange={handleImageChange}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>Employee Information</h2>

        <div className={styles.grid}>
          <label className={styles.field}>
            <span className={styles.label}>
              Name <span className={styles.required}>*</span>
            </span>
            <input
              className={styles.input}
              name="name"
              value={formState?.name}
              onChange={handleChange}
            />
            {error?.name && <p className={styles.errorMessage}>{error.name}</p>}
          </label>

          <label className={styles.field}>
            <span className={styles.label}>
              Phone Number <span className={styles.required}>*</span>
            </span>
            <div className={styles.phoneField}>
              <span className={styles.phoneCode}>+91</span>
              <input
                className={`${styles.input} ${styles.phoneInput}`}
                name="mobile"
                inputMode="numeric"
                value={formState?.mobile}
                onChange={handleChange}
              />
            </div>
            {error?.mobile && (
              <p className={styles.errorMessage}>{error.mobile}</p>
            )}
          </label>

          <label className={styles.field}>
            <span className={styles.label}>
              Email <span className={styles.required}>*</span>
            </span>
            <input
              className={styles.input}
              type="email"
              name="email"
              value={formState?.email}
              onChange={handleChange}
            />
            {error?.email && (
              <p className={styles.errorMessage}>{error.email}</p>
            )}
          </label>

          <label className={styles.field}>
            <span className={styles.label}>
              Password{" "}
              {!isEdit && <span className={styles.required}>*</span>}
            </span>
            <div className={styles.passwordWrap}>
              <input
                className={`${styles.input} ${styles.passwordInput}`}
                type={showPassword ? "text" : "password"}
                name="password"
                value={formState?.password}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder={
                  isEdit ? "Leave blank to keep current password" : ""
                }
              />
              <button
                type="button"
                className={styles.toggle}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {isEdit && (
              <p className={styles.imageHint}>
                Leave blank to keep the current password.
              </p>
            )}
            {error?.password && (
              <p className={styles.errorMessage}>{error.password}</p>
            )}
          </label>

          <label className={styles.field}>
            <span className={styles.label}>
              Role <span className={styles.required}>*</span>
            </span>
            <select
              className={`${styles.select} ${formState?.role ? "" : styles.placeholder}`}
              name="role"
              value={formState?.role}
              onChange={handleChange}
            >
              <option value="">Select Role</option>
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error?.role && <p className={styles.errorMessage}>{error.role}</p>}
          </label>

          <label className={styles.field}>
            <span className={styles.label}>
              Manager <span className={styles.required}>*</span>
            </span>
            <select
              className={`${styles.select} ${formState?.manager ? "" : styles.placeholder}`}
              name="manager"
              value={formState?.manager}
              onChange={handleChange}
            >
              <option value="">Select Manager</option>
              {managerOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {error?.manager && (
              <p className={styles.errorMessage}>{error.manager}</p>
            )}
          </label>

          <label className={styles.field}>
            <span className={styles.label}>
              Max Quot Discount <span className={styles.required}>*</span>
            </span>
            <input
              className={styles.input}
              name="max_quot_discount"
              placeholder="e.g. 10%"
              value={formState?.max_quot_discount}
              onChange={handleChange}
            />
            {error?.max_quot_discount && (
              <p className={styles.errorMessage}>{error.max_quot_discount}</p>
            )}
          </label>

          <label className={styles.field}>
            <span className={styles.label}>
              Status <span className={styles.required}>*</span>
            </span>
            <select
              className={styles.select}
              name="status"
              value={formState?.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {error?.status && (
              <p className={styles.errorMessage}>{error.status}</p>
            )}
          </label>

          <label className={styles.field}>
            <span className={styles.label}>JD Lead Assign</span>
            <select
              className={styles.select}
              name="jd_lead_assign"
              value={formState?.jd_lead_assign}
              onChange={handleChange}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
            {error?.jd_lead_assign && (
              <p className={styles.errorMessage}>{error.jd_lead_assign}</p>
            )}
          </label>
        </div>
      </section>

      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.saveButton}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default CreateEmployeeForm;
