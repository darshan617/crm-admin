"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "@/components/quotation/add-quotation-form/AddQuotationForm.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const CSRF_TOKEN = "";

const providers = [
  { id: 3, name: "Google Workspace" },
  { id: 2, name: "Microsoft 365" },
  { id: 1, name: "Tizzy Mail" },
];

const providerPlans = {
  3: [
    {
      id: 21,
      name: "Google Workspace Business Plus",
      sku: "business-plus",
      slug: "business-plus",
      actual_price: 20400,
      rate: 20400,
    },
    {
      id: 20,
      name: "Google Workspace Business Standard",
      sku: "business-standard",
      slug: "business-standard",
      actual_price: 12960,
      rate: 12960,
    },
    {
      id: 15,
      name: "Google Workspace Business Starter",
      sku: "business-starter",
      slug: "business-starter",
      actual_price: 3240,
      rate: 3240,
    },
    {
      id: 22,
      name: "Google Workspace Enterprise",
      sku: "enterprise",
      slug: "enterprise",
      actual_price: 21000,
      rate: 21000,
    },
  ],
  2: [
    {
      id: 18,
      name: "Microsoft 365 Apps for business",
      sku: "microsoft-365-apps-for-business",
      slug: "microsoft-365-apps-for-business",
      actual_price: 9960,
      rate: 9960,
    },
    {
      id: 6,
      name: "Microsoft 365 Business Basic",
      sku: "microsoft-365-business-basic",
      slug: "microsoft-365-business-basic",
      actual_price: 2040,
      rate: 2040,
    },
    {
      id: 19,
      name: "Microsoft 365 Business Basic (No Teams) and Microsoft 365 Copilot Business",
      sku: "microsoft-365-business-basic-no-teams-and-microsoft-365-copilot-business",
      slug: "microsoft-365-business-basic-no-teams-and-microsoft-365-copilot-business",
      actual_price: 1560,
      rate: 1560,
    },
    {
      id: 17,
      name: "Microsoft 365 Business Basic (no Teams)",
      sku: "microsoft-365-business-basic-no-teams",
      slug: "microsoft-365-business-basic-no-teams",
      actual_price: 1560,
      rate: 1560,
    },
    {
      id: 12,
      name: "Microsoft 365 Business Basic and Microsoft 365 Copilot Business",
      sku: "microsoft-365-business-basic-and-microsoft-365-copilot-business",
      slug: "microsoft-365-business-basic-and-microsoft-365-copilot-business",
      actual_price: 1955,
      rate: 1955,
    },
    {
      id: 1,
      name: "Microsoft 365 Business Premium",
      sku: "microsoft-365-business-premium",
      slug: "microsoft-365-business-premium",
      actual_price: 21960,
      rate: 21960,
    },
    {
      id: 7,
      name: "Microsoft 365 Business Premium (no Teams)",
      sku: "microsoft-365-business-premium-no-teams",
      slug: "microsoft-365-business-premium-no-teams",
      actual_price: 18780,
      rate: 18780,
    },
    {
      id: 10,
      name: "Microsoft 365 Business Premium and Microsoft 365 Copilot Business",
      sku: "microsoft-365-business-premium-and-microsoft-365-copilot-business",
      slug: "microsoft-365-business-premium-and-microsoft-365-copilot-business",
      actual_price: 31920,
      rate: 31920,
    },
    {
      id: 13,
      name: "Microsoft 365 Business Premium with Copilot (no Teams)",
      sku: "microsoft-365-business-premium-no-teams-and-microsoft-365-copilot-business",
      slug: "microsoft-365-business-premium-no-teams-and-microsoft-365-copilot-business",
      actual_price: 28740,
      rate: 28740,
    },
    {
      id: 5,
      name: "Microsoft 365 Business Standard",
      sku: "microsoft-365-business-standard",
      slug: "microsoft-365-business-standard",
      actual_price: 10320,
      rate: 10320,
    },
    {
      id: 8,
      name: "Microsoft 365 Business Standard (no Teams)",
      sku: "microsoft-365-business-standard-no-teams",
      slug: "microsoft-365-business-standard-no-teams",
      actual_price: 7980,
      rate: 7980,
    },
    {
      id: 11,
      name: "Microsoft 365 Business Standard and Microsoft 365 Copilot Business",
      sku: "microsoft-365-business-standard-and-microsoft-365-copilot-business",
      slug: "microsoft-365-business-standard-and-microsoft-365-copilot-business",
      actual_price: 23460,
      rate: 23460,
    },
    {
      id: 14,
      name: "Microsoft 365 Business Standard with Copilot (no Teams)",
      sku: "microsoft-365-business-standard-no-teams-and-microsoft-365-copilot-business",
      slug: "microsoft-365-business-standard-no-teams-and-microsoft-365-copilot-business",
      actual_price: 20280,
      rate: 20280,
    },
  ],
  1: [
    {
      id: 2,
      name: "Tizzy® Mail 10 GB",
      sku: "tizzy-mail-10-gb",
      slug: "tizzy-mail-10-gb",
      actual_price: 792,
      rate: 792,
    },
    {
      id: 16,
      name: "Tizzy® Mail Corporate – 1 TB",
      sku: "tizzy-mail-corporate--1-tb",
      slug: "tizzy-mail-corporate--1-tb",
      actual_price: 8000,
      rate: 8000,
    },
    {
      id: 9,
      name: "Tizzy® Mail Enterprise – 100 GB",
      sku: "tizzy-mail-enterprise--100-gb",
      slug: "tizzy-mail-enterprise--100-gb",
      actual_price: 0,
      rate: 5000,
    },
    {
      id: 4,
      name: "Tizzy® Mail Platinum – 50 GB",
      sku: "tizzy-mail-platinum--50-gb",
      slug: "tizzy-mail-platinum--50-gb",
      actual_price: 2850,
      rate: 2850,
    },
    {
      id: 3,
      name: "Tizzy® Mail Silver – 30 GB",
      sku: "tizzy-mail-silver--30-gb",
      slug: "tizzy-mail-silver--30-gb",
      actual_price: 1716,
      rate: 1716,
    },
  ],
};

const salutations = ["Mr", "Mrs", "Ms"];

