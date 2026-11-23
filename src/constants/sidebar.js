import {
  FiBarChart2,
  FiFileText,
  FiPercent,
  FiPhone,
  FiRefreshCw,
  FiSettings,
} from "react-icons/fi";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { HiOutlinePhoneArrowUpRight } from "react-icons/hi2";
import { LuHandshake, LuLayoutDashboard, LuUserSearch } from "react-icons/lu";

export const SIDEBAR_SECTIONS = [
  {
    key: "menu",
    name: "MENU",
    items: [
      {
        key: "dashboard",
        moduleKey: "dashboard",
        name: "Dashboard",
        url: "/dashboard",
        icon: LuLayoutDashboard,
      },
      {
        key: "leads",
        moduleKey: "leads",
        name: "Leads",
        url: "/leads?type=all",
        icon: LuUserSearch,
      },
      {
        key: "follow-up",
        moduleKey: "follow_ups",
        name: "Follow Up",
        url: "/follow-up",
        icon: HiOutlinePhoneArrowUpRight,
      },
      {
        key: "quotations",
        moduleKey: "quotations",
        name: "Quotations",
        url: "/quotations",
        icon: FiFileText,
      },
      {
        key: "discount-approval",
        moduleKey: "discount_approval",
        name: "Discount Approval",
        url: "/discount-approval",
        icon: FiPercent,
      },
      {
        key: "crm-deals",
        moduleKey: "crm_deals",
        name: "CRM Deals",
        url: "/crm-deals",
        icon: LuHandshake,
      },
      // {
      //   key: "renewals",
      //   name: "Renewals",
      //   url: "/renewals",
      //   icon: FiRefreshCw,
      // },
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
            moduleKey: "employees",
            name: "Employee Management",
            url: "/manage/employee",
          },
          {
            key: "crm-settings",
            moduleKey: "crm_settings",
            name: "CRM Settings",
            url: "/manage/crm-setting",
          },
          {
            key: "services-providers",
            moduleKey: "services_providers",
            name: "Services & Providers",
            url: "/manage/service-providers",
          },
        ],
      },
      {
        key: "reports",
        moduleKey: "reports",
        name: "Reports",
        url: "/reports",
        icon: HiOutlineDocumentReport,
      },
    ],
  },
];

export const SIDEBAR_CHAT = {
  key: "crm-chat",
  name: "CRM Chat",
  url: "/crm-chats",
};
