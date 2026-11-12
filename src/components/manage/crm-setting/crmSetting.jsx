import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  FiGlobe,
  FiCheckSquare,
  FiShare2,
  FiFlag,
  FiBriefcase,
  FiPlus,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiLayers,
  FiUsers,
  FiTrendingUp,
  FiUserPlus,
  FiUserCheck,
} from "react-icons/fi";
import styles from "@/components/manage/crm-setting/crmSetting.module.css";
import CustomPopup from "@/common-components/custom-popup/CustomPopup";
import amazon from "@/assets/images/amazon.jpg";
import tizzyMail from "@/assets/images/logo.png";
import Image from "next/image";

const TABS = [
  {
    key: "lead-sources",
    label: "Lead Sources",
    singular: "Lead Source",
    addLabel: "Add Lead Source",
    icon: FiGlobe,
    prefix: "LS",
    hasLogo: true,
    hasLeads: true,
    popupWidth: "390px",
    nameLabel: "Source Name",
    namePlaceholder: "Enter lead source name",
    hasStatus: true,
  },
  {
    key: "lead-status",
    label: "Lead Status",
    singular: "Lead Status",
    addLabel: "Add Lead Status",
    icon: FiCheckSquare,
    prefix: "LST",
    popupWidth: "380px",
    nameLabel: "Status Name",
    namePlaceholder: "Enter lead status name",
    hasDescription: true,
  },
  {
    key: "lead-bifurcation",
    label: "Lead Bifurcation",
    singular: "Lead Bifurcation",
    addLabel: "Add Lead Bifurcation",
    icon: FiShare2,
    prefix: "LB",
    popupWidth: "380px",
    nameLabel: "Status Name",
    namePlaceholder: "e.g. B2B, B2C",
    hasDescription: true,
  },
  {
    key: "lead-priority",
    label: "Lead Priority",
    singular: "Lead Priority",
    addLabel: "Add Lead Priority",
    icon: FiFlag,
    prefix: "LP",
    popupWidth: "380px",
    nameLabel: "Priority Name",
    namePlaceholder: "e.g. Hot, Normal, Cold",
    hasDescription: true,
  },
  {
    key: "designation",
    label: "Designation",
    singular: "Designation",
    addLabel: "Add Designation",
    icon: FiBriefcase,
    prefix: "DS",
    popupWidth: "420px",
    nameLabel: "Designation Name",
    namePlaceholder: "e.g. Sales Executive",
    hasDepartment: true,
    hasEmployeeCount: true,
    hasDescription: true,
    isCompact: true,
  },
];

const makeCode = (prefix, id) => `${prefix}${String(id).padStart(3, "0")}`;

const makeRows = (prefix, names, createdOn = "2026-10-06") =>
  names.map((name, index) => ({
    id: index + 1,
    code: makeCode(prefix, index + 1),
    name,
    status: "active",
    description: "",
    department: "",
    employeeCount: 0,
    leads: 0,
    createdOn,
  }));

const INITIAL_DATA = {
  "lead-sources": makeRows("LS", [
    "Website",
    "Tele Caller",
    "Referral",
    "Instagram",
    "Google Ads",
    "JD",
    "Exhibition",
    "LinkedIn",
    "Email",
    "Workindia",
    "Tizzy Mail",
  ]),
  "lead-status": makeRows("LST", [
    "New",
    "Contacted",
    "Qualified",
    "Won",
    "Lost",
  ]),
  "lead-bifurcation": makeRows("LB", ["Hot", "Warm", "Cold"]),
  "lead-priority": makeRows("LP", ["High", "Medium", "Low"]),
  designation: makeRows("DS", [
    "Director",
    "Manager",
    "Team Lead",
    "Executive",
    "Intern",
  ]),
};