const dealTypes = [
  ["new", "New"],
  ["license_addon", "License Add-on"],
  ["renewal", "Renewal"],
  ["upgrade", "Upgrade"],
  ["downgrade", "Downgrade"],
  ["partial_upgrade", "Partial Upgrade"],
];

const billingCycles = [
  "Monthly",
  "Quarterly",
  "Half Yearly",
  "Yearly",
  "3 Yearly",
];

const countryCodes = [
  ["91", "India"],
  ["93", "Afghanistan"],
  ["355", "Albania"],
  ["213", "Algeria"],
  ["376", "Andorra"],
  ["244", "Angola"],
  ["54", "Argentina"],
  ["374", "Armenia"],
  ["61", "Australia"],
  ["43", "Austria"],
  ["994", "Azerbaijan"],
  ["973", "Bahrain"],
  ["880", "Bangladesh"],
  ["375", "Belarus"],
  ["32", "Belgium"],
  ["501", "Belize"],
  ["229", "Benin"],
  ["975", "Bhutan"],
  ["591", "Bolivia"],
  ["387", "Bosnia"],
  ["267", "Botswana"],
  ["55", "Brazil"],
  ["673", "Brunei"],
  ["359", "Bulgaria"],
  ["226", "Burkina Faso"],
  ["257", "Burundi"],
  ["855", "Cambodia"],
  ["237", "Cameroon"],
  ["1", "USA / Canada"],
  ["238", "Cape Verde"],
  ["236", "Central African Republic"],
  ["235", "Chad"],
  ["56", "Chile"],
  ["86", "China"],
  ["57", "Colombia"],
  ["269", "Comoros"],
  ["242", "Congo"],
  ["506", "Costa Rica"],
  ["385", "Croatia"],
  ["53", "Cuba"],
  ["357", "Cyprus"],
  ["420", "Czech Republic"],
  ["45", "Denmark"],
  ["253", "Djibouti"],
  ["593", "Ecuador"],
  ["20", "Egypt"],
  ["503", "El Salvador"],
  ["240", "Equatorial Guinea"],
  ["291", "Eritrea"],
  ["372", "Estonia"],
  ["251", "Ethiopia"],
  ["679", "Fiji"],
  ["358", "Finland"],
  ["33", "France"],
  ["241", "Gabon"],
  ["220", "Gambia"],
  ["995", "Georgia"],
  ["49", "Germany"],
  ["233", "Ghana"],
  ["30", "Greece"],
  ["502", "Guatemala"],
  ["224", "Guinea"],
  ["245", "Guinea-Bissau"],
  ["592", "Guyana"],
  ["509", "Haiti"],
  ["504", "Honduras"],
  ["852", "Hong Kong"],
  ["36", "Hungary"],
  ["354", "Iceland"],
  ["62", "Indonesia"],
  ["98", "Iran"],
  ["964", "Iraq"],
  ["353", "Ireland"],
  ["972", "Israel"],
  ["39", "Italy"],
  ["225", "Ivory Coast"],
  ["81", "Japan"],
  ["962", "Jordan"],
  ["7", "Kazakhstan / Russia"],
  ["254", "Kenya"],
  ["686", "Kiribati"],
  ["965", "Kuwait"],
  ["996", "Kyrgyzstan"],
  ["856", "Laos"],
  ["371", "Latvia"],
  ["961", "Lebanon"],
  ["266", "Lesotho"],
  ["231", "Liberia"],
  ["218", "Libya"],
  ["423", "Liechtenstein"],
  ["370", "Lithuania"],
  ["352", "Luxembourg"],
  ["853", "Macau"],
  ["389", "Macedonia"],
  ["261", "Madagascar"],
  ["265", "Malawi"],
  ["60", "Malaysia"],
  ["960", "Maldives"],
  ["223", "Mali"],
  ["356", "Malta"],
  ["222", "Mauritania"],
  ["230", "Mauritius"],
  ["52", "Mexico"],
  ["373", "Moldova"],
  ["377", "Monaco"],
  ["976", "Mongolia"],
  ["382", "Montenegro"],
  ["212", "Morocco"],
  ["258", "Mozambique"],
  ["95", "Myanmar"],
  ["264", "Namibia"],
  ["977", "Nepal"],
  ["31", "Netherlands"],
  ["64", "New Zealand"],
  ["505", "Nicaragua"],
  ["227", "Niger"],
  ["234", "Nigeria"],
  ["850", "North Korea"],
  ["47", "Norway"],
  ["968", "Oman"],
  ["92", "Pakistan"],
  ["970", "Palestine"],
  ["507", "Panama"],
  ["675", "Papua New Guinea"],
  ["595", "Paraguay"],
  ["51", "Peru"],
  ["63", "Philippines"],
  ["48", "Poland"],
  ["351", "Portugal"],
  ["974", "Qatar"],
  ["40", "Romania"],
  ["250", "Rwanda"],
  ["966", "Saudi Arabia"],
  ["221", "Senegal"],
  ["381", "Serbia"],
  ["248", "Seychelles"],
  ["232", "Sierra Leone"],
  ["65", "Singapore"],
  ["421", "Slovakia"],
  ["386", "Slovenia"],
  ["252", "Somalia"],
  ["27", "South Africa"],
  ["82", "South Korea"],
  ["211", "South Sudan"],
  ["34", "Spain"],
  ["94", "Sri Lanka"],
  ["249", "Sudan"],
  ["597", "Suriname"],
  ["268", "Swaziland"],
  ["46", "Sweden"],
  ["41", "Switzerland"],
  ["963", "Syria"],
  ["886", "Taiwan"],
  ["992", "Tajikistan"],
  ["255", "Tanzania"],
  ["66", "Thailand"],
  ["228", "Togo"],
  ["676", "Tonga"],
  ["216", "Tunisia"],
  ["90", "Turkey"],
  ["993", "Turkmenistan"],
  ["256", "Uganda"],
  ["380", "Ukraine"],
  ["971", "UAE"],
  ["44", "United Kingdom"],
  ["598", "Uruguay"],
  ["998", "Uzbekistan"],
  ["678", "Vanuatu"],
  ["58", "Venezuela"],
  ["84", "Vietnam"],
  ["967", "Yemen"],
  ["260", "Zambia"],
  ["263", "Zimbabwe"],
];

