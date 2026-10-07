import React, { useState } from "react";
import styles from "./LoginForm.module.css";
import logo from "@/../public/images/signup/signupLogo.webp";
import Image from "next/image";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useLoginMutation } from "@/redux/apis/authApi";
import { useToast } from "@/custom-hooks/toast/ToastProvider";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const LoginForm = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (e) => {
    try {
      const res = await login({
        body: {
          email: formState?.email,
          password: formState?.password,
        },
      }).unwrap();
      if (res?.success) {
        Cookies.set("CRM_USER", JSON.stringify(res?.data?.user));
        Cookies.set("token", JSON.stringify(res?.data?.token));
        showToast(res?.message, "success");
        router?.push("/dashboard");
      }
    } catch (error) {
      console.log(error, "Error in handleLogin");
    }
  };

  const handleChange = (e) => {
    const { value, name } = e?.target;

    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={styles.page}>
      <section className={styles.formPanel}>
        <div className={styles.formWrapper}>
          <Image src={logo} alt="Tizzy Group" className={styles.logo} />

          <div className={styles.heading}>
            <h1 className={styles.title}>
              Great to see you here <span aria-hidden="true">👋</span>
            </h1>
            <p className={styles.subtitle}>Sign in to continue.</p>
          </div>

          <div className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>
                Email <span className={styles.required}>*</span>
              </label>
              <input
                id="email"
                name="email"
                type="text"
                className={styles.input}
                placeholder="Enter your email"
                value={formState.email}
                onChange={handleChange}
                autoComplete="username"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>
                Password <span className={styles.required}>*</span>
              </label>
              <div className={styles.passwordWrap}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`${styles.input} ${styles.passwordInput}`}
                  placeholder="Enter your password"
                  value={formState?.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  name="password"
                />
                <button
                  type="button"
                  className={styles.toggle}
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <AiOutlineEye size={22} />
                  ) : (
                    <AiOutlineEyeInvisible size={22} />
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className={styles.button}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>

          <p className={styles.copyright}>
            © {new Date().getFullYear()} Tizzy Group. All rights reserved.
          </p>
        </div>
      </section>

      <section className={styles.imagePanel} aria-hidden="true" />
    </div>
  );
};

export default LoginForm;
