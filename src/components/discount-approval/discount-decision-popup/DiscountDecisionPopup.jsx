"use client";

import CustomPopup from "@/common-components/custom-popup/CustomPopup";
import { useToast } from "@/custom-hooks/toast/ToastProvider";
import { useDecideDiscountRequestMutation } from "@/redux/apis/quotationApi";
import styles from "./DiscountDecisionPopup.module.css";

const DiscountDecisionPopup = ({ isOpen, onClose, request, action }) => {
  const { showToast } = useToast();
  const [decideDiscountRequest, { isLoading }] =
    useDecideDiscountRequestMutation();

  const isApprove = action === "approve";
  const quotationId = request?.quotation_id || request?.id;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!quotationId) {
      showToast("Quotation ID is missing", "error");
      return;
    }

    try {
      const response = await decideDiscountRequest({
        id: quotationId,
        action: isApprove ? "approve" : "reject",
      }).unwrap();

      if (response?.success === false || response?.status === false) {
        showToast(
          response?.message ||
            `Failed to ${isApprove ? "approve" : "reject"} discount request`,
          "error",
        );
        return;
      }

      showToast(
        response?.message ||
          `Discount request ${isApprove ? "approved" : "rejected"}`,
        "success",
      );
      onClose?.();
    } catch (err) {
      showToast(
        err?.data?.message ||
          err?.message ||
          `Failed to ${isApprove ? "approve" : "reject"} discount request`,
        "error",
      );
    }
  };

  const quotationNo = request?.quotation_no || request?.id;
  const company = request?.company_name;

  return (
    <CustomPopup isOpen={isOpen} onClose={onClose} maxWidth="440px">
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>{isApprove ? "Approve discount" : "Reject discount"}</h2>

        <p className={styles.message}>
          {isApprove
            ? "Approve this discount request?"
            : "Reject this discount request?"}
        </p>

        {(quotationNo || company) && (
          <p className={styles.meta}>
            {quotationNo && <span>{quotationNo}</span>}
            {company && company !== "-" && <span>{company}</span>}
          </p>
        )}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancel}
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={isApprove ? styles.approve : styles.reject}
            disabled={isLoading}
          >
            {isLoading
              ? isApprove
                ? "Approving..."
                : "Rejecting..."
              : isApprove
                ? "Approve"
                : "Reject"}
          </button>
        </div>
      </form>
    </CustomPopup>
  );
};

export default DiscountDecisionPopup;