const cycleMonths = {
  Monthly: 1,
  Quarterly: 3,
  "Half Yearly": 6,
  Yearly: 12,
  "3 Yearly": 36,
};

const dealRules = {
  license_addon: {
    plans: "same",
    qty: "extra",
    period: false,
    planLabel: "Plan",
    qtyLabel: "Licences to Add",
    rateLabel: "Price per Licence / Year",
  },
  renewal: {
    plans: "same",
    qty: "any",
    period: true,
    planLabel: "Plan",
    qtyLabel: "Licences to Renew",
    rateLabel: "Rate",
  },
  upgrade: {
    plans: "higher",
    qty: "all",
    period: false,
    planLabel: "Upgrade To",
    qtyLabel: "Licences",
    rateLabel: "New Plan Price per Licence / Year",
  },
  partial_upgrade: {
    plans: "higher",
    qty: "part",
    period: false,
    planLabel: "Upgrade To",
    qtyLabel: "Licences to Upgrade",
    rateLabel: "New Plan Price per Licence / Year",
  },
  downgrade: {
    plans: "lower",
    qty: "all",
    period: true,
    planLabel: "Downgrade To",
    qtyLabel: "Licences",
    rateLabel: "Rate",
  },
};

const digitsOnly = (v) => String(v || "").replace(/\D+/g, "");

