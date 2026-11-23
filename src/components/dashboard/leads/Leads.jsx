import React, { useEffect, useRef, useState } from "react";
import styles from "@/components/dashboard/leads/Leads.module.css";
import { LuFileDown } from "react-icons/lu";
import { IoMdArrowBack } from "react-icons/io";
import { FaRegTrashAlt } from "react-icons/fa";
import {
  locationNames,
  normalizedLocation,
  useCheckGstMutation,
  useCheckLeadDomainQuery,
  useCreateLeadMutation,
  useGetCountryStateCityQuery,
  useGetDdDataQuery,
} from "@/redux/apis/leadsApi";
import { useToast } from "@/custom-hooks/toast/ToastProvider";
import { useRouter } from "next/router";

const ALLOWED_DOCUMENT_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
  "jpg",
  "jpeg",
  "png",
];
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

const GST_CUSTOMER_FIELDS = ["company_name"];
const GST_ADDRESS_FIELDS = [
  "mailing_address",
  "country",
  "state",
  "city",
  "pincode",
];

const pickFilledFields = (source, keys) =>
  keys.reduce((picked, key) => {
    const value = source?.[key];
    if (value == null || String(value).trim() === "") return picked;
    picked[key] = String(value).trim();
    return picked;
  }, {});

const withCurrentOption = (options = [], current) => {
  if (!current || options.includes(current)) return options;
  return [current, ...options];
};

const fieldErrorMessage = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean).join(" ");
  if (value == null || value === "") return "";
  return String(value);
};

const mapApiFieldErrors = (errors) => {
  if (!errors || typeof errors !== "object") return {};

  return Object.entries(errors).reduce((mapped, [key, value]) => {
    const message = fieldErrorMessage(value);
    if (!message) return mapped;

    mapped[key.split(".").pop()] = message;
    return mapped;
  }, {});
};

