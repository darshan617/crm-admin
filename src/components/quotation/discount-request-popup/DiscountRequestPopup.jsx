"use client";

import { useEffect, useState } from "react";
import CustomPopup from "@/common-components/custom-popup/CustomPopup";
import { useRequestDiscountMutation } from "@/redux/apis/quotationApi";
import { useToast } from "@/custom-hooks/toast/ToastProvider";
import styles from "./DiscountRequestPopup.module.css";

const DiscountRequestPopup = ({ isOpen, onClose, quotation }) => {
  const { showToast } = useToast();
  const [discount, setDiscount] = useState("");
  const [error, setError] = useState("");
  const [requestDiscount, { isLoading }] = useRequestDiscountMutation();

  useEffect(() => {
    if (!isOpen) return;

    const current = quotation?.discount;
    setDiscount(
      current === null || current === undefined || current === ""
        ? ""
        : String(current),
    );
    setError("");
  }, [isOpen, quotation?.id, quotation?.discount]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!quotation?.id) {
      showToast("Quotation ID is missing", "error");
      return;
    }

    const value = String(discount).trim();
    const amount = Number(value);

    if (value === "" || !Number.isFinite(amount) || amount < 0 || amount > 100) {
      setError("Please enter a discount between 0 and 100.");
      return;
    }

    setError("");

    try {
      const response = await requestDiscount({
        quotation_id: quotation.id,
        discount: amount,
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
        err?.data?.message ||
          err?.message ||
          "Failed to send discount request",
        "error",
      );
    }
  };

  const quotationNo = quotation?.quotation_no || quotation?.id;
  const company = quotation?.company_name;

  return (
    <CustomPopup isOpen={isOpen} onClose={onClose} maxWidth="440px">
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Send for more discount</h2>

        {(quotationNo || company) && (
          <p className={styles.meta}>
            {quotationNo && <span>{quotationNo}</span>}
            {company && company !== "-" && <span>{company}</span>}
          </p>
        )}

        <div className="form-group">
          <label htmlFor="discountRequest">
            Discount (%) <span>*</span>
          </label>
          <input
            id="discountRequest"
            type="number"
            name="discount"
            min="0"
            max="100"
            step="0.01"
            value={discount}
            placeholder="Enter discount"
            autoFocus
            onChange={(event) => {
              setDiscount(event.target.value);
              if (error) setError("");
            }}
          />
          {error && <p className={styles.error}>{error}</p>}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancel}
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button type="submit" className={styles.submit} disabled={isLoading}>
            {isLoading ? "Sending..." : "Send request"}
          </button>
        </div>
      </form>
    </CustomPopup>
  );
};

export default DiscountRequestPopup;