const ymd = (date) =>
  date.getFullYear() +
  "-" +
  String(date.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(date.getDate()).padStart(2, "0");

const money = (n) =>
  "₹ " +
  Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const planYearlyRate = (plan) =>
  plan ? parseFloat(plan.actual_price || plan.rate) || 0 : 0;

const leadLabel = (lead) =>
  [lead.company_name, lead.name].filter(Boolean).join(" — ") ||
  "Lead #" + lead.id;

const servicePlanName = (s) => {
  const plan = s.plan_name || "";
  return s.provider_name && plan.indexOf(s.provider_name) !== 0
    ? s.provider_name + " - " + plan
    : plan;
};

const prorate = (yearly, days) =>
  Math.round((days > 0 ? (yearly / 365) * days : yearly) * 100) / 100;

const uniqueOptions = (rows) => {
  const seen = {};
  return rows.filter((row) => {
    const key = String(row.value || "").toLowerCase();
    if (!key || seen[key]) return false;
    seen[key] = true;
    return true;
  });
};

const toLocalDate = (v) => (v ? ymd(new Date(v)) : "");

const blankRow = (currentServices) => ({
  current_service_id:
    currentServices.length === 1 ? String(currentServices[0].id) : "",
  provider_id: "",
  plan_id: "",
  quote_period: "Yearly",
  billing_start_date: "",
  sku: "",
  quantity: "1",
  rate: "",
});

function makeLogic(dealType, currentServices) {
  const rule = dealRules[dealType] || null;

  const currentService = (row) =>
    currentServices.find(
      (s) => String(s.id) === String(row.current_service_id || ""),
    ) || null;

  const currentPlanRate = (service) =>
    planYearlyRate(
      (providerPlans[service.provider_id] || []).find(
        (p) => String(p.id) === String(service.plan_id),
      ),
    );

  const planAllowed = (row, plan) => {
    const service = rule ? currentService(row) : null;
    if (!service) return true;
    if (rule.plans === "same")
      return String(plan.id) === String(service.plan_id);
    const from = currentPlanRate(service);
    return rule.plans === "higher"
      ? planYearlyRate(plan) > from
      : planYearlyRate(plan) < from;
  };

  const allowedPlans = (row, providerId) =>
    (providerPlans[providerId] || []).filter((p) => planAllowed(row, p));

  const daysLeft = (service, row) => {
    if (!service.renewal_date) return 0;
    const start = row.billing_start_date;
    const from = start
      ? new Date(start + "T00:00:00")
      : new Date(new Date().setHours(0, 0, 0, 0));
    return Math.max(
      0,
      Math.round(
        (new Date(service.renewal_date + "T00:00:00") - from) / 86400000,
      ),
    );
  };

  const planEndDate = (row) => {
    const service = rule ? currentService(row) : null;
    if (
      service &&
      service.renewal_date &&
      ["license_addon", "upgrade", "partial_upgrade"].includes(dealType)
    ) {
      return service.renewal_date;
    }
    const start = row.billing_start_date;
    if (!start) return "";
    const end = new Date(start + "T00:00:00");
    const day = end.getDate();
    end.setDate(1);
    end.setMonth(end.getMonth() + (cycleMonths[row.quote_period] || 12));
    end.setDate(
      Math.min(
        day,
        new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate(),
      ),
    );
    const providerName =
      (providers.find((p) => String(p.id) === String(row.provider_id)) || {})
        .name || "";
    if (!/google/i.test(providerName)) {
      end.setDate(end.getDate() - 1);
    }
    return ymd(end);
  };

  const calcRate = (row) => {
    const plan = (providerPlans[row.provider_id] || []).find(
      (p) => String(p.id) === String(row.plan_id),
    );
    if (!row.plan_id || !plan) return "";
    const actualPrice = parseFloat(plan.actual_price || plan.rate || 0) || 0;
    let calculatedRate = 0;
    switch (row.quote_period) {
      case "Monthly":
        calculatedRate = actualPrice / 12;
        break;
      case "Quarterly":
        calculatedRate = actualPrice / 4;
        break;
      case "Half Yearly":
        calculatedRate = actualPrice / 2;
        break;
      case "Yearly":
        calculatedRate = actualPrice;
        break;
      case "3 Yearly":
        calculatedRate = actualPrice * 3;
        break;
      default:
        calculatedRate = actualPrice;
    }
    return calculatedRate > 0 ? calculatedRate.toFixed(2) : "";
  };

  const onPlanChanged = (draft, i, errs) => {
    const row = draft[i];
    const plan = (providerPlans[row.provider_id] || []).find(
      (p) => String(p.id) === String(row.plan_id),
    );
    row.sku = plan ? plan.sku || plan.slug || "" : "";
    row.rate = calcRate(row);
    if (row.provider_id && row.plan_id) {
      const pair = row.provider_id + ":" + row.plan_id;
      let dup = false;
      draft.forEach((box, idx) => {
        if (idx === i) return;
        if (
          box.provider_id &&
          box.plan_id &&
          box.provider_id + ":" + box.plan_id === pair
        )
          dup = true;
      });
      if (dup) {
        errs["plans[" + i + "][plan_id]"] = "This plan is already added.";
        row.plan_id = "";
        row.sku = "";
        row.rate = "";
      }
    }
  };

  const loadPlans = (draft, i, providerId, selectedPlanId, errs) => {
    const row = draft[i];
    row.plan_id = "";
    row.sku = "";
    row.rate = "";
    if (!providerId || !providerPlans[providerId]) return;

    const opts = allowedPlans(row, providerId);
    if (selectedPlanId) {
      if (opts.some((p) => String(p.id) === String(selectedPlanId))) {
        row.plan_id = String(selectedPlanId);
      } else if (rule && opts.length > 0) {
        row.plan_id = String(opts[0].id);
      }
    } else if (opts.length > 0) {
      row.plan_id = String(opts[0].id);
    }
    if (row.plan_id) onPlanChanged(draft, i, errs);
  };

  const applyRowRule = (draft, i, reset) => {
    const row = draft[i];
    const service = rule ? currentService(row) : null;

    if (rule && !rule.period && row.quote_period !== "Yearly") {
      row.quote_period = "Yearly";
      row.rate = calcRate(row);
    }
    if (reset && service && rule.period && service.renewal_date) {
      const next = new Date(service.renewal_date + "T00:00:00");
      next.setDate(next.getDate() + 1);
      row.billing_start_date = ymd(next);
    } else if (reset && rule && !row.billing_start_date) {
      row.billing_start_date = ymd(new Date());
    }

    const askQty = !!rule && (rule.qty === "extra" || rule.qty === "part");
    if (service && (rule.qty === "all" || (reset && rule.qty === "any"))) {
      row.quantity = String(service.quantity);
    }
    if (reset) {
      if (askQty) row.quantity = "";
      if (!rule && !row.quantity) row.quantity = "1";
    }
    if (service && rule.qty === "part") {
      if ((parseInt(row.quantity, 10) || 0) >= service.quantity)
        row.quantity = "";
    }
  };

  const applyCurrentService = (draft, i, reset, errs) => {
    const row = draft[i];
    const service = rule ? currentService(row) : null;
    if (service) row.provider_id = String(service.provider_id || "");
    if (row.provider_id) {
      const keepPlan =
        service && rule.plans === "same" ? service.plan_id : row.plan_id;
      loadPlans(draft, i, row.provider_id, keepPlan, errs);
    }
    applyRowRule(draft, i, reset);
  };

  return {
    rule,
    currentService,
    currentPlanRate,
    allowedPlans,
    daysLeft,
    planEndDate,
    calcRate,
    onPlanChanged,
    loadPlans,
    applyRowRule,
    applyCurrentService,
  };
}

function QuotationFormInner({
  lead,
  leads,
  currentServices,
  action,
  csrfToken,
  checkDomainUrl,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const formRef = useRef(null);

  const [form, setForm] = useState({
    lead_id: lead ? String(lead.id) : "",
    company_name: (lead && lead.company_name) || "",
    gstin: (lead && lead.gstin) || "",
    salutation: (lead && lead.salutation) || "",
    name: (lead && lead.name) || "",
    email: (lead && lead.email) || "",
    mobile_code: (lead && lead.mobile_code) || "91",
    mobile: (lead && lead.mobile) || "",
    discount: "",
    deal_type: "new",
    domain_type: (lead && lead.domain_type) || "",
    domain_name: (lead && lead.domain) || "",
    sac: (lead && lead.sac) || "",
    domain_start: lead ? toLocalDate(lead.domain_start) : "",
    domain_end: lead ? toLocalDate(lead.domain_end) : "",
    domain_rate: (lead && lead.domain_rate) || "",
  });
  const [plans, setPlans] = useState([blankRow(currentServices)]);
  const [errors, setErrors] = useState({});
  const [openLookup, setOpenLookup] = useState(null); // 'lead' | 'email' | 'mobile' | null
  const [leadSearch, setLeadSearch] = useState("");
  const [domainStatus, setDomainStatus] = useState("");

  const L = makeLogic(form.deal_type, currentServices);
  const rule = L.rule;

  const clearError = (name) =>
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const n = { ...prev };
      delete n[name];
      return n;
    });

  const setField = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    clearError(name);
  };

  const commitPlans = (draft, errs, clearName) => {
    setPlans(draft);
    setErrors((prev) => {
      const n = { ...prev };
      if (clearName) delete n[clearName];
      return { ...n, ...errs };
    });
  };

  const cx = (base, name) => base + (errors[name] ? " is-invalid" : "");
  const Err = ({ name }) =>
    errors[name] ? (
      <div className="form-error js-field-error" data-for={name}>
        {errors[name]}
      </div>
    ) : null;

  const goToLead = (id) => {
    router.push(
      id ? pathname + "?lead_id=" + encodeURIComponent(id) : pathname,
    );
  };

  const applyMatchedLead = (match) => {
    if (!match || String(match.id) === String(form.lead_id || "")) return;
    goToLead(match.id);
  };

  const leadRows = useMemo(
    () =>
      leads.map((l) => ({
        value: leadLabel(l),
        meta: [l.email, l.mobile].filter(Boolean).join(" · "),
        leadId: l.id,
      })),
    [leads],
  );

  const emailRows = useMemo(() => {
    const rows = [];
    leads.forEach((l) => {
      if (l.email)
        rows.push({ value: l.email, meta: leadLabel(l), leadId: l.id });
      (l.contacts || []).forEach((c) => {
        if (c.email)
          rows.push({ value: c.email, meta: leadLabel(l), leadId: l.id });
      });
    });
    return uniqueOptions(rows);
  }, [leads]);

  const mobileRows = useMemo(() => {
    const rows = [];
    leads.forEach((l) => {
      if (l.mobile)
        rows.push({ value: l.mobile, meta: leadLabel(l), leadId: l.id });
      (l.contacts || []).forEach((c) => {
        if (c.mobile)
          rows.push({ value: c.mobile, meta: leadLabel(l), leadId: l.id });
      });
    });
    return uniqueOptions(rows);
  }, [leads]);

  const filterRows = (rows, query) => {
    const q = String(query || "")
      .trim()
      .toLowerCase();
    return rows.filter(
      (row) =>
        !q ||
        String(row.value).toLowerCase().indexOf(q) !== -1 ||
        String(row.meta || "")
          .toLowerCase()
          .indexOf(q) !== -1,
    );
  };

  useEffect(() => {
    const onDocClick = (e) => {
      if (!e.target.closest("#quotationForm .loc-select")) setOpenLookup(null);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const renderList = (kind, rows, id) => {
    const filtered = rows;
    return (
      <div
        className={styles.locSelectList}
        id={id}
        onMouseDown={(e) => {
          e.preventDefault();
          const item = e.target.closest("button");
          if (!item) return;
          setOpenLookup(null);
          const idx = Number(item.getAttribute("data-idx"));
          const row = filtered[idx];
          if (!row) return;
          if (kind === "lead") {
            goToLead(row.leadId);
            return;
          }
          setField(kind, row.value);
          applyMatchedLead({ id: row.leadId });
        }}
      >
        {filtered.length === 0 ? (
          <div className={styles.empty}>No matches</div>
        ) : (
          filtered.map((row, idx) => (
            <button
              type="button"
              key={idx}
              data-idx={idx}
              data-value={row.value}
              data-lead-id={row.leadId}
            >
              <span className={styles.optMain}>{row.value}</span>
              {row.meta ? (
                <span className={styles.optMeta}>{row.meta}</span>
              ) : null}
            </button>
          ))
        )}
      </div>
    );
  };

  const onLookupBlur = (kind, rows, value) => {
    const match = rows.find((row) => {
      if (kind === "mobile") return digitsOnly(row.value) === digitsOnly(value);
      return (
        String(row.value).toLowerCase() ===
        String(value || "")
          .trim()
          .toLowerCase()
      );
    });
    if (match) applyMatchedLead({ id: match.leadId });
  };

  const checkDomain = () => {
    setDomainStatus("Checking...");
    fetch(
      checkDomainUrl +
        "?domain=" +
        encodeURIComponent((form.domain_name || "").trim()),
    )
      .then((res) => res.json())
      .then((data) =>
        setDomainStatus(data.message || "Could not check domain."),
      )
      .catch(() => setDomainStatus("Could not check domain."));
  };

  const onDealTypeChange = (value) => {
    setField("deal_type", value);
    const next = makeLogic(value, currentServices);
    const draft = plans.map((r) => ({ ...r }));
    const errs = {};
    draft.forEach((_, i) => next.applyCurrentService(draft, i, true, errs));
    commitPlans(draft, errs);
  };

  const pname = (i, f) => "plans[" + i + "][" + f + "]";

  const onCurrentServiceChange = (i, value) => {
    const draft = plans.map((r) => ({ ...r }));
    const errs = {};
    draft[i].current_service_id = value;
    L.applyCurrentService(draft, i, true, errs);
    commitPlans(draft, errs, pname(i, "from_service_id"));
  };

  const onProviderChange = (i, value) => {
    const draft = plans.map((r) => ({ ...r }));
    const errs = {};
    draft[i].provider_id = value;
    L.loadPlans(draft, i, value, "", errs);
    const name =
      (providers.find((p) => String(p.id) === String(value)) || {}).name || "";
    let same = false;
    draft.forEach((r, idx) => {
      if (idx === i) return;
      if (r.provider_id && r.provider_id === value) same = true;
    });
    if (same && !/google/i.test(name)) {
      errs[pname(i, "provider_id")] = "Same provider can only be added once.";
      draft[i].provider_id = "";
      L.loadPlans(draft, i, "", "", errs);
    }
    commitPlans(draft, errs, pname(i, "provider_id"));
  };

  const onPlanChange = (i, value) => {
    const draft = plans.map((r) => ({ ...r }));
    const errs = {};
    draft[i].plan_id = value;
    L.onPlanChanged(draft, i, errs);
    commitPlans(draft, errs, pname(i, "plan_id"));
  };

  const onPeriodChange = (i, value) => {
    const draft = plans.map((r) => ({ ...r }));
    draft[i].quote_period = value;
    draft[i].rate = L.calcRate(draft[i]);
    commitPlans(draft, {}, pname(i, "quote_period"));
  };

  const onRowInput = (i, field, value) => {
    setPlans((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)),
    );
    clearError(
      pname(i, field === "billing_start_date" ? "billing_start_date" : field),
    );
  };

  const addPlan = (e) => {
    e.preventDefault();
    const draft = plans.map((r) => ({ ...r }));
    draft.push(blankRow(currentServices));
    const errs = {};
    L.applyCurrentService(draft, draft.length - 1, true, errs);
    commitPlans(draft, errs);
  };

  const removePlan = (i) => {
    setPlans((prev) => prev.filter((_, idx) => idx !== i));
  };

  const changeInfoRows = (row) => {
    const service = rule ? L.currentService(row) : null;
    if (!service) return null;
    const type = form.deal_type;
    const qty = parseInt(row.quantity, 10) || 0;
    const rate = parseFloat(row.rate) || 0;
    const days = L.daysLeft(service, row);
    const till = service.renewal_date
      ? service.renewal_date.split("-").reverse().join("-")
      : "";
    const plan = (providerPlans[row.provider_id] || []).find(
      (p) => String(p.id) === String(row.plan_id),
    );
    const newPlan = row.plan_id && plan ? plan.name : "-";
    const currentRate = L.currentPlanRate(service);
    const yearly =
      type === "license_addon" ? rate : Math.max(0, rate - currentRate);
    const unit = prorate(yearly, days);
    const perYear = " / licence / year";
    const prorated =
      days > 0 ? " (prorated " + days + " days)" : " (full year)";
    const rows = [
      [
        "Current Plan",
        servicePlanName(service) + " · " + service.quantity + " licences",
      ],
      ["Current Price", currentRate ? money(currentRate) + perYear : "-"],
      [
        "Renewal Date",
        till
          ? till + " (" + days + " days left)"
          : "Not set, full year charged",
      ],
    ];

    if (type === "license_addon") {
      rows.push(["Licences to Add", qty || "Enter licences above"]);
      rows.push(["Total After Add-on", service.quantity + qty + " licences"]);
      rows.push(["Price per Licence", money(unit) + prorated]);
      rows.push(["Amount", money(unit * qty)]);
    } else if (type === "upgrade" || type === "partial_upgrade") {
      rows.push(["Upgrade To", newPlan + " · " + money(rate) + perYear]);
      rows.push([
        "Licences",
        qty
          ? qty +
            " upgrading" +
            (type === "partial_upgrade"
              ? ", " + (service.quantity - qty) + " stay on current plan"
              : "")
          : "Enter licences above",
      ]);
      rows.push(["Price Difference", money(yearly) + perYear]);
      rows.push(["Price per Licence", money(unit) + prorated]);
      rows.push(["Amount", money(unit * qty)]);
    } else if (type === "renewal") {
      rows.push(["Renew", qty + " licences" + (till ? " from " + till : "")]);
      rows.push(["Amount", money(rate * qty)]);
    } else {
      rows.push([
        "Downgrade To",
        newPlan + (till ? ", from renewal " + till : ", from next renewal"),
      ]);
      rows.push(["Amount", money(rate * qty)]);
    }
    return rows;
  };

  const goToField = (name) => {
    const el =
      formRef.current &&
      (formRef.current.querySelector(
        '[name="' + name + '"]:not([type="hidden"])',
      ) ||
        formRef.current.querySelector('[name="' + name + '"]'));
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => el.focus(), 200);
  };

  const onSubmit = (e) => {
    const errs = {};
    let firstInvalid = null;
    const flag = (name, msg) => {
      errs[name] = msg;
      if (!firstInvalid) firstInvalid = name;
    };

    const checks = [
      ["company_name", "Company Name is required."],
      ["gstin", "GSTIN is required."],
      ["email", "Email is required."],
      ["discount", "Discount is required."],
    ];
    checks.forEach(([name, msg]) => {
      if (!String(form[name] || "").trim()) flag(name, msg);
    });

    if (
      String(form.email || "").trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(form.email).trim())
    ) {
      flag("email", "Enter a valid email.");
    }

    const planChecks = [
      ["provider_id", "Provider is required."],
      ["plan_id", "Plan is required."],
      ["quote_period", "Billing Cycle is required."],
      ["sku", "SKU is required."],
      ["quantity", "Quantity is required."],
      ["rate", "Rate is required."],
    ];
    plans.forEach((row, i) => {
      if (rule && !row.current_service_id)
        flag(pname(i, "from_service_id"), "Select the current plan.");
      planChecks.forEach(([field, msg]) => {
        if (!String(row[field] || "").trim()) flag(pname(i, field), msg);
      });
    });

    setErrors(errs);
    if (firstInvalid) {
      e.preventDefault();
      goToField(firstInvalid);
      return false;
    }
  };

  return (
    <form
      method="POST"
      action={action}
      id="quotationForm"
      noValidate
      ref={formRef}
      onSubmit={onSubmit}
    >
      <input
        type="hidden"
        name="_token"
        value={csrfToken}
        autoComplete="off"
        readOnly
      />
      <input type="hidden" name="lead_id" value={form.lead_id} readOnly />

      <section className="common-form">
        <h3>Quotation Detail</h3>

        <div className="form-grid">
          <div className="form-group">
            <label>Lead</label>
            <div
              className={
                `${styles.locSelect}` +
                (openLookup === "lead" ? styles.open : "")
              }
              data-lookup="lead"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className={`${styles.locSelectBtn} ${
                  lead ? "" : styles.isPlaceholder
                }`}
                id="leadSelectBtn"
                aria-expanded={openLookup === "lead"}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  setOpenLookup((prev) => {
                    if (prev === "lead") return null;
                    setLeadSearch("");
                    return "lead";
                  });
                }}
              >
                {lead ? leadLabel(lead) : "Select Lead"}
              </button>
              <div className={styles.locSelectPanel}>
                <input
                  type="text"
                  className={styles.locSelectSearch}
                  placeholder="Search lead"
                  autoComplete="off"
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                />
                {renderList(
                  "lead",
                  filterRows(leadRows, leadSearch),
                  "leadLookupList",
                )}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>
              Company Name <span>*</span>
            </label>
            <input
              type="text"
              name="company_name"
              className={cx("", "company_name").trim() || undefined}
              value={form.company_name}
              onChange={(e) => setField("company_name", e.target.value)}
              required
            />
            <Err name="company_name" />
          </div>

          <div className="form-group">
            <label>
              GSTIN <span>*</span>
            </label>
            <input
              type="text"
              name="gstin"
              className={cx("", "gstin").trim() || undefined}
              value={form.gstin}
              maxLength={15}
              onChange={(e) => setField("gstin", e.target.value)}
              required
            />
            <Err name="gstin" />
          </div>

          <div className="form-group">
            <label>
              Name <span>*</span>
            </label>
            <div className={`${styles.phoneGroup} phone-group name-title-row`}>
              <select
                name="salutation"
                className={cx(
                  "form-control phone-code-select title-select",
                  "salutation",
                )}
                value={form.salutation}
                onChange={(e) => setField("salutation", e.target.value)}
                required
              >
                <option value="">Title</option>
                {salutations.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="name"
                className={cx("", "name").trim() || undefined}
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                required
              />
            </div>
            <Err name="salutation" />
            <Err name="name" />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>
              Email <span>*</span>
            </label>
            <div
              className={
                `${styles.locSelect}` +
                (openLookup === "email" ? styles.open : "")
              }
              data-lookup="email"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="email"
                name="email"
                id="quotationEmail"
                className={cx("loc-select-input", "email")}
                value={form.email}
                required
                autoComplete="off"
                placeholder="Select or type email"
                onFocus={() => setOpenLookup("email")}
                onClick={() => setOpenLookup("email")}
                onChange={(e) => {
                  setField("email", e.target.value);
                  setOpenLookup("email");
                }}
                onBlur={(e) => onLookupBlur("email", emailRows, e.target.value)}
              />
              <div className={styles.locSelectPanel}>
                {renderList(
                  "email",
                  filterRows(emailRows, form.email),
                  "emailLookupList",
                )}
              </div>
            </div>
            <Err name="email" />
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
                className={
                  `${styles.locSelect}` +
                  (openLookup === "mobile" ? styles.open : "")
                }
                data-lookup="mobile"
                style={{ flex: 1, minWidth: 0 }}
                onClick={(e) => e.stopPropagation()}
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
                  placeholder="Select or type number"
                  onFocus={() => setOpenLookup("mobile")}
                  onClick={() => setOpenLookup("mobile")}
                  onChange={(e) => {
                    setField("mobile", e.target.value);
                    setOpenLookup("mobile");
                  }}
                  onBlur={(e) =>
                    onLookupBlur("mobile", mobileRows, e.target.value)
                  }
                />
                <div className={styles.locSelectPanel}>
                  {renderList(
                    "mobile",
                    filterRows(mobileRows, form.mobile),
                    "mobileLookupList",
                  )}
                </div>
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
              className={cx("", "discount").trim() || undefined}
              min="0"
              max="100"
              step="0.01"
              value={form.discount}
              onChange={(e) => setField("discount", e.target.value)}
              required
            />
            <Err name="discount" />
          </div>

          <div className="form-group">
            <label>
              Order Type <span>*</span>
            </label>
            <select
              name="deal_type"
              id="dealType"
              className="form-control"
              value={form.deal_type}
              onChange={(e) => onDealTypeChange(e.target.value)}
              required
            >
              {dealTypes.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Domain */}
        <div id="domainSection" style={{ display: rule ? "none" : "" }}>
          <h3 className="section-title">Domain Detail</h3>

          <div className="form-grid">
            <div className="form-group">
              <label>Domain option</label>
              <select
                name="domain_type"
                id="domainType"
                className="form-control"
                value={form.domain_type}
                onChange={(e) => setField("domain_type", e.target.value)}
              >
                <option value="">No domain</option>
                <option value="existing">Already have domain</option>
                <option value="new">Need new domain</option>
              </select>
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
            </div>

            <div
              className="form-group domain-new-wrap"
              style={{ display: form.domain_type === "new" ? "block" : "none" }}
            >
              <label>SAC</label>
              <input
                type="text"
                name="sac"
                value={form.sac}
                onChange={(e) => setField("sac", e.target.value)}
              />
            </div>

            <div
              className="form-group domain-new-wrap"
              style={{ display: form.domain_type === "new" ? "block" : "none" }}
            >
              <label>Domain Start</label>
              <div className="date-input">
                <input
                  type="date"
                  name="domain_start"
                  value={form.domain_start}
                  onChange={(e) => setField("domain_start", e.target.value)}
                />
              </div>
            </div>

            <div
              className="form-group domain-new-wrap"
              style={{ display: form.domain_type === "new" ? "block" : "none" }}
            >
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

            <div
              className="form-group domain-new-wrap"
              style={{ display: form.domain_type === "new" ? "block" : "none" }}
            >
              <label>Rate</label>
              <input
                type="text"
                name="domain_rate"
                value={form.domain_rate}
                onChange={(e) => setField("domain_rate", e.target.value)}
              />
            </div>

            <div
              className="form-group domain-new-wrap"
              style={{ display: form.domain_type === "new" ? "block" : "none" }}
            >
              <label>&nbsp;</label>
              <button
                type="button"
                className={styles.addPlanBtn}
                id="checkDomainBtn"
                onClick={checkDomain}
              >
                Check Availability
              </button>
              <div id="domainCheckStatus">{domainStatus}</div>
            </div>
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
          {plans.map((row, i) => {
            const service = rule ? L.currentService(row) : null;
            const opts = row.provider_id
              ? L.allowedPlans(row, row.provider_id)
              : [];
            const askQty =
              !!rule && (rule.qty === "extra" || rule.qty === "part");
            const end = L.planEndDate(row);
            const info = changeInfoRows(row);

            let emptyPlanText = "Select Plan";
            if (rule && service && row.provider_id && opts.length === 0) {
              emptyPlanText = {
                same: "Current plan not available",
                higher: "No higher plan available",
                lower: "No lower plan available",
              }[rule.plans];
            }

            return (
              <div className={styles.planBox} key={i}>
                <div className="plan-header">
                  <strong className="plan-number">Sr. No. {i + 1}</strong>

                  <button
                    type="button"
                    className="remove-plan"
                    aria-label="Remove Plan"
                    style={{ display: plans.length > 1 ? "flex" : "none" }}
                    onClick={() => removePlan(i)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="lucide lucide-x"
                    >
                      <path d="M18 6 6 18"></path>
                      <path d="m6 6 12 12"></path>
                    </svg>
                  </button>
                </div>

                <div className="form-grid form-grid-3">
                  <div
                    className="form-group addon-only"
                    style={{ display: rule ? "" : "none" }}
                  >
                    <label>
                      Current Plan <span>*</span>
                    </label>
                    <select
                      className={cx(
                        "form-control current-service-select",
                        pname(i, "from_service_id"),
                      )}
                      name={pname(i, "from_service_id")}
                      value={row.current_service_id}
                      onChange={(e) =>
                        onCurrentServiceChange(i, e.target.value)
                      }
                    >
                      <option value="">
                        {currentServices.length
                          ? "Select Current Plan"
                          : "No current service on this lead"}
                      </option>
                      {currentServices.map((s) => (
                        <option key={s.id} value={s.id}>
                          {servicePlanName(s) +
                            " (" +
                            s.quantity +
                            " licences)"}
                        </option>
                      ))}
                    </select>
                    <Err name={pname(i, "from_service_id")} />
                  </div>

                  <div
                    className="form-group provider-group"
                    style={{ display: !rule ? "" : "none" }}
                  >
                    <label>
                      Provider <span>*</span>
                    </label>
                    <select
                      className={cx(
                        "form-control provider-select",
                        pname(i, "provider_id"),
                      )}
                      name={pname(i, "provider_id")}
                      value={row.provider_id}
                      onChange={(e) => onProviderChange(i, e.target.value)}
                      required
                    >
                      <option value="">Select Provider</option>
                      {providers.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <Err name={pname(i, "provider_id")} />
                  </div>

                  <div
                    className="form-group plan-group"
                    style={{
                      display:
                        !rule || rule.plans !== "same" || !row.plan_id
                          ? ""
                          : "none",
                    }}
                  >
                    <label>
                      <span className="plan-label">
                        {rule ? rule.planLabel : "Plan"}
                      </span>{" "}
                      <span>*</span>
                    </label>
                    <select
                      className={cx(
                        "form-control plan-select",
                        pname(i, "plan_id"),
                      )}
                      name={pname(i, "plan_id")}
                      value={row.plan_id}
                      onChange={(e) => onPlanChange(i, e.target.value)}
                      required
                    >
                      <option value="">{emptyPlanText}</option>
                      {opts.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name}
                        </option>
                      ))}
                    </select>
                    <Err name={pname(i, "plan_id")} />
                  </div>

                  <div
                    className="form-group period-group"
                    style={{ display: !rule || rule.period ? "" : "none" }}
                  >
                    <label>
                      Billing Cycle <span>*</span>
                    </label>
                    <select
                      className={cx(
                        "form-control quote-period-select",
                        pname(i, "quote_period"),
                      )}
                      name={pname(i, "quote_period")}
                      value={row.quote_period}
                      onChange={(e) => onPeriodChange(i, e.target.value)}
                      required
                    >
                      <option value="">Select Billing Cycle</option>
                      {billingCycles.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <Err name={pname(i, "quote_period")} />
                  </div>

                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      name={pname(i, "billing_start_date")}
                      className="start-input"
                      value={row.billing_start_date}
                      onChange={(e) =>
                        onRowInput(i, "billing_start_date", e.target.value)
                      }
                    />
                    <div className="form-hint end-hint">
                      {end
                        ? "End Date: " + end.split("-").reverse().join("-")
                        : ""}
                    </div>
                  </div>

                  <div
                    className="form-group sku-group"
                    style={{ display: !rule ? "" : "none" }}
                  >
                    <label>
                      SKU <span>*</span>
                    </label>
                    <input
                      type="text"
                      name={pname(i, "sku")}
                      className={cx("sku-input", pname(i, "sku"))}
                      value={row.sku}
                      onChange={(e) => onRowInput(i, "sku", e.target.value)}
                      required
                    />
                    <Err name={pname(i, "sku")} />
                  </div>

                  <div className="form-group">
                    <label>
                      <span className="qty-label">
                        {rule ? rule.qtyLabel : "Quantity"}
                      </span>{" "}
                      <span>*</span>
                    </label>
                    <input
                      type="number"
                      name={pname(i, "quantity")}
                      className={cx("qty-input", pname(i, "quantity"))}
                      min="1"
                      max={
                        service && rule.qty === "part"
                          ? Math.max(1, service.quantity - 1)
                          : undefined
                      }
                      value={row.quantity}
                      readOnly={!!rule && rule.qty === "all"}
                      placeholder={askQty ? "Enter licences" : ""}
                      onChange={(e) =>
                        onRowInput(i, "quantity", e.target.value)
                      }
                      required
                    />
                    <Err name={pname(i, "quantity")} />
                  </div>

                  <div className="form-group">
                    <label>
                      <span className="rate-label">
                        {rule ? rule.rateLabel : "Rate"}
                      </span>{" "}
                      <span>*</span>
                    </label>
                    <input
                      type="text"
                      name={pname(i, "rate")}
                      className={cx("rate-input", pname(i, "rate"))}
                      value={row.rate}
                      onChange={(e) => onRowInput(i, "rate", e.target.value)}
                      required
                    />
                    <Err name={pname(i, "rate")} />
                  </div>
                </div>

                <div
                  className="form-hint addon-info"
                  style={{
                    display: info ? "block" : "none",
                    maxWidth: 620,
                    background: "#f8fafc",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    padding: "10px 14px",
                    marginTop: 12,
                  }}
                >
                  {info &&
                    info.map((r, idx) => {
                      const last = idx === info.length - 1;
                      return (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 16,
                            padding: last ? "6px 0 3px" : "3px 0",
                            ...(last
                              ? {
                                  borderTop: "1px solid #e5e7eb",
                                  marginTop: 4,
                                  fontSize: 15,
                                }
                              : {}),
                          }}
                        >
                          <span style={{ color: "#6b7280" }}>{r[0]}</span>
                          <strong style={{ textAlign: "right" }}>{r[1]}</strong>
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.submitWrap}>
          <button type="submit" className={styles.submitBtn}>
            Save Quotation
          </button>
        </div>
      </section>
    </form>
  );
}

function QuotationCreate() {
  const searchParams = useSearchParams();
  const leadId = searchParams.get("lead_id") || "";

  const [leads, setLeads] = useState([]);
  const [currentServices, setCurrentServices] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    const getJson = (url) =>
      fetch(url, { credentials: "include" })
        .then((r) => (r.ok ? r.json() : []))
        .catch(() => []);

    Promise.all([
      getJson(API_URL + "/crm/leads?for=quotation"),
      leadId
        ? getJson(
            API_URL + "/crm/leads/" + encodeURIComponent(leadId) + "/services",
          )
        : Promise.resolve([]),
    ]).then(([l, s]) => {
      if (cancelled) return;
      setLeads(Array.isArray(l) ? l : []);
      setCurrentServices(Array.isArray(s) ? s : []);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [leadId]);

  const lead = leads.find((l) => String(l.id) === String(leadId)) || null;

  return (
    <main className="content">
      <div className="page-header">
        <div>
          <div className="breadcrumb welcome-text">
            <p>
              <Link href="/crm/dashboard">Dashboard</Link>
              <span>/</span>
              <Link href="/crm/quotations">Quotations</Link>
            </p>
          </div>
          <h2>Add Quotations</h2>
        </div>
        <div className="back">
          <Link href="/crm/quotations" className="back-btn">
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

      {ready && (
        <QuotationFormInner
          key={lead ? lead.id : "none"}
          lead={lead}
          leads={leads}
          currentServices={currentServices}
          action={API_URL + "/crm/quotations"}
          csrfToken={CSRF_TOKEN}
          checkDomainUrl={API_URL + "/crm/leads/check-domain"}
        />
      )}
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <QuotationCreate />
    </Suspense>
  );
}
