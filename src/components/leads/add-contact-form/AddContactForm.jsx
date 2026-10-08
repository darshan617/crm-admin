import React from "react";
import styles from "@/components/leads/add-contact-form/AddContactForm.module.css";

const AddContactForm = () => {
  return (
    <>
      <div className={styles.creditModalBox}>
        <h2 className={styles.contactModalTitle}>Add Contact</h2>{" "}
        <form
          method="POST"
          action="https://superadmin.tizzygroup.com/crm/leads/70/contacts"
          id="contactForm"
          className={`${styles.formGrid} common-form`}
        >
          <input
            type="hidden"
            name="_token"
            value="WW2Yc8aGHganqT0MoQtZEFariu0DTM7CjtaZh8YE"
            autocomplete="off"
          />{" "}
          <div className="form-group">
            <label>
              Full Name <span>*</span>
            </label>
            <input type="text" name="name" id="contactName" required="" />
          </div>
          <div className="form-group">
            <label>Designation</label>
            <input type="text" name="designation" id="contactDesignation" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" id="contactEmail" />
          </div>
          <div className="form-group">
            <label>Contact No.</label>
            <input
              type="tel"
              name="mobile"
              id="contactMobile"
              inputmode="numeric"
              maxlength="15"
              pattern="[0-9]{6,15}"
              className="js-mobile-digits"
            />
          </div>
          <div className={styles.submitWrap}>
            <button type="submit" className={styles.submitBtn}>
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddContactForm;