const getSummaryCards = (tabKey, data) => {
  if (tabKey === "lead-sources") {
    return [
      {
        label: "Total Sources",
        value: data["lead-sources"].length,
        icon: FiLayers,
        tone: "toneSky",
      },
      { label: "Total Leads", value: 788, icon: FiUsers, tone: "toneCyan" },
      {
        label: "Top Lead Source",
        value: "Website",
        icon: FiGlobe,
        tone: "toneGreen",
        small: true,
      },
      {
        label: "Conversion Rate",
        value: "24.6%",
        icon: FiTrendingUp,
        tone: "tonePurple",
      },
      {
        label: "New Leads This Month",
        value: 126,
        icon: FiUserPlus,
        tone: "toneAmber",
      },
    ];
  }

  if (tabKey === "designation") {
    return [
      {
        label: "Total Designations",
        value: data.designation.length,
        icon: FiBriefcase,
        tone: "toneSky",
      },
      {
        label: "Total Employees",
        value: 48,
        icon: FiUsers,
        tone: "tonePurple",
      },
      {
        label: "Most Common Designation",
        value: "Director",
        icon: FiTrendingUp,
        tone: "toneGreen",
        small: true,
      },
      {
        label: "Management Designations",
        value: 4,
        icon: FiUserCheck,
        tone: "toneAmber",
      },
    ];
  }

  return [];
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function LeadSourcesPage() {
  const router = useRouter();

  const activeTab = TABS.find((t) => t.key === router.query.tab) || TABS[0];
  const activeKey = activeTab.key;

  const [data, setData] = useState(INITIAL_DATA);
  const [search, setSearch] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [logoFileName, setLogoFileName] = useState("");

  const items = data[activeKey];
  const summaryCards = getSummaryCards(activeKey, data);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) => item.name.toLowerCase().includes(query));
  }, [items, search]);

  const updateActiveList = (updater) =>
    setData((prev) => ({ ...prev, [activeKey]: updater(prev[activeKey]) }));

  const closePopup = () => setPopupOpen(false);

  const handleTabChange = (key) => {
    if (key === activeKey) return;
    setSearch("");
    setPopupOpen(false);
    setEditingItem(null);
    router.replace(
      { pathname: router.pathname, query: { ...router.query, tab: key } },
      undefined,
      { shallow: true },
    );
  };

  const handleAdd = () => {
    setEditingItem(null);
    setLogoFileName("");
    setPopupOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setLogoFileName("");
    setPopupOpen(true);
  };

  const handleDelete = (id) => {
    const message = `Are you sure you want to delete this ${activeTab.singular.toLowerCase()}?`;
    if (!confirm(message)) return;
    updateActiveList((list) => list.filter((item) => item.id !== id));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const file = formData.get("logo");
    const newLogo = file && file.size > 0 ? URL.createObjectURL(file) : null;

    const values = {
      name: String(formData.get("name") || "").trim(),
      status: String(formData.get("status") || editingItem?.status || "active"),
      description: String(formData.get("description") || "").trim(),
      department: String(formData.get("department") || "").trim(),
      employeeCount: Number(formData.get("employee_count") || 0),
      logo: newLogo || editingItem?.logo || null,
    };

    if (editingItem) {
      updateActiveList((list) =>
        list.map((item) =>
          item.id === editingItem.id ? { ...item, ...values } : item,
        ),
      );
    } else {
      const nextId = Math.max(0, ...items.map((item) => item.id)) + 1;
      const newItem = {
        id: nextId,
        code: makeCode(activeTab.prefix, nextId),
        leads: 0,
        createdOn: new Date().toISOString().slice(0, 10),
        ...values,
      };
      updateActiveList((list) => [...list, newItem]);
    }

    closePopup();
  };

  const columnCount = activeTab.hasLeads ? 5 : 4;

  return (
    <div className={`${styles.shell}`}>
      <aside className={`${styles.card}`}>
        <p className={`${styles.sideTitle}`}>Configure lead workflow</p>
        <ul className={`${styles.navList}`}>
          {TABS.map(({ key, label, icon: Icon }) => {
            const isActive = key === activeKey;
            return (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => handleTabChange(key)}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                >
                  <Icon size={16} color={isActive ? "#0284c7" : "#94a3b8"} />
                  <span>{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Main content */}
      <div>
        <div className={`${styles.header}`}>
          <div>
            <p className={`${styles.breadcrumb}`}>
              <Link href="  /dashboard" className={`${styles.crumbLink}`}>
                Dashboard
              </Link>{" "}
              <span>/</span>{" "}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className={`${styles.crumbLink}`}
              >
                Manage
              </a>{" "}
              <span>/</span> CRM Setting <span>/</span>
            </p>
            <h2 className={`${styles.title}`}>{activeTab.label}</h2>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className={`${styles.primaryBtn}`}
          >
            <FiPlus size={15} />
            <span>{activeTab.addLabel}</span>
          </button>
        </div>

        {summaryCards.length > 0 && (
          <div
            className={`${styles.summaryGrid}`}
            data-cards={summaryCards.length}
          >
            {summaryCards.map(({ label, value, icon: Icon, tone, small }) => (
              <div key={label} className={`${styles.summaryCard}`}>
                <div className={`${styles.summaryIcon} ${styles[tone]}`}>
                  <Icon size={18} />
                </div>
                <small className={`${styles.summaryLabel}`}>{label}</small>
                <h3
                  className={`${styles.summaryValue} ${small ? styles.summaryValueSmall : ""}`}
                >
                  {value}
                </h3>
              </div>
            ))}
          </div>
        )}

        <div className={`${styles.tableCard}`}>
          <div className={`${styles.tableTop}`}>
            <p className={`${styles.showing}`}>
              Showing{" "}
              <strong>
                {filteredItems.length ? `1 - ${filteredItems.length}` : "0"}
              </strong>{" "}
              from <strong>{filteredItems.length}</strong> {activeTab.label}
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className={`${styles.searchWrap}`}
            >
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${activeTab.label.toLowerCase()}`}
                className={`${styles.searchInput}`}
              />
              <FiSearch size={15} className={`${styles.searchIcon}`} />
            </form>
          </div>

          <table className={`${styles.table}`}>
            <thead>
              <tr>
                <th className={`${styles.th}`}>Id</th>
                <th className={`${styles.th}`}>
                  {activeTab.hasLogo ? "Sources" : "Name"}
                </th>
                {activeTab.hasLeads && (
                  <th className={`${styles.th}`}>Leads</th>
                )}
                <th className={`${styles.th}`}>Created on</th>
                <th className={`${styles.th} ${styles.center}`}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td className={`${styles.td}`}>
                    <span className={`${styles.badge}`}>{item.code}</span>
                  </td>
                  <td className={`${styles.td}`}>
                    <div className={`${styles.sourceCell}`}>
                      {activeTab.hasLogo && (
                        <div className={styles.avatar}>
                          {item.logo ? (
                            <Image
                              src={item.logo}
                              alt={`${item.name} logo`}
                              width={32}
                              height={32}
                              unoptimized={
                                typeof item.logo === "string" &&
                                item.logo.startsWith("blob:")
                              }
                              className={styles.avatarImg}
                            />
                          ) : (
                            <FiGlobe size={18} color="#0284c7" />
                          )}
                        </div>
                      )}
                      <span className={`${styles.sourceName}`}>
                        {item.name}
                      </span>
                    </div>
                  </td>
                  {activeTab.hasLeads && (
                    <td className={`${styles.td} ${styles.tdLeads}`}>
                      {item.leads}
                    </td>
                  )}
                  <td className={`${styles.td} ${styles.tdDate}`}>
                    {formatDate(item.createdOn)}
                  </td>
                  <td className={`${styles.td} ${styles.center}`}>
                    <div className={`${styles.actions}`}>
                      <button
                        type="button"
                        title="Edit"
                        onClick={() => handleEdit(item)}
                        className={`${styles.actionBtn} ${styles.actionEdit}`}
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        onClick={() => handleDelete(item.id)}
                        className={`${styles.actionBtn} ${styles.actionDelete}`}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={columnCount} className={`${styles.empty}`}>
                    No {activeTab.label.toLowerCase()} found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CustomPopup
        isOpen={popupOpen}
        onClose={closePopup}
        maxWidth={activeTab.popupWidth}
      >
        <div
          className={`${styles.popupCard} ${activeTab.isCompact ? styles.popupCardCompact : ""}`}
        >
          <h3 className={`${styles.popupTitle}`}>
            {editingItem ? "Edit" : "Add"} {activeTab.singular}
          </h3>

          <form
            key={`${activeKey}-${editingItem ? editingItem.id : "new"}`}
            onSubmit={handleSave}
          >
            {activeTab.hasLogo && (
              <div className={`${styles.popupGroup}`}>
                <label className={`${styles.popupLabel}`}>
                  Logo{" "}
                  {!editingItem && (
                    <span className={`${styles.popupRequired}`}>*</span>
                  )}
                </label>
                <div className={`${styles.filePicker}`}>
                  <span className={`${styles.fileName}`}>
                    {logoFileName || "Choose File"}
                  </span>
                  <label htmlFor="logoInput" className={`${styles.fileButton}`}>
                    Choose File
                  </label>
                  <input
                    type="file"
                    id="logoInput"
                    name="logo"
                    accept="image/*"
                    required={!editingItem}
                    className={`${styles.fileInput}`}
                    onChange={(e) =>
                      setLogoFileName(e.target.files[0]?.name || "")
                    }
                  />
                </div>
              </div>
            )}

            {/* Name (every tab) */}
            <div className={`${styles.popupGroup}`}>
              <label className={`${styles.popupLabel}`}>
                {activeTab.nameLabel}{" "}
                <span className={`${styles.popupRequired}`}>*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder={activeTab.namePlaceholder}
                defaultValue={editingItem?.name || ""}
                className={`${styles.popupInput}`}
              />
            </div>

            {/* Department (designation only) */}
            {activeTab.hasDepartment && (
              <div className={`${styles.popupGroup}`}>
                <label className={`${styles.popupLabel}`}>Department</label>
                <input
                  type="text"
                  name="department"
                  placeholder="e.g. Sales, Accounts, Management"
                  defaultValue={editingItem?.department || ""}
                  className={`${styles.popupInput}`}
                />
              </div>
            )}

            {/* Employee count (designation only) */}
            {activeTab.hasEmployeeCount && (
              <div className={`${styles.popupGroup}`}>
                <label className={`${styles.popupLabel}`}>Employee Count</label>
                <input
                  type="number"
                  name="employee_count"
                  placeholder="0"
                  min="0"
                  defaultValue={editingItem?.employeeCount || 0}
                  className={`${styles.popupInput}`}
                />
              </div>
            )}

            {/* Status (lead sources only) */}
            {activeTab.hasStatus && (
              <div className={`${styles.popupGroup} ${styles.popupGroupLast}`}>
                <label className={`${styles.popupLabel}`}>
                  Status <span className={`${styles.popupRequired}`}>*</span>
                </label>
                <select
                  name="status"
                  required
                  defaultValue={editingItem?.status || "active"}
                  className={`${styles.popupInput}`}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            )}

            {/* Description (every tab except lead sources) */}
            {activeTab.hasDescription && (
              <div className={`${styles.popupGroup} ${styles.popupGroupLast}`}>
                <label className={`${styles.popupLabel}`}>
                  Description{" "}
                  {!activeTab.isCompact && (
                    <span className={`${styles.popupRequired}`}>*</span>
                  )}
                </label>
                {activeTab.isCompact ? (
                  <textarea
                    name="description"
                    rows="2"
                    placeholder="Optional description..."
                    defaultValue={editingItem?.description || ""}
                    className={`${styles.popupInput} ${styles.popupTextarea}`}
                  />
                ) : (
                  <input
                    type="text"
                    name="description"
                    placeholder="Enter description"
                    defaultValue={editingItem?.description || ""}
                    className={`${styles.popupInput}`}
                  />
                )}
              </div>
            )}

            <div className={`${styles.popupFooter}`}>
              {activeTab.isCompact && (
                <button
                  type="button"
                  onClick={closePopup}
                  className={`${styles.popupCancelBtn}`}
                >
                  Cancel
                </button>
              )}
              <button type="submit" className={`${styles.popupSaveBtn}`}>
                Save
              </button>
            </div>
          </form>
        </div>
      </CustomPopup>
    </div>
  );
}
