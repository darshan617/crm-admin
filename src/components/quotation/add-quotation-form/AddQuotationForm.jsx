"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/components/quotation/add-quotation-form/AddQuotationForm.module.css";
import {
  useCheckQuotaionDomainQuery,
  useCreateQuotationMutation,
  useGetLeadDataForQuotationQuery,
  useGetQuotationDdDataQuery,
} from "@/redux/apis/quotationApi";
import CustomDropdown from "@/common-components/custom-dropdown/CustomDropdown";
import { BiX } from "react-icons/bi";
import { useToast } from "@/custom-hooks/toast/ToastProvider";
import usePermissions from "@/custom-hooks/permissions/usePermissions";
import { useRouter } from "next/router";
import { useEmailSuggestionsQuery } from "@/redux/apis/quotationApi";

const countryCodes = [
  ["91", "India"],
  ["1", "USA / Canada"],
  ["44", "United Kingdom"],
  ["971", "UAE"],
];

const blankRow = () => ({
  current_service_id: "",
  provider_id: "",
  plan_id: "",
  quote_period: "",
  billing_start_date: "",
  sku: "",
  quantity: "",
  rate: "",
});

export default function Page() {
  const { showToast } = useToast();
  const router = useRouter();
  const { canAdd } = usePermissions();
  const canCreateQuotation =
    canAdd("quotations") || canAdd("create_quotations");
  const [debouncedEmail, setDebouncedEmail] = useState("");
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);
  const [formData, setFormData] = useState({
    lead: "",
    company_name: "",
    gstin: "",
    salutation: "",
    name: "",
    email: "",
    mobile_code: "91",
    mobile: "",
    discount: "",
    deal_type: "new",
    domain_type: "",
    domain_name: "",
    sac: "",
    domain_start: "",
    domain_end: "",
    domain_rate: "",
    renewal_date: "",
    plans: [blankRow()],
  });
  const [error, setError] = useState(null);
  const form = formData;
  const { plans } = formData;

  const { data: ddData } = useGetQuotationDdDataQuery(undefined, {
    skip: !canCreateQuotation,
  });
  const [createQuotation, { isLoading: isCreatingQuotation }] =
    useCreateQuotationMutation();
  const { data: domainAvailable, isLoading: isCheckingDomain } =
    useCheckQuotaionDomainQuery(
      {
        domain: formData?.domain_name,
      },
      { skip: !canCreateQuotation || !formData?.domain_name },
    );
  const { data: getLeadDeatils } = useGetLeadDataForQuotationQuery(
    {
      lead_id: formData?.lead?.value,
    },
    { skip: !canCreateQuotation || formData?.lead === "" },
  );

  const maxDiscount = (() => {
    const raw = ddData?.data?.max_discount;
    if (raw === null || raw === undefined || raw === "") return null;
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  })();

  // Debounce the typed email so we don't hit the API on every keystroke
  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedEmail(formData.email?.trim() || ""),
      300,
    );
    return () => clearTimeout(timer);
  }, [formData.email]);

  // GET /quotations/email-suggestions?q=<typed text>
  const { data: emailSuggestionData } = useEmailSuggestionsQuery(
    { q: debouncedEmail },
    { skip: !canCreateQuotation || debouncedEmail.length < 2 },
  );

  // Normalise the response (array of strings or objects) into { email, label }
  const emailSuggestions = (() => {
    const raw = emailSuggestionData?.data;
    const list = Array.isArray(raw)
      ? raw
      : (raw?.emails ?? raw?.suggestions ?? []);
    return list
      .map((item) =>
        typeof item === "string"
          ? { email: item, label: "" }
          : {
              ...item,
              email: item?.email ?? item?.value ?? "",
              label: item?.name ?? "",
            },
      )
      .filter(
        (item) =>
          item.email &&
          item.email.toLowerCase() !== formData.email?.trim().toLowerCase(),
      );
  })();

  // Fill the form from the selected suggestion (API data only, no extra call)
  const applyEmailSuggestion = (item) => {
    setFormData((current) => ({
      ...current,
      email: item.email || current.email,
      company_name: item.company_name || current.company_name,
      gstin: item.gstin || current.gstin,
      salutation: item.salutation || current.salutation,
      name: item.name || current.name,
      mobile_code: item.mobile_code || current.mobile_code,
      mobile: item.mobile || current.mobile,
    }));
    setError((current) => ({
      ...current,
      email: null,
      company_name: null,
      gstin: null,
      salutation: null,
      name: null,
      mobile: null,
    }));
    setShowEmailSuggestions(false);
  };

  const setField = (name, value) => {
    setFormData((current) => ({ ...current, [name]: value }));
    setError((current) => ({
      ...current,
      [name]: null,
    }));
  };

  const plansForProvider = (providerId) =>
    (ddData?.data?.plans ?? []).filter(
      (plan) => String(plan.provider_id) === String(providerId),
    );

  const onRowInput = (i, field, value) => {
    setFormData((current) => ({
      ...current,
      plans: current.plans.map((row, idx) => {
        if (idx !== i) return row;

        if (field === "provider_id") {
          const stillValid = plansForProvider(value).some(
            (plan) => String(plan.id) === String(row.plan_id),
          );
          return {
            ...row,
            provider_id: value,
            ...(stillValid ? {} : { plan_id: "", sku: "", rate: "" }),
          };
        }

        if (field === "plan_id") {
          const selected = plansForProvider(row.provider_id).find(
            (plan) => String(plan.id) === String(value),
          );
          return {
            ...row,
            plan_id: value,
            sku: selected?.sku ?? "",
            rate: selected?.rate ?? "",
          };
        }

        return { ...row, [field]: value };
      }),
    }));
    setError((current) => ({
      ...current,
      plans: null,
      [pname(i, field)]: null,
    }));
  };
  const addPlan = (e) => {
    e.preventDefault();
    setFormData((current) => ({
      ...current,
      plans: [...current.plans, blankRow()],
    }));
  };

  const removePlan = (i) =>
    setFormData((current) => ({
      ...current,
      plans: current.plans.filter((_, idx) => idx !== i),
    }));

  const pname = (i, f) => "plans[" + i + "][" + f + "]";

  const handleCreateQuotation = async (event) => {
    event.preventDefault();
    if (!canCreateQuotation || !validateForm()) return;

    try {
      const res = await createQuotation({
        body: formData,
      }).unwrap();

      if (res?.success) {
        showToast(res?.message || "Quotation created successfully.", "success");
        router.push("/quotations");
      } else {
        showToast(res?.message || "Could not create the quotation.", "error");
      }
    } catch (error) {
      showToast(
        error?.data?.message ||
          error?.message ||
          "Could not create the quotation.",
        "error",
      );
    }
  };

  const validateForm = () => {
    const newError = {};

    if (!formData.domain_type) {
      newError.domain_type = "Please select a domain option.";
    }

    if (!formData.company_name?.trim()) {
      newError.company_name = "Please enter company name.";
    }

    if (!formData.gstin?.trim()) {
      newError.gstin = "Please enter GSTIN.";
    }

    if (!formData.salutation) {
      newError.salutation = "Please select salutation.";
    }

    if (!formData.name?.trim()) {
      newError.name = "Please enter name.";
    }

    if (!formData.email?.trim()) {
      newError.email = "Please enter email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newError.email = "Please enter a valid email.";
    }

    const discountCap = maxDiscount ?? 100;
    if (
      formData.discount === "" ||
      Number(formData.discount) < 0 ||
      Number(formData.discount) > discountCap
    ) {
      newError.discount =
        maxDiscount != null
          ? `Please enter a discount between 0 and ${maxDiscount}.`
          : "Please enter a discount between 0 and 100.";
    }

    if (!formData.plans || formData.plans.length === 0) {
      newError.plans = "Please add at least one plan.";
    } else if (
      !formData.plans.every(
        (plan) =>
          plan.provider_id &&
          plan.plan_id &&
          plan.quote_period &&
          plan.sku?.trim() &&
          Number(plan.quantity) >= 1 &&
          plan.rate !== "" &&
          plan.rate !== null &&
          Number(plan.rate) >= 0,
      )
    ) {
      newError.plans = "Please fill all required fields in plan details.";
    }

    setError(newError);

    if (Object.keys(newError).length > 0) {
      showToast("Please fill all required fields in the form.", "error");
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (!formData.domain_name || !domainAvailable?.data) return;

    const { available, registered } = domainAvailable.data;

    if (!available && registered) {
      setField("domain_type", "existing");
    } else if (available && !registered) {
      setField("domain_type", "new");
    }
  }, [domainAvailable?.data, formData.domain_name]);

  useEffect(() => {
    const leadIdFromQuery = router.query?.lead_id;
    const leads = ddData?.data?.leads;
    if (!leadIdFromQuery || !Array.isArray(leads) || formData.lead?.value) {
      return;
    }

    const matchedLead = leads.find(
      (lead) => String(lead.id) === String(leadIdFromQuery),
    );
    if (!matchedLead) return;

    setField("lead", {
      value: matchedLead.id,
      label: `${matchedLead.company_name} (${matchedLead?.name})`,
    });
  }, [router.query?.lead_id, ddData?.data?.leads, formData.lead?.value]);

  useEffect(() => {
    if (!getLeadDeatils?.data?.lead) return;

    const leadData = getLeadDeatils?.data?.lead;
    setFormData((current) => ({
      ...current,
      company_name: leadData?.company_name || "",
      gstin: leadData?.gstin || "",
      salutation: leadData?.salutation || "",
      name: leadData?.name || "",
      email: leadData?.email || "",
      mobile_code: leadData?.mobile_code || "91",
      mobile: leadData?.mobile || "",
      domain_name: leadData?.domain || "",
      domain_type: leadData?.domain_type || "",
      sac: leadData?.sac || "",
      domain_start: leadData?.domain_start || "",
      domain_end: leadData?.domain_end || "",
      domain_rate: leadData?.domain_rate || "",
      renewal_date: leadData?.renewal_date || "",
      plans: leadData?.services?.length > 0 ? leadData.services : [blankRow()],
    }));
    setError((current) => ({
      ...current,
      company_name: null,
      gstin: null,
      salutation: null,
      name: null,
      email: null,
      domain_type: null,
      plans: null,
    }));
  }, [getLeadDeatils?.data]);

  if (!canCreateQuotation) return null;

  return (
    <main className="content">
      <div className="page-header">
        <div>
          <div className="breadcrumb welcome-text">
            <p>
              <Link href="/crm/dashboard">Dashboard</Link>
              <span>/</span>
              <Link href="/quotations">Quotations</Link>
            </p>
          </div>
          <h2>Add Quotations</h2>
        </div>
        <div className="back">
          <Link href="/quotations" className="back-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5"></path>
              <path d="M12 19l-7-7 7-7"></path>
            </svg>
            <span>Back</span>
          </Link>
        </div>
      </div>

      <form id="quotationForm" onSubmit={handleCreateQuotation} noValidate>
        <section className="common-form">
          <h3>Quotation Detail</h3>

          <div className="form-grid">
            <div className="form-group">
              <label></label>
              <CustomDropdown
                label="Lead"
                placeholder="Select Lead"
                options={ddData?.data?.leads.map((lead) => ({
                  value: lead.id,
                  label: `${lead.company_name} (${lead?.name})`,
                }))}
                value={form.lead}
                onChange={(value) => setField("lead", value)}
                required
                customHeight="43px"
              />
              {/* <select
                name="lead"
                id="dealType"
                className="form-control"
                value={form.lead}
                onChange={(e) => setField("lead", e.target.value)}
                required
              >
                {ddData?.data?.leads.map((lead) => (
                  <option key={lead._id} value={lead._id}>
                    {lead.company_name}
                    <p>({lead?.name})</p>
                  </option>
                ))}
              </select> */}
            </div>
            <div className="form-group">
              <label>
                Company Name <span>*</span>
              </label>
              <input
                type="text"
                name="company_name"
                value={form.company_name}
                onChange={(e) => setField("company_name", e.target.value)}
                required
              />
              {error?.company_name && (
                <p className={styles.errorMessage}>{error.company_name}</p>
              )}
            </div>

            <div className="form-group">
              <label>
                GSTIN <span>*</span>
              </label>
              <input
                type="text"
                name="gstin"
                value={form.gstin}
                maxLength={15}
                onChange={(e) => setField("gstin", e.target.value)}
                required
              />
              {error?.gstin && (
                <p className={styles.errorMessage}>{error.gstin}</p>
              )}
            </div>

            <div className="form-group">
              <label>
                Name <span>*</span>
              </label>
              <div
                className={`${styles.phoneGroup} phone-group name-title-row`}
              >
                <select
                  name="salutation"
                  className="form-control phone-code-select title-select"
                  value={form.salutation}
                  onChange={(e) => setField("salutation", e.target.value)}
                  required
                >
                  <option value="">Title</option>
                  {ddData?.data?.options?.salutation?.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  required
                />
              </div>
              {(error?.salutation || error?.name) && (
                <p className={styles.errorMessage}>
                  {error?.salutation || error?.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label>
                Email <span>*</span>
              </label>
              <div
                className={styles.locSelect}
                style={{ position: "relative" }}
              >
                <input
                  type="email"
                  name="email"
                  id="quotationEmail"
                  className="loc-select-input"
                  value={form.email}
                  required
                  autoComplete="off"
                  placeholder="Type email"
                  onChange={(e) => {
                    setField("email", e.target.value);
                    setShowEmailSuggestions(true);
                  }}
                  onFocus={() => setShowEmailSuggestions(true)}
                  onBlur={() => setShowEmailSuggestions(false)}
                />
                {showEmailSuggestions && emailSuggestions.length > 0 && (
                  <ul
                    role="listbox"
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      zIndex: 20,
                      margin: 0,
                      padding: 0,
                      listStyle: "none",
                      maxHeight: 220,
                      overflowY: "auto",
                      background: "#fff",
                      border: "1px solid #d9d9d9",
                      borderRadius: 6,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                  >
                    {emailSuggestions.map((item) => (
                      <li
                        key={item.email}
                        role="option"
                        style={{ padding: "8px 12px", cursor: "pointer" }}
                        // mouseDown fires before the input's blur closes the list
                        onMouseDown={(e) => {
                          e.preventDefault();
                          applyEmailSuggestion(item);
                        }}
                      >
                        {item.email}
                        {item.label && (
                          <span style={{ color: "#888", marginLeft: 8 }}>
                            {item.label}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {error?.email && (
                <p className={styles.errorMessage}>{error.email}</p>
              )}
            </div>

            {/* Mobile */}
            <div className="form-group">
              <label>Mobile</label>
              <div className={`${styles.phoneGroup} phone-group`}>
                <select
                  name="mobile_code"
                  className="form-control phone-code-select"
                  value={form.mobile_code}
                  onChange={(e) => setField("mobile_code", e.target.value)}
                >
                  {countryCodes.map(([code, label]) => (
                    <option key={code + label} value={code}>
                      +{code} {label}
                    </option>
                  ))}
                </select>
                <div
                  className={styles.locSelect}
                  style={{ flex: 1, minWidth: 0 }}
                >
                  <input
                    type="tel"
                    name="mobile"
                    id="quotationMobile"
                    className={styles.locSelectInput}
                    value={form.mobile}
                    autoComplete="off"
                    inputMode="numeric"
                    maxLength={15}
                    placeholder="Type number"
                    onChange={(e) => setField("mobile", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>
                Discount (in %) <span>*</span>
              </label>
              <input
                type="number"
                name="discount"
                min="0"
                max={maxDiscount ?? 100}
                step="0.01"
                value={form.discount}
                onChange={(e) => {
                  const nextValue = e.target.value;
                  if (nextValue === "") {
                    setField("discount", "");
                    return;
                  }

                  const numericValue = Number(nextValue);
                  if (!Number.isFinite(numericValue) || numericValue < 0) {
                    return;
                  }

                  if (maxDiscount != null && numericValue > maxDiscount) {
                    setField("discount", String(maxDiscount));
                    return;
                  }

                  setField("discount", nextValue);
                }}
                required
              />
              {maxDiscount != null && (
                <p className={styles.maxDiscountHint}>
                  Max discount: {maxDiscount}%
                </p>
              )}
              {error?.discount && (
                <p className={styles.errorMessage}>{error.discount}</p>
              )}
            </div>

            {/* <div className="form-group">
              <label>
                Order Type <span>*</span>
              </label>
              <select
                name="deal_type"
                id="dealType"
                className="form-control"
                value={form.deal_type}
                onChange={(e) => setField("deal_type", e.target.value)}
                required
              >
                {dealTypes.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div> */}
          </div>

          {/* Domain */}
          <div id="domainSection">
            <h3 className="section-title">Domain Detail</h3>

            <div className="form-grid">
              <div className="form-group">
                <label>
                  Domain option <span>*</span>
                </label>
                <select
                  name="domain_type"
                  id="domainType"
                  className="form-control"
                  value={form.domain_type}
                  onChange={(e) => setField("domain_type", e.target.value)}
                  disabled={
                    !domainAvailable?.data?.available &&
                    domainAvailable?.data?.registered
                  }
                >
                  <option value="" disabled>
                    Select domain option
                  </option>
                  <option value="existing">Already have domain</option>
                  <option value="new">Need new domain</option>
                </select>
                {error?.domain_type && (
                  <p className={styles.errorMessage}>{error.domain_type}</p>
                )}
              </div>

              <div
                className="form-group domain-name-wrap"
                style={{ display: form.domain_type ? "block" : "none" }}
              >
                <label>Domain Name</label>
                <input
                  type="text"
                  name="domain_name"
                  id="domainName"
                  value={form.domain_name}
                  onChange={(e) => setField("domain_name", e.target.value)}
                />
                <p
                  style={{
                    color: isCheckingDomain
                      ? "gray"
                      : domainAvailable?.data?.available
                        ? "green"
                        : "red",
                  }}
                >
                  {isCheckingDomain
                    ? "Checking domain availability..."
                    : domainAvailable?.message}
                </p>
              </div>

              {form.domain_type === "existing" && (
                <div className="form-group domain-new-wrap">
                  <label>Renewal Date</label>
                  <div className="date-input">
                    <input
                      type="date"
                      name="renewal_date"
                      value={form.renewal_date}
                      onChange={(e) => setField("renewal_date", e.target.value)}
                    />
                  </div>
                </div>
              )}
              {form.domain_type === "new" && (
                <>
                  <div className="form-group domain-new-wrap">
                    <label>SAC</label>
                    <input
                      type="text"
                      name="sac"
                      value={form.sac}
                      onChange={(e) => setField("sac", e.target.value)}
                    />
                  </div>

                  <div className="form-group domain-new-wrap">
                    <label>Domain Start</label>
                    <div className="date-input">
                      <input
                        type="date"
                        name="domain_start"
                        value={form.domain_start}
                        onChange={(e) =>
                          setField("domain_start", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group domain-new-wrap">
                    <label>Domain End</label>
                    <div className="date-input">
                      <input
                        type="date"
                        name="domain_end"
                        value={form.domain_end}
                        onChange={(e) => setField("domain_end", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group domain-new-wrap">
                    <label>Rate</label>
                    <input
                      type="text"
                      name="domain_rate"
                      value={form.domain_rate}
                      onChange={(e) => setField("domain_rate", e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="section-heading">
            <h3>Plan Detail</h3>
            <button
              type="button"
              className={styles.addPlanBtn}
              id="addPlanBtn"
              onClick={addPlan}
            >
              + Add Plan
            </button>
          </div>

          <div id="plansWrapper" className={styles.stackList}>
            {plans?.map((row, i) => (
              <div className={styles.planBox} key={i}>
                <div className={styles.planHeader}>
                  <strong className="plan-number">Sr. No. {i + 1}</strong>

                  <button
                    type="button"
                    className="remove-plan"
                    aria-label="Remove Plan"
                    style={{ display: plans.length > 1 ? "flex" : "none" }}
                    onClick={() => removePlan(i)}
                  >
                    <BiX size={20} color="#aaaaaa" />
                  </button>
                </div>

                <div className="form-grid form-grid-3">
                  {/* <div className="form-group addon-only">
                    <label>
                      Current Plan <span>*</span>
                    </label>
                    <select
                      className="form-control current-service-select"
                      name={pname(i, "from_service_id")}
                      value={row.current_service_id}
                      onChange={(e) =>
                        onRowInput(i, "current_service_id", e.target.value)
                      }
                    >
                      <option value="">Select Current Plan</option>
                    </select>
                  </div> */}

                  <div className="form-group provider-group">
                    <label>
                      Provider <span>*</span>
                    </label>
                    <select
                      className="form-control provider-select"
                      name={pname(i, "provider_id")}
                      value={row?.provider_id}
                      onChange={(e) =>
                        onRowInput(i, "provider_id", e.target.value)
                      }
                      required
                    >
                      <option value="">Select Provider</option>
                      {ddData?.data?.providers?.map((p) => (
                        <option key={p?.id} value={p?.id}>
                          {p?.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group plan-group">
                    <label>
                      Plan<span>*</span>
                    </label>
                    <select
                      className="form-control plan-select"
                      name={pname(i, "plan_id")}
                      value={row?.plan_id}
                      onChange={(e) => onRowInput(i, "plan_id", e.target.value)}
                      disabled={!row?.provider_id}
                      required
                    >
                      <option value="">
                        {row?.provider_id
                          ? "Select Plan"
                          : "Select a provider first"}
                      </option>
                      {plansForProvider(row?.provider_id).map((p) => (
                        <option key={p?.id} value={p?.id}>
                          {p?.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group period-group">
                    <label>
                      Quote Period <span>*</span>
                    </label>
                    <select
                      className="form-control quote-period-select"
                      name={pname(i, "quote_period")}
                      value={row?.quote_period}
                      onChange={(e) =>
                        onRowInput(i, "quote_period", e.target.value)
                      }
                      required
                    >
                      <option value="">Select Billing Cycle</option>
                      {ddData?.data?.options?.quote_period?.map((p) => (
                        <option key={p} value={p}>
                          {p || "-"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      name={pname(i, "billing_start_date")}
                      className="start-input"
                      value={row?.billing_start_date}
                      onChange={(e) =>
                        onRowInput(i, "billing_start_date", e.target.value)
                      }
                    />
                    <div className="form-hint end-hint"></div>
                  </div>

                  <div className="form-group sku-group">
                    <label>
                      SKU <span>*</span>
                    </label>
                    <input
                      type="text"
                      name={pname(i, "sku")}
                      className="sku-input"
                      value={row?.sku}
                      onChange={(e) => onRowInput(i, "sku", e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Quantity <span>*</span>
                    </label>
                    <input
                      type="number"
                      name={pname(i, "quantity")}
                      className="qty-input"
                      min="1"
                      value={row?.quantity}
                      onChange={(e) =>
                        onRowInput(i, "quantity", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Rate <span>*</span>
                    </label>
                    <input
                      type="text"
                      name={pname(i, "rate")}
                      className="rate-input"
                      value={row?.rate}
                      onChange={(e) => onRowInput(i, "rate", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {error?.plans && <p className={styles.errorMessage}>{error.plans}</p>}

          <div className={styles.submitWrap}>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isCreatingQuotation}
            >
              {isCreatingQuotation ? "Saving..." : "Save Quotation"}
            </button>
          </div>
        </section>
      </form>
    </main>
  );
}
