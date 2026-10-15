import React, { useRef, useState } from "react";
import styles from "@/components/dashboard/leads/Leads.module.css";
import { LuFileDown } from "react-icons/lu";
import { IoMdArrowBack } from "react-icons/io";
import { FaRegTrashAlt } from "react-icons/fa";
import {
  useCreateLeadMutation,
  useGetDdDataQuery,
} from "@/redux/apis/leadsApi";
import { useToast } from "@/custom-hooks/toast/ToastProvider";
import { useRouter } from "next/router";

const Leads = () => {
  const { showToast } = useToast();
  const router = useRouter();
  const { data: apiDropdownData } = useGetDdDataQuery();
  const [formData, setFormData] = useState({
    customer_detail: {
      salutation: "",
      name: "",
      designation: "",
      email: "",
      mobile_code: "91",
      mobile: "",
      company_name: "",
      industry: "",
      no_of_employees: "",
      gstin: "",
      business_type: "new",
    },
    address_information: {
      mailing_address: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
    },
    domain: {
      domain_type: "no-domain",
      domain: "",
      domain_period: "",
      domain_rate: null,
      sac: "",
      domain_start: "",
      domain_end: "",
      domain_renewal_date: "",
    },
    current_service_info: [
      {
        domain: "",
        provider_id: "",
        plan_id: "",
        quantity: "",
        rate: "",
        renewal_date: "",
      },
    ],
    our_service_plan_detail: [
      {
        provider_id: null,
        plan_id: null,
        quote_period: "",
        sku: "",
        quantity: null,
        rate: "",
      },
    ],
    additional_contact: [
      {
        name: "",
        designation: "",
        email: "",
        mobile: "",
      },
    ],
    lead_specification: {
      lead_priority: "",
      lead_status: "",
      lead_bifurcation: "",
      lead_source: "",
      assigned_to: "",
    },
    follow_up_detail: {
      follow_up_date: "",
      follow_up_note: "",
    },
    documents: [],
  });
  console.log(formData);

  const [createLead, { isLoading: isCreatingLead }] = useCreateLeadMutation();
  const documentInputRef = useRef(null);

  const handleFormChange = (e, section, index = null) => {
    const { name } = e.target;
    const value =
      e.target.type === "number"
        ? e.target.value === ""
          ? null
          : Number(e.target.value)
        : e.target.value;

    setFormData((prev) => {
      // Handle array sections
      if (Array.isArray(prev[section])) {
        return {
          ...prev,
          [section]: prev[section].map((item, i) =>
            i === index ? { ...item, [name]: value } : item,
          ),
        };
      }

      // Handle object sections
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value,
        },
      };
    });
  };

  const handleCustomerFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      customer_detail: {
        ...prev.customer_detail,
        [field]: value,
      },
    }));
  };

  const handleDocumentSelect = (event) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    if (selectedFiles.length === 0) return;

    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...selectedFiles],
    }));
    event.target.value = "";
  };

  const handleDocumentRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, fileIndex) => fileIndex !== index),
    }));
  };

  const handleMultiple = (type) => {
    if (type === "plan") {
      setFormData((prev) => ({
        ...prev,
        our_service_plan_detail: [
          ...prev.our_service_plan_detail,
          {
            provider_id: null,
            plan_id: null,
            quote_period: "",
            sku: "",
            quantity: null,
            rate: "",
          },
        ],
      }));
    } else if (type === "current-service") {
      setFormData((prev) => ({
        ...prev,
        current_service_info: [
          ...prev.current_service_info,
          {
            domain: "",
            provider_id: "",
            plan_id: "",
            quantity: "",
            rate: "",
            renewal_date: "",
          },
        ],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        additional_contact: [
          ...prev.additional_contact,
          {
            name: "",
            designation: "",
            email: "",
            mobile: "",
          },
        ],
      }));
    }
  };

  const handleCreateLead = async () => {
    try {
      const formBody = new FormData();
      formBody.append(
        "customer_detail",
        JSON.stringify(formData.customer_detail),
      );

      formBody.append(
        "address_information",
        JSON.stringify(formData.address_information),
      );

      formBody.append("domain", JSON.stringify(formData.domain));

      formBody.append(
        "current_service_info",
        JSON.stringify(formData.current_service_info),
      );

      formBody.append(
        "our_service_plan_detail",
        JSON.stringify(formData.our_service_plan_detail),
      );

      formBody.append(
        "additional_contact",
        JSON.stringify(formData.additional_contact),
      );

      formBody.append(
        "lead_specification",
        JSON.stringify(formData.lead_specification),
      );

      formBody.append(
        "follow_up_detail",
        JSON.stringify(formData.follow_up_detail),
      );

      formData.documents.forEach((file) => {
        formBody.append("attachments[]", file);
      });

      const res = await createLead({
        body: formBody,
      });
      console.log(res);
      if (res?.data?.success) {
        showToast(res?.data?.message, "success");
        router?.push("/leads");
        setFormData({
          customer_detail: {
            salutation: "",
            name: "",
            designation: "",
            email: "",
            mobile_code: "91",
            mobile: "",
            company_name: "",
            industry: "",
            no_of_employees: "",
            gstin: "",
            business_type: "new",
          },
          address_information: {
            mailing_address: "",
            country: "",
            state: "",
            city: "",
            pincode: "",
          },
          domain: {
            domain_type: "no-domain",
            domain: "",
            domain_period: "",
            domain_rate: null,
            sac: "",
            domain_start: "",
            domain_end: "",
            domain_renewal_date: "",
          },
          current_service_info: [
            {
              domain: "",
              provider_id: "",
              plan_id: "",
              quantity: "",
              rate: "",
              renewal_date: "",
            },
          ],
          our_service_plan_detail: [
            {
              provider_id: null,
              plan_id: null,
              quote_period: "",
              sku: "",
              quantity: null,
              rate: "",
            },
          ],
          additional_contact: [
            {
              name: "",
              designation: "",
              email: "",
              mobile: "",
            },
          ],
          lead_specification: {
            lead_priority: "",
            lead_status: "",
            lead_bifurcation: "",
            lead_source: "",
            assigned_to: "",
          },
          follow_up_detail: {
            follow_up_date: "",
            follow_up_note: "",
          },
          documents: [],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="content">
      <div className="page-header">
        <div className="">
          <div className="breadcrumb welcome-text">
            <p>
              <a href="">Dashboard</a> <span>/</span>
              <a href="">Leads</a>
            </p>
          </div>
          <h2>Add New Lead</h2>
        </div>
        <div className="back">
          <a href="/" className="back-btn">
            <IoMdArrowBack />
            <span>Back</span>
          </a>
        </div>
      </div>
      <section className={styles.commonForm}>
        <div className={styles.mainFormLayout}>
          {/* =================== LEFT SIDE =================== */}
          <div className={styles.formLeft}>
            {/* CUSTOMER DETAIL */}
            <h3>Customer Detail</h3>

            <div className={styles.formGrid}>
              {/* Name */}
              <div className="form-group">
                <label>Name</label>
                <div className={styles.nameInputGroup}>
                  <select
                    aria-label="Title"
                    value={formData?.customer_detail?.salutation}
                    onChange={(e) => handleFormChange(e, "customer_detail")}
                    name="salutation"
                  >
                    <option value="" disabled>
                      Title
                    </option>
                    {apiDropdownData?.data?.options?.salutation?.map(
                      (item, idx) => {
                        return <option value={item}>{item}</option>;
                      },
                    )}
                  </select>
                  <input
                    type="text"
                    value={formData?.customer_detail?.name}
                    name="name"
                    onChange={(e) => handleFormChange(e, "customer_detail")}
                  />
                </div>
              </div>

              {/* Designation */}
              <div className="form-group">
                {/* <label>Designation</label>
                <input
                  type="text"
                  value={formData?.customer_detail?.designation}
                  name="designation"
                  onChange={(e) => handleFormChange(e, "customer_detail")}
                /> */}
                <select
                  aria-label="Designation"
                  type="text"
                  value={formData?.customer_detail?.designation}
                  name="designation"
                  onChange={(e) => handleFormChange(e, "customer_detail")}
                >
                  <option value="" disabled>
                    Select Designation
                  </option>
                  {apiDropdownData?.data?.options?.designation?.map(
                    (item, idx) => {
                      return <option value={item}>{item}</option>;
                    },
                  )}
                </select>
              </div>

              {/* Email */}
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData?.customer_detail?.email}
                  name="email"
                  onChange={(e) => handleFormChange(e, "customer_detail")}
                />
              </div>

              {/* Mobile */}
              <div className="form-group">
                <label>Mobile No.</label>
                <div className="phone-group">
                  <select
                    value={formData?.customer_detail?.mobile_code}
                    name="mobile_code"
                    onChange={(e) => handleFormChange(e, "customer_detail")}
                  >
                    <option>91</option>
                    <option>1</option>
                    <option>44</option>
                    <option>971</option>
                  </select>
                  <input
                    type="tel"
                    value={formData?.customer_detail?.mobile}
                    name="mobile"
                    onChange={(e) => handleFormChange(e, "customer_detail")}
                  />
                </div>
              </div>

              {/* Company Name 2 */}
              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  value={formData?.customer_detail?.company_name}
                  name="company_name"
                  onChange={(e) => handleFormChange(e, "customer_detail")}
                />
              </div>

              {/* Industry 2 */}
              <div className="form-group">
                <label>Industry</label>
                <input
                  type="text"
                  value={formData?.customer_detail?.industry}
                  name="industry"
                  onChange={(e) => handleFormChange(e, "customer_detail")}
                />
              </div>

              {/* Employees */}
              <div className="form-group">
                <label>No. of Employees</label>
                <input
                  type="text"
                  value={formData?.customer_detail?.no_of_employees}
                  name="no_of_employees"
                  onChange={(e) => handleFormChange(e, "customer_detail")}
                />
              </div>

              {/* GSTIN */}
              <div className="form-group">
                <label>GSTIN</label>
                <input
                  type="text"
                  value={formData?.customer_detail?.gstin}
                  name="gstin"
                  onChange={(e) => handleFormChange(e, "customer_detail")}
                />
              </div>
            </div>

            {/* ADDRESS INFORMATION */}
            <h3 className="section-title">Address Information</h3>

            <div className={styles.formGrid}>
              {/* Mailing Address */}
              <div className="form-group full-width">
                <label>Mailing Address</label>
                <input
                  type="text"
                  name="mailing_address"
                  value={formData.address_information.mailing_address}
                  onChange={(e) => handleFormChange(e, "address_information")}
                />
              </div>

              {/* Country */}
              <div className="form-group">
                <label>Country</label>
                <select
                  name="country"
                  value={formData.address_information.country}
                  onChange={(e) => handleFormChange(e, "address_information")}
                >
                  <option>India</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>United Arab Emirates</option>
                </select>
              </div>

              {/* State */}
              <div className="form-group">
                <label>State</label>
                <select
                  name="state"
                  value={formData.address_information.state}
                  onChange={(e) => handleFormChange(e, "address_information")}
                >
                  <option>Maharashtra</option>
                  <option>Gujarat</option>
                  <option>Goa</option>
                  <option>Karnataka</option>
                  <option>Delhi</option>
                </select>
              </div>

              {/* City */}
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.address_information.city}
                  onChange={(e) => handleFormChange(e, "address_information")}
                />
              </div>

              {/* Pincode */}
              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.address_information.pincode}
                  onChange={(e) => handleFormChange(e, "address_information")}
                />
              </div>
            </div>

            <div className={styles.businessTypeCard}>
              <div className={styles.businessTypeTitle}>Choose Business</div>
              <div className={styles.businessTypeOptions}>
                <label className={styles.businessTypeOption}>
                  <input
                    type="radio"
                    name="business_type"
                    value="new"
                    checked={formData.customer_detail.business_type === "new"}
                    onChange={(event) =>
                      handleCustomerFieldChange(
                        "business_type",
                        event.target.value,
                      )
                    }
                  />
                  <span className={styles.radioCircle} aria-hidden="true" />
                  <span className={styles.optionLabel}>New Business</span>
                </label>

                <label className={styles.businessTypeOption}>
                  <input
                    type="radio"
                    name="business_type"
                    value="existing"
                    checked={
                      formData.customer_detail.business_type === "existing"
                    }
                    onChange={(event) =>
                      handleCustomerFieldChange(
                        "business_type",
                        event.target.value,
                      )
                    }
                  />
                  <span className={styles.radioCircle} aria-hidden="true" />
                  <span className={styles.optionLabel}>Existing Business</span>
                </label>
              </div>
            </div>

            {formData.customer_detail.business_type === "existing" && (
              <div className={styles.existingServiceWrapper}>
                <div className={styles.serviceHeader}>
                  <h3>Current Service (Info)</h3>
                  <button
                    type="button"
                    className={styles.addServiceBtn}
                    onClick={() => handleMultiple("current-service")}
                  >
                    + Add Service
                  </button>
                </div>

                <p className={styles.serviceHelp}>
                  For information only — what they use with another vendor. Add
                  Tizzy plans below to quote.
                </p>

                {formData?.current_service_info?.map((item, idx) => {
                  return (
                    <div className={styles.servicePanel} key={idx}>
                      <div className={styles.servicePanelTitle}>
                        Service {idx + 1}
                      </div>

                      <div className={styles.serviceGrid}>
                        <div className={styles.serviceField}>
                          <label>Domain Name</label>
                          <input
                            type="text"
                            name="domain"
                            placeholder="Domain Name"
                            value={item.domain}
                            onChange={(e) =>
                              handleFormChange(e, "current_service_info", idx)
                            }
                          />
                        </div>

                        <div className={styles.serviceField}>
                          <label>Tizzy Service</label>
                          <div className={styles.selectWrap}>
                            <select
                              name="provider_id"
                              value={item.provider_id}
                              onChange={(e) =>
                                handleFormChange(e, "current_service_info", idx)
                              }
                            >
                              <option value="" disabled>
                                Select Service
                              </option>
                              <option value="1">Tizzy Service</option>
                              <option value="3">Google Workspace</option>
                              <option value="2">Microsoft 365</option>
                            </select>
                          </div>
                        </div>

                        <div className={styles.serviceField}>
                          <label>Plan Name</label>
                          <div className={styles.selectWrap}>
                            <select
                              name="plan_id"
                              value={item.plan_id}
                              onChange={(e) =>
                                handleFormChange(e, "current_service_info", idx)
                              }
                            >
                              <option value="" disabled>
                                Plan Name
                              </option>
                              {Object.values(
                                apiDropdownData?.data?.options?.plans || {},
                              )
                                .flat()
                                .map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.name}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>

                        <div className={styles.serviceField}>
                          <label>No of Users</label>
                          <input
                            type="text"
                            name="quantity"
                            placeholder="Quantities"
                            value={item.quantity}
                            onChange={(e) =>
                              handleFormChange(e, "current_service_info", idx)
                            }
                          />
                        </div>

                        <div className={styles.serviceField}>
                          <label>Current Price</label>
                          <input
                            type="text"
                            name="rate"
                            placeholder="Price"
                            value={item.rate}
                            onChange={(e) =>
                              handleFormChange(e, "current_service_info", idx)
                            }
                          />
                        </div>

                        <div className={styles.serviceField}>
                          <label>Renewal Date</label>
                          <div className={styles.dateWrap}>
                            <input
                              type="date"
                              name="renewal_dates"
                              value={item.renewal_dates}
                              onChange={(e) =>
                                handleFormChange(e, "current_service_info", idx)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className={styles.domainSection}>
              <div className={styles.domainTitle}>Domain</div>

              {formData.domain.domain_type === "existing" ? (
                <div className={styles.domainSelectionGrid}>
                  <div className={styles.domainField}>
                    <label>Domain option</label>
                    <div className={styles.domainSelectWrap}>
                      <select
                        name="domain_type"
                        value={formData.domain.domain_type}
                        onChange={(e) => handleFormChange(e, "domain")}
                      >
                        <option value="no-domain">No domain</option>
                        <option value="existing">Already have domain</option>
                        <option value="new">Need new domain</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.domainField}>
                    <label>Domain Name</label>
                    <input
                      type="text"
                      name="domain"
                      placeholder="example.com"
                      value={formData.domain.domain}
                      onChange={(e) => handleFormChange(e, "domain")}
                    />
                  </div>

                  <div className={styles.domainField}>
                    <label>Renewal Date</label>
                    <div className={styles.dateWrap}>
                      <input
                        type="date"
                        name="domain_renewal_date"
                        value={formData.domain.domain_renewal_date}
                        onChange={(e) => handleFormChange(e, "domain")}
                      />
                    </div>
                  </div>
                </div>
              ) : formData.domain.domain_type === "new" ? (
                <div className={styles.domainSelectionGrid}>
                  <div className={styles.domainField}>
                    <label>Domain option</label>
                    <div className={styles.domainSelectWrap}>
                      <select
                        name="domain_type"
                        value={formData.domain.domain_type}
                        onChange={(e) => handleFormChange(e, "domain")}
                      >
                        <option value="no-domain">No domain</option>
                        <option value="existing">Already have domain</option>
                        <option value="new">Need new domain</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.domainField}>
                    <label>Domain Name</label>
                    <input
                      type="text"
                      name="domain"
                      placeholder="example.com"
                      value={formData.domain.domain}
                      onChange={(e) => handleFormChange(e, "domain")}
                    />
                    {/* <button type="button" className={styles.availabilityButton}>
                      Check Availability
                    </button> */}
                  </div>

                  <div className={styles.domainField}>
                    <label>Period</label>
                    <div className={styles.periodSelectWrap}>
                      <select
                        name="domain_period"
                        value={formData.domain.domain_period}
                        onChange={(e) => handleFormChange(e, "domain")}
                      >
                        <option value="">Select Period</option>
                        {apiDropdownData?.data?.options?.domain_period?.map(
                          (item, idx) => {
                            return <option value={item}>{item}</option>;
                          },
                        )}
                      </select>
                    </div>
                  </div>

                  <div className={styles.domainField}>
                    <label>Rate</label>
                    <input
                      type="text"
                      name="domain_rate"
                      value={formData.domain.domain_rate ?? ""}
                      onChange={(e) => handleFormChange(e, "domain")}
                    />
                  </div>

                  <div className={styles.domainField}>
                    <label>SAC</label>
                    <input
                      type="text"
                      name="sac"
                      value={formData.domain.sac}
                      onChange={(e) => handleFormChange(e, "domain")}
                    />
                  </div>

                  <div className={styles.domainField}>
                    <label>Domain Start</label>
                    <div className={styles.dateWrap}>
                      <input
                        type="date"
                        name="domain_start"
                        value={formData.domain.domain_start}
                        onChange={(e) => handleFormChange(e, "domain")}
                      />
                    </div>
                  </div>

                  <div className={styles.domainField}>
                    <label>Domain End</label>
                    <div className={styles.dateWrap}>
                      <input
                        type="date"
                        name="domain_end"
                        value={formData.domain.domain_end}
                        onChange={(e) => handleFormChange(e, "domain")}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.domainField}>
                  <label>Domain option</label>
                  <div className={styles.domainSelectWrap}>
                    <select
                      name="domain_type"
                      value={formData.domain.domain_type}
                      onChange={(e) => handleFormChange(e, "domain")}
                    >
                      <option value="no-domain">No domain</option>
                      <option value="existing">Already have domain</option>
                      <option value="new">Need new domain</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* PLAN DETAIL */}
            <div className="section-heading">
              <h3>Plan Detail</h3>
              <button
                type="button"
                className={styles.addPlanBtn}
                onClick={() => handleMultiple("plan")}
              >
                + Add Plan
              </button>
            </div>

            {formData?.our_service_plan_detail?.map((item, idx) => {
              return (
                <div className={styles.planBox} key={idx}>
                  <div className="plan-header">
                    <strong>Sr. No. {idx + 1}</strong>
                    <button
                      type="button"
                      className="remove-plan"
                      aria-label="Remove Plan"
                    >
                      <i data-lucide="x"></i>
                    </button>
                  </div>

                  <div className={`${styles.formGrid} ${styles.formGrid3} `}>
                    {/* Provider */}
                    <div className="form-group">
                      <label>Provider Id</label>
                      <select
                        className="form-control"
                        id="provider_id"
                        name="provider_id"
                        value={item.provider_id ?? ""}
                        onChange={(e) =>
                          handleFormChange(e, "our_service_plan_detail", idx)
                        }
                      >
                        <option value="">Select Provider</option>
                        {apiDropdownData?.data?.options?.providers?.map(
                          (item, idx) => {
                            return (
                              <option value={item?.id}>{item?.name}</option>
                            );
                          },
                        )}
                      </select>
                    </div>

                    {/* Plan */}
                    <div className="form-group">
                      <label>Plan</label>
                      <select
                        className="form-control"
                        id={`ServiceID-${idx}`}
                        name="plan_id"
                        value={item.plan_id ?? ""}
                        onChange={(e) =>
                          handleFormChange(e, "our_service_plan_detail", idx)
                        }
                      >
                        <option value="">Select Service</option>
                        {Object.values(
                          apiDropdownData?.data?.options?.plans || {},
                        )
                          .flat()
                          .map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Quote Period */}
                    <div className="form-group">
                      <label>Quote Period</label>
                      <select
                        className="form-control"
                        id={`QuotType-${idx}`}
                        name="quote_period"
                        value={item.quote_period}
                        onChange={(e) =>
                          handleFormChange(e, "our_service_plan_detail", idx)
                        }
                      >
                        <option value="">Select Period</option>
                        <option value="1">Monthly</option>
                        <option value="2">Yearly</option>
                        <option value="3">3 Yearly</option>
                      </select>
                    </div>

                    {/* SKU */}
                    <div className="form-group">
                      <label>SKU</label>
                      <input
                        type="text"
                        name="sku"
                        value={item.sku}
                        onChange={(e) =>
                          handleFormChange(e, "our_service_plan_detail", idx)
                        }
                      />
                    </div>

                    {/* Quantity */}
                    <div className="form-group">
                      <label>Quantity</label>
                      <input
                        type="number"
                        name="quantity"
                        value={item.quantity ?? ""}
                        onChange={(e) =>
                          handleFormChange(e, "our_service_plan_detail", idx)
                        }
                      />
                    </div>

                    {/* Rate */}
                    <div className="form-group">
                      <label>Rate</label>
                      <input
                        type="text"
                        name="rate"
                        value={item.rate}
                        onChange={(e) =>
                          handleFormChange(e, "our_service_plan_detail", idx)
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* ADDITIONAL CONTACT */}
            <div className="section-heading additional-contact-heading">
              <h3>Additional Contact</h3>
              <button
                type="button"
                className={styles.addPlanBtn}
                onClick={() => handleMultiple("contact")}
              >
                + Add Contact
              </button>
            </div>

            <div>
              {formData?.additional_contact?.map((item, idx) => {
                return (
                  <div className={styles.addContactWrapper} key={idx}>
                    <div className="form-group" style={{ color: "#0355ac" }}>
                      <h4>Contact Person {idx + 1}</h4>
                    </div>
                    <div
                      className={`${styles.formGrid} additional-contact-grid`}
                    >
                      {/* Name */}
                      <div className="form-group">
                        <label>Name</label>
                        <input
                          type="text"
                          name="name"
                          value={item.name}
                          onChange={(e) =>
                            handleFormChange(e, "additional_contact", idx)
                          }
                        />
                      </div>

                      {/* Designation */}
                      <div className="form-group">
                        <label>Designation</label>
                        <input
                          type="text"
                          name="designation"
                          value={item.designation}
                          onChange={(e) =>
                            handleFormChange(e, "additional_contact", idx)
                          }
                        />
                      </div>

                      {/* Email */}
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          name="email"
                          value={item.email}
                          onChange={(e) =>
                            handleFormChange(e, "additional_contact", idx)
                          }
                        />
                      </div>

                      {/* Mobile */}
                      <div className="form-group">
                        <label>Mobile No.</label>
                        <input
                          type="tel"
                          name="mobile"
                          value={item.mobile}
                          onChange={(e) =>
                            handleFormChange(e, "additional_contact", idx)
                          }
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.formRight}>
            {/* FOLLOW UP DETAIL */}
            <div className={`${styles.sideCard} followup-card`}>
              <h3>Follow Up Detail</h3>

              {/* Follow Up Date */}
              <div className="form-group">
                <label>Follow Up Date</label>
                <div className="date-input">
                  <input
                    type="date"
                    name="follow_up_date"
                    value={formData.follow_up_detail.follow_up_date}
                    onChange={(e) => handleFormChange(e, "follow_up_detail")}
                  />
                </div>
              </div>

              {/* Add Note */}
              <div className="form-group">
                <label>Add Note</label>
                <textarea
                  rows={4}
                  name="follow_up_note"
                  value={formData.follow_up_detail.follow_up_note}
                  onChange={(e) => handleFormChange(e, "follow_up_detail")}
                ></textarea>
              </div>
            </div>

            {/* LEAD SPECIFICATION */}
            <div className={styles.leadSpecification}>
              <h3>Lead Specification</h3>

              {/* Lead Category */}
              <div className={`${styles.formGroup} form-group`}>
                <label>Lead Category</label>
                <div className={styles.selectWrap}>
                  <select
                    name="lead_priority"
                    value={formData.lead_specification.lead_priority}
                    onChange={(e) => handleFormChange(e, "lead_specification")}
                  >
                    <option value="">Select Priority</option>
                    {apiDropdownData?.data?.options?.lead_priority?.map(
                      (item, idx) => {
                        return <option value={item}>{item}</option>;
                      },
                    )}
                  </select>
                </div>
              </div>

              {/* lead bifurcation */}
              <div className={`${styles.formGroup} form-group`}>
                <label>Lead Bifurcation</label>
                <div className={styles.selectWrap}>
                  <select
                    name="lead_bifurcation"
                    value={
                      formData?.lead_specification?.asslead_bifurcationigned_to
                    }
                    onChange={(e) => handleFormChange(e, "lead_specification")}
                  >
                    <option value="">Select Bifurcation</option>
                    {apiDropdownData?.data?.options?.lead_bifurcation?.map(
                      (item, idx) => {
                        return <option value={item}>{item}</option>;
                      },
                    )}
                  </select>
                </div>
              </div>

              {/* Lead Status */}
              <div className={`${styles.formGroup} form-group`}>
                <label>Lead Status</label>
                <div className={styles.selectWrap}>
                  <select
                    name="lead_status"
                    value={formData.lead_specification.lead_status}
                    onChange={(e) => handleFormChange(e, "lead_specification")}
                  >
                    <option value="">Select Status</option>
                    {apiDropdownData?.data?.options?.lead_status?.map(
                      (item, idx) => {
                        return <option value={item}>{item}</option>;
                      },
                    )}
                  </select>
                </div>
              </div>

              {/* Lead Source */}
              <div className={`${styles.formGroup} form-group`}>
                <label>Lead Source</label>
                <div className={styles.selectWrap}>
                  <select
                    name="lead_source"
                    value={formData.lead_specification.lead_source}
                    onChange={(e) => handleFormChange(e, "lead_specification")}
                  >
                    <option value="">Select Source</option>
                    {apiDropdownData?.data?.options?.lead_source?.map(
                      (item, idx) => {
                        return <option value={item}>{item}</option>;
                      },
                    )}
                  </select>
                </div>
              </div>

              {/* Assigned To */}
              <div className={`${styles.formGroup} form-group`}>
                <label>Assigned To</label>
                <div className={styles.selectWrap}>
                  <select
                    name="assigned_to"
                    value={formData.lead_specification.assigned_to}
                    onChange={(e) => handleFormChange(e, "lead_specification")}
                  >
                    <option value="">Select Employee</option>
                    {apiDropdownData?.data?.options?.assignees?.map(
                      (item, idx) => {
                        return <option value={item}>{item}</option>;
                      },
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* ADD DOCUMENT */}
            <div className="document-section">
              <h3>Add Document</h3>

              <input
                ref={documentInputRef}
                type="file"
                multiple
                className={styles.hiddenFileInput}
                onChange={handleDocumentSelect}
              />
              <button
                type="button"
                className={styles.uploadBox}
                onClick={() => documentInputRef.current?.click()}
              >
                <div className={styles.uploadIcon}>
                  <LuFileDown size={24} />
                </div>
                <p>Click to Upload</p>
              </button>

              {formData?.documents?.length > 0 && (
                <div className={styles.uploadedStatus}>
                  <div className={styles.uploadTitle}>
                    <span>Attached Files</span>
                  </div>

                  {formData?.documents?.map((file, index) => (
                    <div
                      className={styles.fileItem}
                      key={`${file.name}-${index}`}
                    >
                      <span className={styles.fileName} title={file.name}>
                        {file.name}
                      </span>
                      <button
                        type="button"
                        aria-label={`Remove ${file.name}`}
                        onClick={() => handleDocumentRemove(index)}
                      >
                        <FaRegTrashAlt className={styles.uploaded} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <div className={styles.submitWrap}>
          <button
            type="submit"
            onClick={handleCreateLead}
            className={styles.submitBtn}
          >
            Save Lead
          </button>
        </div>
      </section>
    </section>
  );
};

export default Leads;
