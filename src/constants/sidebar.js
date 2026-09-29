import {
  FiBarChart2,
  FiFileText,
  FiGrid,
  FiPhone,
  FiRefreshCw,
  FiSettings,
  FiUsers,
} from "react-icons/fi";

export const SIDEBAR_SECTIONS = [
  {
    key: "menu",
    name: "MENU",
    items: [
      { key: "dashboard", name: "Dashboard", url: "/dashboard", icon: FiGrid },
      { key: "leads", name: "Leads", url: "/leads", icon: FiUsers },
      { key: "follow-up", name: "Follow Up", url: "/follow-up", icon: FiPhone },
      {
        key: "quotations",
        name: "Quotations",
        url: "/quotations",
        icon: FiFileText,
      },
      {
        key: "renewals",
        name: "Renewals",
        url: "/renewals",
        icon: FiRefreshCw,
      },
    ],
  },
  {
    key: "controls-settings",
    name: "CONTROLS & SETTINGS",
    items: [
      {
        key: "manage",
        name: "Manage",
        icon: FiSettings,
        children: [
          {
            key: "employee-management",
            name: "Employee Management",
            url: "/manage/employees",
          },
          {
            key: "crm-settings",
            name: "CRM Settings",
            url: "/manage/crm-settings",
          },
          {
            key: "services-providers",
            name: "Services & Providers",
            url: "/manage/services-providers",
          },
        ],
      },
      { key: "reports", name: "Reports", url: "/reports", icon: FiBarChart2 },
    ],
  },
];

export const SIDEBAR_CHAT = {
  key: "crm-chat",
  name: "CRM Chat",
  url: "/crm-chat",
};
