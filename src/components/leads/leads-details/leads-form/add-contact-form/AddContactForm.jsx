import React from "react";
import styles from "@/components/leads/leads-details/leads-form/add-contact-form/AddContactForm.module.css";

const AddContactForm = ({
  leadId,
  initialData = null,
  formData,
  handleFormChange,
  formIndex = 0,
  handleUpdate,
  apiDropdownData,
}) => {
  const isEditing = Boolean(initialData?.id);
  const contact = formData?.additional_contact?.[formIndex] || {};
  const designation = apiDropdownData?.data?.options?.designation;

  return (
    <>
      <div className={styles.creditModalBox}>
        <h2 className={styles.contactModalTitle}>
          {isEditing ? "Edit Contact" : "Add Contact"}
        </h2>{" "}
        <form
          key={initialData?.id || "new-contact"}
          id="contactForm"
          className={`${styles.formGrid} common-form`}
          onSubmit={handleUpdate}
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
            <input
              type="text"
              name="name"
              id="contactName"
              value={contact.name || ""}
              onChange={(event) =>
                handleFormChange(event, "additional_contact", formIndex)
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Designation</label>
            <input
              type="text"
              name="designation"
              id="contactDesignation"
              value={contact.designation || ""}
              onChange={(event) =>
                handleFormChange(event, "additional_contact", formIndex)
              }
            />
            {/* <select
              aria-label="Designation"
              type="text"
              value={formData?.customer_detail?.designation}
              name="designation"
              onChange={(e) => handleFormChange(e, "customer_detail")}
            >
              <option value="" disabled>
                Designation
              </option>
              {designation?.map((item, idx) => {
                return <option value={item}>{item}</option>;
              })}
            </select> */}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              id="contactEmail"
              value={contact.email || ""}
              onChange={(event) =>
                handleFormChange(event, "additional_contact", formIndex)
              }
            />
          </div>
          <div className="form-group">
            <label>Contact No.</label>
            <input
              type="tel"
              name="mobile"
              id="contactMobile"
              value={contact.mobile || ""}
              onChange={(event) =>
                handleFormChange(event, "additional_contact", formIndex)
              }
              inputMode="numeric"
              maxLength="15"
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
