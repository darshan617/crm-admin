"use client";

import React, { useEffect, useState } from "react";
import styles from "@/components/quotation/Quotation.module.css";
import {
  useGetSuggestMailQuery,
  useSendMailMutation,
  useSendInvoiceMutation,
} from "@/redux/apis/quotationApi";
import CustomPopup from "@/common-components/custom-popup/CustomPopup";
import { useToast } from "@/custom-hooks/toast/ToastProvider";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialOf = (value = "") => String(value).trim().charAt(0).toUpperCase();

const SendQuotationPopup = ({
  isOpen,
  onClose,
  quotation,
  mode = "quotation",
}) => {
  const primaryEmail = quotation?.email || "";

  const [toEmails, setToEmails] = useState([]);
  const [ccEmails, setCcEmails] = useState([]);
  const [toInput, setToInput] = useState("");
  const [ccInput, setCcInput] = useState("");

  const { showToast } = useToast();

  const isInvoice = mode === "invoice";
  const title = isInvoice ? "Send Invoice" : "Send Quotation";
  const documentType = isInvoice ? "Invoice" : "Quotation";

  const [sendMail, { isLoading: isSendingQuotation }] = useSendMailMutation();
  const [sendInvoice, { isLoading: isSendingInvoice }] =
    useSendInvoiceMutation();
  const isSending = isSendingQuotation || isSendingInvoice;

  const { data: suggestMail } = useGetSuggestMailQuery();

  const members = (Array.isArray(suggestMail?.data) ? suggestMail.data : [])
    .filter(
      (item) =>
        item?.value && item.value.toLowerCase() !== primaryEmail.toLowerCase(),
    )
    .map((item) => ({
      name: String(item?.meta || item?.value || ""),
      email: String(item.value),
    }));

  useEffect(() => {
    if (!isOpen) return;

    setToEmails([]);
    setCcEmails([]);
    setToInput("");
    setCcInput("");
  }, [isOpen, quotation?.id, mode]);

  const getSuggestions = (value) => {
    const q = value.trim().toLowerCase();

    if (!q) return [];

    const taken = [primaryEmail, ...toEmails, ...ccEmails].map((email) =>
      email.toLowerCase(),
    );

    return members
      .filter(
        (member) =>
          !taken.includes(member.email.toLowerCase()) &&
          (member.name.toLowerCase().includes(q) ||
            member.email.toLowerCase().includes(q)),
      )
      .slice(0, 4);
  };

  const addEmail = (value, list, setList, setInput) => {
    const email = String(value || "").trim();

    if (!EMAIL_RE.test(email)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    const existingEmails = [primaryEmail, ...toEmails, ...ccEmails].map(
      (item) => item.toLowerCase(),
    );

    if (existingEmails.includes(email.toLowerCase())) {
      setInput("");
      return;
    }

    setList((prev) => [...prev, email]);
    setInput("");
  };

  const handleKeyDown = (event, value, list, setList, setInput) => {
    if (event.key === "Enter") {
      event.preventDefault();

      const [first] = getSuggestions(value);

      addEmail(first?.email || value, list, setList, setInput);
    }
  };

  const toggleCc = (email) => {
    if (
      [primaryEmail, ...toEmails].some(
        (item) => item.toLowerCase() === email.toLowerCase(),
      )
    ) {
      return;
    }

    setCcEmails((list) =>
      list.includes(email) ? list.filter((e) => e !== email) : [...list, email],
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!quotation?.id) {
      showToast("Quotation ID is missing", "error");
      return;
    }

    const pendingTo = toInput.trim();
    const pendingCc = ccInput.trim();

    if (pendingTo && !EMAIL_RE.test(pendingTo)) {
      showToast("Please enter a valid To email", "error");
      return;
    }

    if (pendingCc && !EMAIL_RE.test(pendingCc)) {
      showToast("Please enter a valid CC email", "error");
      return;
    }

    const uniqueEmails = (emails) => [
      ...new Set(
        emails.filter(Boolean).map((email) => email.trim().toLowerCase()),
      ),
    ];

    const finalToEmails = uniqueEmails([primaryEmail, ...toEmails, pendingTo]);

    const finalCcEmails = uniqueEmails([...ccEmails, pendingCc]).filter(
      (email) => !finalToEmails.includes(email),
    );

    if (!finalToEmails.length) {
      showToast("Please add at least one recipient", "error");
      return;
    }

    try {
      // Invoice -> /quotations/send-invoice-mail, Quotation -> existing mail API
      const sendRequest = isInvoice ? sendInvoice : sendMail;

      const response = await sendRequest({
        body: {
          quotation_id: Number(quotation.id),
          emails: finalToEmails.join(", "),
          cc: finalCcEmails.join(", "),
        },
      }).unwrap();

      if (response?.status === false) {
        showToast(
          response?.message || `Failed to send ${documentType.toLowerCase()}`,
          "error",
        );
        return;
      }

      showToast(
        response?.message || `${documentType} sent successfully`,
        "success",
      );

      onClose?.();
    } catch (err) {
      showToast(
        err?.data?.message ||
          err?.message ||
          `Failed to send ${documentType.toLowerCase()}`,
        "error",
      );
    }
  };

  const renderChips = (list, setList) =>
    list.map((email) => (
      <span className={styles.gmailChip} key={email} title={email}>
        <span className={styles.gmailChipAvatar}>{initialOf(email)}</span>

        <span className={styles.gmailChipText}>{email}</span>

        <button
          type="button"
          aria-label={`Remove ${email}`}
          onClick={() => setList((prev) => prev.filter((e) => e !== email))}
        >
          ×
        </button>
      </span>
    ));

  const renderSuggest = (value, list, setList, setInput) => {
    const items = getSuggestions(value);

    if (!items.length) return null;

    return (
      <div className={styles.gmailToSuggest}>
        {items.map((member, index) => (
          <button
            key={member.email}
            type="button"
            className={index === 0 ? "active" : ""}
            onClick={() => addEmail(member.email, list, setList, setInput)}
          >
            <span className={styles.gmailSuggestAvatar}>
              {initialOf(member.name)}
            </span>

            <span>
              <strong>{member.name}</strong>
              <small>{member.email}</small>
            </span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <CustomPopup isOpen={isOpen} onClose={onClose}>
      <div className="credit-modal-box send-quote-box gmail-send-box">
        <h2>{title}</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.gmailCmpose}>
            <div className={styles.gmailToRow}>
              <span className={styles.gmailToLabel}>To</span>

              <div className={styles.gmailToField}>
                <div className={styles.emailChipList}>
                  {primaryEmail && (
                    <span
                      className={`${styles.gmailChipLocked} ${styles.gmailChip}`}
                      title={`${primaryEmail} (required)`}
                    >
                      <span className={styles.gmailChipAvatar}>
                        {initialOf(primaryEmail)}
                      </span>

                      <span className={styles.gmailChipText}>
                        {quotation?.contact_name || primaryEmail}
                      </span>
                    </span>
                  )}

                  {renderChips(toEmails, setToEmails)}
                </div>

                <input
                  type="text"
                  value={toInput}
                  placeholder="Add another email"
                  autoComplete="off"
                  spellCheck={false}
                  onChange={(e) => setToInput(e.target.value)}
                  onKeyDown={(e) =>
                    handleKeyDown(e, toInput, toEmails, setToEmails, setToInput)
                  }
                />

                {renderSuggest(toInput, toEmails, setToEmails, setToInput)}
              </div>
            </div>

            <div className={styles.gmailToRow}>
              <span className={styles.gmailToLabel}>Cc</span>

              <div className={styles.gmailToField}>
                <div className={styles.emailChipList}>
                  {renderChips(ccEmails, setCcEmails)}
                </div>

                <input
                  type="text"
                  value={ccInput}
                  placeholder="Add CC email"
                  autoComplete="off"
                  spellCheck={false}
                  onChange={(e) => setCcInput(e.target.value)}
                  onKeyDown={(e) =>
                    handleKeyDown(e, ccInput, ccEmails, setCcEmails, setCcInput)
                  }
                />

                {renderSuggest(ccInput, ccEmails, setCcEmails, setCcInput)}
              </div>
            </div>

            <div className={styles.gmailTeamPicks}>
              <span>Internal team</span>

              <div>
                {members.map((member) => (
                  <button
                    key={member.email}
                    type="button"
                    className={`${styles.gmailTeamChip} ${
                      ccEmails.includes(member.email) ? "is-added" : ""
                    }`}
                    onClick={() => toggleCc(member.email)}
                  >
                    {member.name}

                    <small>{member.email}</small>
                  </button>
                ))}
              </div>
            </div>

            <p className={styles.gmailToHint}>
              Type an email and press <kbd>Enter</kbd>. Use CC for team manager
              and internal staff.
            </p>
          </div>

          <div className={styles.gmailSendActions}>
            <button
              type="submit"
              className={`${styles.submitBtn} gmail-send-btn`}
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </CustomPopup>
  );
};

export default SendQuotationPopup;
