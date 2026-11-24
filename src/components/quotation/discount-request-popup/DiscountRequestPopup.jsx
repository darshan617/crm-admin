"use client";

import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import CustomPopup from "@/common-components/custom-popup/CustomPopup";
import {
  useRequestDiscountMutation,
  useRequestDiscountEmployeeQuery,
} from "@/redux/apis/quotationApi";
import { useToast } from "@/custom-hooks/toast/ToastProvider";
import styles from "./DiscountRequestPopup.module.css";

const DiscountRequestPopup = ({ isOpen, onClose, quotation }) => {
  const { showToast } = useToast();
  const [discount, setDiscount] = useState("");
  const [remark, setRemark] = useState("");
  const [error, setError] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [requestDiscount, { isLoading }] = useRequestDiscountMutation();
  const { data: employeeData, isFetching: isEmployeesLoading } =
    useRequestDiscountEmployeeQuery(
      { quotation_id: quotation?.id },
      { skip: !isOpen || !quotation?.id },
    );
  const employees = employeeData?.data?.employees || [];
  const selectedEmployee =
    employeeName || employees[0]?.name || employees[0] || "";
  const maxDiscount = (() => {
    const raw = employeeData?.data?.max_discount;
    if (raw === null || raw === undefined || raw === "") return null;
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  })();
  const discountCap = maxDiscount ?? 100;

  useEffect(() => {
    if (!isOpen) return;

    const current = quotation?.discount;
    setDiscount(
      current === null || current === undefined || current === ""
        ? ""
        : String(current),
    );
    setRemark("");
    setError("");
    setEmployeeName("");
  }, [isOpen, quotation?.id, quotation?.discount]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!quotation?.id) {
      showToast("Quotation ID is missing", "error");
      return;
    }

    const value = String(discount).trim();
    const amount = Number(value);

    if (
      value === "" ||
      !Number.isFinite(amount) ||
      amount < 0 ||
      amount > discountCap
    ) {
      setError(
        maxDiscount != null
          ? `Please enter a discount between 0 and ${maxDiscount}.`
          : "Please enter a discount between 0 and 100.",
      );
      return;
    }

    setError("");

    try {
      const response = await requestDiscount({
        quotation_id: quotation.id,
        employee: selectedEmployee,
        requested_discount: amount,
        remark: remark.trim(),
      }).unwrap();

      if (response?.status === false) {
        showToast(
          response?.message || "Failed to send discount request",
          "error",
        );
        return;
      }

      showToast(response?.message || "Discount request sent", "success");
      onClose?.();
    } catch (err) {
      showToast(
        err?.data?.message || err?.message || "Failed to send discount request",
        "error",
      );
    }
  };

  return (
    <CustomPopup
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="680px"
      closeIcon={false}
      className={styles.popup}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.header}>
          <h2>Send for more discount</h2>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
            disabled={isLoading}
          >
            <IoClose size={22} />
          </button>
        </div>

        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor="discountEmployee">Employee</label>
            <select
              id="discountEmployee"
              value={selectedEmployee}
              onChange={(event) => setEmployeeName(event.target.value)}
              disabled={isLoading || isEmployeesLoading}
            >
              {employees.map((employee, index) => {
                const name = employee?.name || employee;
                return (
                  <option key={`${name}-${index}`} value={name}>
                    {name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="discountRequest">Requested Discount (%)</label>
            <input
              id="discountRequest"
              type="number"
              name="discount"
              min="0"
              max={discountCap}
              step="0.01"
              value={discount}
              autoFocus
              onChange={(event) => {
                const nextValue = event.target.value;
                if (nextValue === "") {
                  setDiscount("");
                  if (error) setError("");
                  return;
                }

                const numericValue = Number(nextValue);
                if (!Number.isFinite(numericValue) || numericValue < 0) {
                  return;
                }

                if (maxDiscount != null && numericValue > maxDiscount) {
                  setDiscount(String(maxDiscount));
                  if (error) setError("");
                  return;
                }

                setDiscount(nextValue);
                if (error) setError("");
              }}
            />
            {maxDiscount != null && (
              <p className={styles.maxDiscountHint}>
                Max discount: {maxDiscount}%
              </p>
            )}
            {error && <p className={styles.error}>{error}</p>}
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="discountRemark">Remark</label>
          <textarea
            id="discountRemark"
            name="remark"
            value={remark}
            rows={5}
            onChange={(event) => setRemark(event.target.value)}
          />
        </div>

        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.submit}
            disabled={isLoading || !selectedEmployee}
          >
            {isLoading ? "Sending..." : "Submit"}
          </button>
        </div>
      </form>
    </CustomPopup>
  );
};

export default DiscountRequestPopup;
