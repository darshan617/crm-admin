import React, { useRef, useState } from "react";
import styles from "./CreateEmployeeForm.module.css";
import { FiEye, FiEyeOff, FiUpload, FiUser } from "react-icons/fi";
import { useCreateEmployeeMutation } from "@/redux/apis/employeeApi";
import { useToast } from "@/custom-hooks/toast/ToastProvider";
import { useRouter } from "next/router";

const CreateEmployeeForm = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const imageInputRef = useRef(null);
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
  const [createEmployee, { isLoading }] = useCreateEmployeeMutation();

  const handleChange = (e) => {
    const { name, value } = e?.target;

    setFormState((prev) => ({
      ...prev,
      [name]:
        name === "mobile" ? value.replace(/\D/g, "").slice(0, 10) : value,
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

    if (!formState?.password) {
      newError.password = "Please enter password.";
    } else if (formState?.password?.length < 6) {
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
      let body = {
        name: formState?.name,
        email: formState?.email,
        mobile: formState?.mobile,
        password: formState?.password,
        role: formState?.role,
        manager: formState?.manager,
        max_quot_discount: formState?.max_quot_discount,
        status: formState?.status || "active",
        jd_lead_assign: formState?.jd_lead_assign,
      };

      if (avatar) {
        const formData = new FormData();
        formData.append("name", formState?.name);
        formData.append("email", formState?.email);
        formData.append("mobile", formState?.mobile);
        formData.append("password", formState?.password);
        formData.append("role", formState?.role);
        formData.append("manager", formState?.manager);
        formData.append("max_quot_discount", formState?.max_quot_discount);
        formData.append("status", formState?.status || "active");
        formData.append("jd_lead_assign", formState?.jd_lead_assign);
        formData.append("avatar", avatar);
        body = formData;
      }

      const res = await createEmployee({
        body: body,
      }).unwrap();

      if (res?.success) {
        showToast(res?.message, "success");
        router?.push("/manage/employee");
      } else {
        showToast(res?.message || res?.error?.message, "error");
      }
    } catch (error) {
      console.log(error, "Error in handleSubmit");

      const fieldErrors = error?.data?.errors;
      if (fieldErrors) {
        const newError = {};
        Object.keys(fieldErrors).forEach((key) => {
          newError[key] = Array.isArray(fieldErrors[key])
            ? fieldErrors[key][0]
            : fieldErrors[key];
        });
        setError(newError);
      }

      showToast(error?.data?.message, "error");
    }
  };

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
            {error?.name && (
              <p className={styles.errorMessage}>{error.name}</p>
            )}
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
              Password <span className={styles.required}>*</span>
            </span>
            <div className={styles.passwordWrap}>
              <input
                className={`${styles.input} ${styles.passwordInput}`}
                type={showPassword ? "text" : "password"}
                name="password"
                value={formState?.password}
                onChange={handleChange}
                autoComplete="new-password"
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
              <option value="admin">Admin (Admin)</option>
              <option value="sales_executive">Sales Executive</option>
            </select>
            {error?.role && (
              <p className={styles.errorMessage}>{error.role}</p>
            )}
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
              <option value="Pratik Vardekar">Pratik Vardekar</option>
              <option value="Janvi Singh">Janvi Singh</option>
              <option value="Rahul Sharma">Rahul Sharma</option>
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
            <span className={styles.label}>ID Lead Assign</span>
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
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default CreateEmployeeForm;