const Leads = () => {
  const { showToast } = useToast();
  const router = useRouter();
  const documentInputRef = useRef(null);
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

  const [error, setError] = useState(null);
  const validateForm = () => {
    const newError = {};

    if (!formData?.customer_detail?.salutation) {
      newError.salutation = "Please select title";
    }
    if (!formData?.customer_detail?.name) {
      newError.name = "Please enter name";
    }
    if (!formData?.customer_detail?.email) {
      newError.email = "Please enter email";
    }
    if (!formData?.lead_specification?.lead_status) {
      newError.lead_status = "Please select lead status";
    }
    if (!formData?.customer_detail?.mobile) {
      newError.mobile = "Please enter mobile";
    }
    const gstin = formData?.customer_detail?.gstin?.trim();
    if (gstin && !GSTIN_REGEX.test(gstin)) {
      newError.gstin =
        "Invalid GSTIN (must be 15 characters, e.g. 27ABCDE1234F1Z5)";
    }
    setError(newError);
    if (Object.keys(newError).length > 0) {
      showToast("Please fill all required fields in the form.", "error");
    }
    return Object.keys(newError).length === 0;
  };

  const [createLead, { isLoading: isCreatingLead }] = useCreateLeadMutation();
  const { data: apiDropdownData } = useGetDdDataQuery();
  const { data: domainAvailable, isLoading: isCheckingDomain } =
    useCheckLeadDomainQuery(
      {
        domain: formData?.domain?.domain,
      },
      { skip: !formData?.domain?.domain },
    );
  const [checkGst, { isLoading: isCheckingGst }] = useCheckGstMutation();
  const selectedCountry = formData.address_information.country;
  const selectedState = formData.address_information.state;
  const selectedCity = formData.address_information.city;
  const { data: countriesData } = useGetCountryStateCityQuery();
  const { data: statesData } = useGetCountryStateCityQuery(
    { country: selectedCountry },
    { skip: !selectedCountry },
  );
  const { data: citiesData } = useGetCountryStateCityQuery(
    { country: selectedCountry, state: selectedState },
    { skip: !selectedCountry || !selectedState },
  );
  const { data: locationCheck } = useGetCountryStateCityQuery(
    {
      country: selectedCountry,
      state: selectedState,
      city: selectedCity,
    },
    { skip: !selectedCountry || !selectedState || !selectedCity },
  );
  const countryOptions = locationNames(countriesData, "countries");
  const stateOptions = locationNames(statesData, "states");
  const cityOptions = locationNames(citiesData, "cities");

  useEffect(() => {
    if (!selectedCountry || !selectedState || !selectedCity || !locationCheck) {
      return;
    }

    const normalized = normalizedLocation(locationCheck);
    if (!normalized.valid) {
      setError((prev) => ({
        ...prev,
        city: normalized.message || "Select a valid country, state, and city.",
      }));
      return;
    }

    if (!normalized.country && !normalized.state && !normalized.city) return;

    setError((prev) => {
      if (!prev?.city) return prev;
      const nextError = { ...prev };
      delete nextError.city;
      return nextError;
    });

    setFormData((prev) => {
      const address = prev.address_information;
      if (
        address.country !== selectedCountry ||
        address.state !== selectedState ||
        address.city !== selectedCity
      ) {
        return prev;
      }

      const country = normalized.country || address.country;
      const state = normalized.state || address.state;
      const city = normalized.city || address.city;
      if (
        country === address.country &&
        state === address.state &&
        city === address.city
      ) {
        return prev;
      }

      return {
        ...prev,
        address_information: {
          ...address,
          country,
          state,
          city,
        },
      };
    });
  }, [locationCheck, selectedCountry, selectedState, selectedCity]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setError((prev) => {
      if (!prev?.[name]) return prev;
      const nextError = { ...prev };
      delete nextError[name];
      return nextError;
    });

    setFormData((prev) => {
      const address = {
        ...prev.address_information,
        [name]: value,
      };

      if (name === "country") {
        address.state = "";
        address.city = "";
      }
      if (name === "state") {
        address.city = "";
      }

      return {
        ...prev,
        address_information: address,
      };
    });
  };
  const handleFormChange = (e, section, index = null) => {
    const { name } = e.target;
    const value =
      e.target.type === "number"
        ? e.target.value === ""
          ? null
          : Number(e.target.value)
        : e.target.value;
    const serviceSections = ["current_service_info", "our_service_plan_detail"];
    const plansByProvider = apiDropdownData?.data?.options?.plans || {};
    const selectedPlan =
      name === "plan_id"
        ? Object.values(plansByProvider)
            .flat()
            .find((plan) => String(plan.id) === String(value))
        : null;

    setError((prev) => {
      if (!prev?.[name]) return prev;

      const nextError = { ...prev };
      delete nextError[name];
      return nextError;
    });

    setFormData((prev) => {
      // Handle array sections
      if (Array.isArray(prev[section])) {
        return {
          ...prev,
          [section]: prev[section].map((item, i) =>
            i === index
              ? {
                  ...item,
                  [name]: value,
                  ...(serviceSections.includes(section) &&
                  name === "provider_id"
                    ? { plan_id: "", sku: "", rate: "" }
                    : {}),
                  ...(serviceSections.includes(section) && name === "plan_id"
                    ? {
                        sku: selectedPlan?.sku || selectedPlan?.slug || "",
                        rate:
                          selectedPlan?.rate ??
                          selectedPlan?.actual_price ??
                          item.rate,
                      }
                    : {}),
                }
              : item,
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

  const [gstStatus, setGstStatus] = useState(null); // { type: "success" | "error", message }

  const handleGstCheck = async (value) => {
    const gstin = (value ?? formData?.customer_detail?.gstin ?? "")
      .trim()
      .toUpperCase();
    setGstStatus(null);
    if (!gstin) return;

    // Same 15-char pattern validation as web, before hitting the API
    if (!GSTIN_REGEX.test(gstin)) {
      setError((prev) => ({
        ...prev,
        gstin: "Invalid GSTIN (must be 15 characters, e.g. 27ABCDE1234F1Z5)",
      }));
      return;
    }

    try {
      // POST /api/crm/quotations/gstin  { gstin }
      const res = await checkGst({ body: { gstin } });
      const errorBody = res?.error?.data;

      if (res?.error || errorBody?.errors || res?.data?.success === false) {
        const body = errorBody || res?.data || {};
        const fieldErrors = mapApiFieldErrors(body.errors);
        setError((prev) => ({
          ...prev,
          gstin:
            fieldErrors.gstin || body.message || "GSTIN validation failed.",
        }));
        return;
      }

      const gst = res?.data?.data;
      if (!gst || gst.valid === false) {
        setError((prev) => ({
          ...prev,
          gstin: res?.data?.message || "GSTIN is not valid.",
        }));
        return;
      }

      const customerPatch = pickFilledFields(gst, GST_CUSTOMER_FIELDS);
      const addressPatch = pickFilledFields(gst, GST_ADDRESS_FIELDS);
      if (!addressPatch.mailing_address && gst.company_address) {
        addressPatch.mailing_address = String(gst.company_address).trim();
      }

      setFormData((prev) => ({
        ...prev,
        customer_detail: {
          ...prev.customer_detail,
          ...customerPatch,
        },
        address_information: {
          ...prev.address_information,
          ...addressPatch,
        },
      }));

      setError((prev) => {
        if (!prev?.gstin) return prev;
        const nextError = { ...prev };
        delete nextError.gstin;
        return nextError;
      });

      setGstStatus({
        type: "success",
        message: gst.gst_status
          ? `GSTIN is valid (${gst.gst_status})`
          : res?.data?.message || "GSTIN is valid",
      });
    } catch (err) {
      console.log(err);
      setGstStatus({ type: "error", message: "Unable to verify GSTIN." });
    }
  };

  const handleDocumentSelect = (event) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (selectedFiles.length === 0) return;

    const accepted = [];
    let rejectedMessage = "";

    selectedFiles.forEach((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase();
      const typeAllowed = ALLOWED_DOCUMENT_EXTENSIONS.includes(extension);

      if (!typeAllowed) {
        rejectedMessage = `${file.name} is not allowed. Use PDF, Word, JPG, or PNG.`;
        return;
      }

      if (file.size > MAX_DOCUMENT_SIZE) {
        rejectedMessage = `${file.name} is larger than 10 MB.`;
        return;
      }

      accepted.push(file);
    });

    if (rejectedMessage) {
      showToast(rejectedMessage, "error");
    }

    if (accepted.length === 0) return;

    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...accepted],
    }));
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
    if (!validateForm()) return;
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
      const errorBody = res?.error?.data;

      if (res?.error || errorBody?.errors || res?.data?.success === false) {
        const body = errorBody || res?.data || {};
        const fieldErrors = mapApiFieldErrors(body.errors);

        if (Object.keys(fieldErrors).length) {
          setError(fieldErrors);
          const firstField = Object.keys(fieldErrors)[0];
          document
            .querySelector(`[name="${firstField}"]`)
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        showToast(body.message || "Unable to create lead.", "error");
        return;
      }

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

  useEffect(() => {
    if (!formData.domain.domain?.trim() || !domainAvailable?.data) return;

    const { available, registered } = domainAvailable.data;

    let domainType = formData.domain.domain_type;

    if (registered && !available) {
      domainType = "existing";
    } else if (available && !registered) {
      domainType = "new";
    }

    if (domainType !== formData.domain.domain_type) {
      setFormData((prev) => ({
        ...prev,
        domain: {
          ...prev.domain,
          domain_type: domainType,
        },
      }));
    }
  }, [
    domainAvailable?.data,
    formData.domain.domain,
    formData.domain.domain_type,
  ]);

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
                <label>
                  Name <span>*</span>
                </label>
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
                {error?.salutation && (
                  <span className={styles.errorMessage}>
                    {error.salutation}
                  </span>
                )}
                {error?.name && (
                  <span className={styles.errorMessage}>{error.name}</span>
                )}
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
                <label>
                  Email <span>*</span>
                </label>
                <input
                  type="email"
                  value={formData?.customer_detail?.email}
                  name="email"
                  onChange={(e) => handleFormChange(e, "customer_detail")}
                />
                {error?.email && (
                  <span className={styles.errorMessage}>{error.email}</span>
                )}
              </div>

              {/* Mobile */}
              <div className="form-group">
                <label>
                  Mobile No. <span>*</span>
                </label>
                <div className="phone-group">
                  <select
                    value="91"
                    name="mobile_code"
                    aria-label="Country code"
                    disabled
                  >
                    <option value="91">91</option>
                  </select>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={formData?.customer_detail?.mobile}
                    name="mobile"
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/\D/g, "");
                      handleFormChange(e, "customer_detail");
                    }}
                    maxLength={10}
                  />
                </div>
                {error?.mobile && (
                  <span className={styles.errorMessage}>{error.mobile}</span>
                )}
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
                  maxLength={15}
                  placeholder="27ABCDE1234F1Z5"
                  onChange={(e) => {
                    e.target.value = e.target.value
                      .toUpperCase()
                      .replace(/[^0-9A-Z]/g, "");
                    setGstStatus(null);
                    handleFormChange(e, "customer_detail");
                    // Call the API only once all 15 characters are typed
                    if (e.target.value.length === 15) {
                      handleGstCheck(e.target.value);
                    }
                  }}
                />
                {isCheckingGst && <small>Verifying GSTIN...</small>}
                {!isCheckingGst && gstStatus?.type === "success" && (
                  <small>{gstStatus.message}</small>
                )}
                {error?.gstin && (
                  <span className={styles.errorMessage}>{error.gstin}</span>
                )}
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
                  onChange={handleAddressChange}
                >
                  <option value="">Select Country</option>
                  {withCurrentOption(
                    countryOptions,
                    formData.address_information.country,
                  ).map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              {/* State */}
              <div className="form-group">
                <label>State</label>
                <select
                  name="state"
                  value={formData.address_information.state}
                  onChange={handleAddressChange}
                  disabled={!formData.address_information.country}
                >
                  <option value="">Select State</option>
                  {withCurrentOption(
                    stateOptions,
                    formData.address_information.state,
                  ).map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div className="form-group">
                <label>City</label>
                <select
                  name="city"
                  value={formData.address_information.city}
                  onChange={handleAddressChange}
                  disabled={!formData.address_information.state}
                >
                  <option value="">Select City</option>
                  {withCurrentOption(
                    cityOptions,
                    formData.address_information.city,
                  ).map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {error?.city && (
                  <span className={styles.errorMessage}>{error.city}</span>
                )}
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
                              {(
                                apiDropdownData?.data?.options?.plans?.[
                                  item.provider_id
                                ] ||
                                apiDropdownData?.data?.options?.plans?.[
                                  String(item.provider_id)
                                ] ||
                                []
                              ).map((plan) => (
                                <option key={plan.id} value={plan.id}>
                                  {plan.name}
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
                              name="renewal_date"
                              value={item.renewal_date}
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

              <div className={styles.domainSelectionGrid}>
                {/* Domain option */}
                <div className={styles.domainField}>
                  <label>Domain option</label>
                  <div className={styles.domainSelectWrap}>
                    <select
                      name="domain_type"
                      value={formData.domain.domain_type}
                      disabled={
                        !!formData.domain.domain?.trim() &&
                        !isCheckingDomain &&
                        !!domainAvailable?.data &&
                        domainAvailable.data.registered &&
                        !domainAvailable.data.available
                      }
                      style={{
                        cursor:
                          !!formData.domain.domain?.trim() &&
                          !isCheckingDomain &&
                          !!domainAvailable?.data &&
                          domainAvailable.data.registered &&
                          !domainAvailable.data.available
                            ? "not-allowed"
                            : "pointer",
                      }}
                      onChange={(e) => handleFormChange(e, "domain")}
                    >
                      <option value="no-domain">No domain</option>
                      <option value="existing">Already have domain</option>
                      <option value="new">Need new domain</option>
                    </select>
                  </div>
                </div>

                {/* Always visible so the domain can be checked */}

                {/* Existing domain fields */}
                {formData.domain.domain_type === "existing" && (
                  <>
                    <div className={styles.domainField}>
                      <label>Domain Name</label>
                      <input
                        type="text"
                        name="domain"
                        placeholder="example.com"
                        value={formData.domain.domain}
                        onChange={(e) => handleFormChange(e, "domain")}
                      />

                      {isCheckingDomain && <small>Checking domain...</small>}

                      {!isCheckingDomain && domainAvailable?.data && (
                        <small>
                          {domainAvailable.data.registered &&
                          !domainAvailable.data.available
                            ? "Domain already registered"
                            : domainAvailable.data.available &&
                                !domainAvailable.data.registered
                              ? "Domain available"
                              : ""}
                        </small>
                      )}
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
                  </>
                )}

                {/* New domain fields */}
                {formData.domain.domain_type === "new" && (
                  <>
                    <div className={styles.domainField}>
                      <label>Domain Name</label>
                      <input
                        type="text"
                        name="domain"
                        placeholder="example.com"
                        value={formData.domain.domain}
                        onChange={(e) => handleFormChange(e, "domain")}
                      />

                      {isCheckingDomain && <small>Checking domain...</small>}

                      {!isCheckingDomain && domainAvailable?.data && (
                        <small>
                          {domainAvailable.data.registered &&
                          !domainAvailable.data.available
                            ? "Domain already registered"
                            : domainAvailable.data.available &&
                                !domainAvailable.data.registered
                              ? "Domain available"
                              : ""}
                        </small>
                      )}
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
                            (item) => (
                              <option key={item} value={item}>
                                {item}
                              </option>
                            ),
                          )}
                        </select>
                      </div>
                    </div>

                    <div className={styles.domainField}>
                      <label>Rate</label>
                      <input
                        type="number"
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
                  </>
                )}
              </div>
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
                        {(
                          apiDropdownData?.data?.options?.plans?.[
                            item.provider_id
                          ] ||
                          apiDropdownData?.data?.options?.plans?.[
                            String(item.provider_id)
                          ] ||
                          []
                        ).map((plan) => (
                          <option key={plan.id} value={plan.id}>
                            {plan.name}
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
                          maxLength={10}
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
                <label>Follow Up Date &amp; Time</label>
                <div className="date-input">
                  <input
                    type="datetime-local"
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
                    value={formData.lead_specification.lead_bifurcation}
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
                <label>
                  Lead Status <span>*</span>
                </label>
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
                {error?.lead_status && (
                  <span className={styles.errorMessage}>
                    {error.lead_status}
                  </span>
                )}
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
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png"
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
                <span className={styles.uploadFormats}>
                  PDF, Word, JPG, and PNG. Max size 10 MB.
                </span>
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
