import React from "react";
import styles from "@/components/dashboard/leads/Leads.module.css";

const AddCurrentServiceForm = ({
  leadId,
  initialData = null,
  apiDropdownData,
  formData,
  handleFormChange,
  formIndex = 0,
  formSection = "current_service_info",
  handleUpdate,
}) => {
  const isEditing = Boolean(initialData?.id);
  const providers = apiDropdownData?.data?.options?.providers || [];
  const service = formData?.[formSection]?.[formIndex] || {};
  const plans = Object.values(
    apiDropdownData?.data?.options?.plans || {},
  ).flat();
  // .filter(
  //   (plan) =>
  //     !service.provider_id ||
  //     String(plan.provider_id) === String(service.provider_id),
  // );
  if (
    initialData?.plan &&
    !plans.some((plan) => String(plan.id) === String(initialData.plan_id))
  ) {
    plans.push(initialData.plan);
  }
  const onChange = (event) => handleFormChange(event, formSection, formIndex);

  return (
    <div className={styles.creditModalBox}>
      <h2 className={styles.contactModalTitle}>
        {isEditing ? "Edit Current Service" : "Add Current Service"}
      </h2>{" "}
      <form
        onSubmit={handleUpdate}
        key={initialData?.id || "new-current-service"}
        id="leadServiceForm"
        className="common-form"
      >
        <input
          type="hidden"
          name="_token"
          value="Z8T4Z4wcLu3bq04L5SxjiCocVuxKCOKs0PIxupUi"
          autocomplete="off"
        />{" "}
        <input type="hidden" name="is_info" id="serviceIsInfo" value="1" />
        <div className={`${styles.formGrid} ${styles.formGrid3}`}>
          <div className="form-group">
            <label>Provider</label>
            <select
              name="provider_id"
              id="serviceProvider"
              className="provider-select"
              value={service.provider_id ?? ""}
              onChange={onChange}
              required
            >
              <option value="">Select Provider</option>
              {providers.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Plan</label>
            <select
              name="plan_id"
              id="servicePlan"
              className="plan-select"
              value={service.plan_id ?? ""}
              onChange={onChange}
              required
            >
              <option value="">Select Plan</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                </option>
              ))}
            </select>
          </div>
          <div
            className="form-group"
            id="servicePeriodWrap"
            style={{ display: "none" }}
          >
            <label>Quot Period</label>
            <select
              name="quote_period"
              id="servicePeriod"
              className="quote-period-select"
              value={service.quote_period || "Yearly"}
              onChange={onChange}
            >
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Half Yearly">Half Yearly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
          <div className="form-group">
            <label>SKU</label>
            <input
              type="text"
              name="sku"
              id="serviceSku"
              className="sku-input"
              value={service.sku || ""}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              id="serviceQty"
              min="1"
              value={service.quantity ?? ""}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label id="serviceRateLabel">Current Price</label>
            <input
              type="number"
              name="rate"
              id="serviceRate"
              className="rate-input"
              min="0"
              step="0.01"
              value={service.rate ?? ""}
              onChange={onChange}
            />
          </div>
          <div className="form-group" id="serviceDomainWrap">
            <label>Domain Name</label>
            <input
              type="text"
              name="domain"
              id="serviceDomain"
              placeholder="example.com"
              value={service.domain || ""}
              onChange={onChange}
            />
          </div>
          <div className="form-group" id="serviceRenewalWrap">
            <label>Renewal Date</label>
            <div className="date-input">
              <input
                type="date"
                name="renewal_date"
                id="serviceRenewal"
                value={service.renewal_date || ""}
                onChange={onChange}
              />
            </div>
          </div>
        </div>
        <div className={styles.submitWrap}>
          <button type="submit" className={styles.submitBtn}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCurrentServiceForm;
