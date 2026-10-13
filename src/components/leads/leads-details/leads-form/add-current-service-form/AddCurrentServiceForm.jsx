import React from "react";
import styles from "@/components/dashboard/leads/Leads.module.css";

const AddCurrentServiceForm = () => {
  return (
    <div className={styles.creditModalBox}>
      <h2 className={styles.contactModalTitle}>Add Current Service</h2>{" "}
      <form
        method="POST"
        action="https://superadmin.tizzygroup.com/crm/leads/70/services"
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
              required=""
            >
              <option value="">Select Provider</option>
              <option value="3">Google Workspace</option>
              <option value="2">Microsoft 365</option>
              <option value="1">Tizzy Mail</option>
            </select>
          </div>
          <div className="form-group">
            <label>Plan</label>
            <select
              name="plan_id"
              id="servicePlan"
              className="plan-select"
              required=""
            >
              <option value="">Select Plan</option>
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
            >
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Half Yearly">Half Yearly</option>
              <option value="Yearly" selected="">
                Yearly
              </option>
            </select>
          </div>
          <div className="form-group">
            <label>SKU</label>
            <input
              type="text"
              name="sku"
              id="serviceSku"
              className="sku-input"
              readonly=""
            />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              id="serviceQty"
              min="1"
              value="1"
              required=""
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
            />
          </div>
          <div className="form-group" id="serviceDomainWrap">
            <label>Domain Name</label>
            <input
              type="text"
              name="domain"
              id="serviceDomain"
              placeholder="example.com"
            />
          </div>
          <div className="form-group" id="serviceRenewalWrap">
            <label>Renewal Date</label>
            <div className="date-input">
              <input type="date" name="renewal_date" id="serviceRenewal" />
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
