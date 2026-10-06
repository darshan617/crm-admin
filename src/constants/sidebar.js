import {
  FiBarChart2,
  FiFileText,
  FiPhone,
  FiRefreshCw,
  FiSettings,
} from "react-icons/fi";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { HiOutlinePhoneArrowUpRight } from "react-icons/hi2";
import { LuLayoutDashboard, LuUserSearch } from "react-icons/lu";

export const SIDEBAR_SECTIONS = [
  {
    key: "menu",
    name: "MENU",
    items: [
      {
        key: "dashboard",
        name: "Dashboard",
        url: "/dashboard",
        icon: LuLayoutDashboard,
      },
      { key: "leads", name: "Leads", url: "/leads", icon: LuUserSearch },
      {
        key: "follow-up",
        name: "Follow Up",
        url: "/follow-up",
        icon: HiOutlinePhoneArrowUpRight,
      },
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
      { key: "reports", name: "Reports", url: "/reports", icon: HiOutlineDocumentReport  },
    ],
  },
];

export const SIDEBAR_CHAT = {
  key: "crm-chat",
  name: "CRM Chat",
  url: "/crm-chat",
};
