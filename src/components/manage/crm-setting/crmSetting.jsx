import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

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
} from "react-icons/fi";

import styles from "@/components/manage/crm-setting/crmSetting.module.css";
import CustomPopup from "@/common-components/custom-popup/CustomPopup";
import {
  useLeadsSourceQuery,
  useCreateLeadsMutation,
} from "@/redux/apis/crmSettingsApi";
import { useToast } from "@/custom-hooks/toast/ToastProvider";

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

const VISIBLE_TABS = TABS;

const makeCode = (prefix, id) => `${prefix}${String(id).padStart(3, "0")}`;

const makeRows = (prefix, names) =>
  names.map((name, index) => ({
    id: index + 1,
    code: makeCode(prefix, index + 1),
    name,
    status: "active",
    description: "",
    department: "",
    employeeCount: 0,
    leads: 0,
    createdOn: "2026-10-06",
  }));

const INITIAL_DATA = {
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

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getLogoUrl = (logo) => {
  if (!logo || typeof logo !== "string") return null;

  if (
    logo.startsWith("http://") ||
    logo.startsWith("https://") ||
    logo.startsWith("blob:") ||
    logo.startsWith("data:")
  ) {
    return logo;
  }

  const base = (process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "").replace(
    /\/+$/,
    "",
  );

  if (!base) return null;

  return `${base}/${logo.replace(/^\/+/, "")}`;
};

const getSummaryCards = (tabKey, items, summary) => {
  if (tabKey === "lead-sources") {
    return [
      {
        label: "Total Sources",
        value: summary?.total_sources ?? items.length,
        icon: FiLayers,
        tone: "toneSky",
      },
      {
        label: "Total Leads",
        value: summary?.total_leads ?? 0,
        icon: FiUsers,
        tone: "toneCyan",
      },
      {
        label: "Top Lead Source",
        value: summary?.top_lead_source || "-",
        icon: FiGlobe,
        tone: "toneGreen",
      },
      {
        label: "Conversion Rate",
        value: summary?.conversion_rate ?? "0%",
        icon: FiTrendingUp,
        tone: "tonePurple",
      },
      {
        label: "New Leads This Month",
        value: summary?.new_leads_this_month ?? 0,
        icon: FiUserPlus,
        tone: "toneAmber",
      },
    ];
  }

  if (tabKey === "designation") {
    return [
      {
        label: "Total Designations",
        value: items.length,
        icon: FiBriefcase,
        tone: "toneSky",
      },
    ];
  }

  return [];
};
export default function LeadSourcesPage() {
  const router = useRouter();

  const activeTab =
    VISIBLE_TABS.find((tab) => tab.key === router.query.tab) || VISIBLE_TABS[0];

  const activeKey = activeTab.key;
  const isLeadSources = activeKey === "lead-sources";

  const [data, setData] = useState(INITIAL_DATA);
  const [search, setSearch] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [logoFileName, setLogoFileName] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [sourceChanges, setSourceChanges] = useState({
    added: [],
    edited: {},
    deleted: [],
  });

  const {
    data: leadsSourceResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useLeadsSourceQuery(undefined, {
    skip: !isLeadSources,
  });

  const [createLead, { isLoading: isCreating }] = useCreateLeadsMutation();

  const apiItems = useMemo(() => {
    const responseItems = leadsSourceResponse?.data?.items;

    if (!Array.isArray(responseItems)) return [];

    return responseItems.map((item) => ({
      id: item.id,
      code: makeCode("LS", item?.id),
      name: item.name || "",
      logo: getLogoUrl(item?.logo_url),
      rawLogo: item?.logo,
      status: item?.status || "inactive",
      createdOn: item?.created_at,
      updatedOn: item?.updated_at,
      leads: item?.leads ?? null,
    }));
  }, [leadsSourceResponse]);

  const sourceItems = useMemo(
    () =>
      [...apiItems, ...sourceChanges.added]
        .filter((item) => !sourceChanges.deleted.includes(item.id))
        .map((item) =>
          sourceChanges.edited[item.id]
            ? { ...item, ...sourceChanges.edited[item.id] }
            : item,
        ),
    [apiItems, sourceChanges],
  );

  const { showToast } = useToast();
  const items = isLeadSources ? sourceItems : data[activeKey] || [];

  const summary = leadsSourceResponse?.data?.summary;

  const summaryCards = useMemo(
    () => getSummaryCards(activeKey, items, summary),
    [activeKey, items, summary],
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return items;

    return items.filter((item) =>
      String(item.name || "")
        .toLowerCase()
        .includes(query),
    );
  }, [items, search]);

  const updateActiveList = (updater) => {
    if (isLeadSources) return;

    setData((prev) => ({
      ...prev,
      [activeKey]: updater(prev[activeKey] || []),
    }));
  };

  const closePopup = () => {
    setPopupOpen(false);
    setEditingItem(null);
    setLogoFileName("");
    setLogoFile(null);
  };

  const handleTabChange = (key) => {
    if (key === activeKey) return;

    setSearch("");
    closePopup();

    router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          tab: key,
        },
      },
      undefined,
      { shallow: true },
    );
  };

  const handleAdd = () => {
    setEditingItem(null);
    setLogoFileName("");
    setLogoFile(null);
    setPopupOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setLogoFileName("");
    setLogoFile(null);
    setPopupOpen(true);
  };

  const handleDelete = (id) => {
    const message = `Are you sure you want to delete this ${activeTab.singular.toLowerCase()}?`;

    if (!window.confirm(message)) return;

    if (isLeadSources) {
      setSourceChanges((prev) => ({
        ...prev,
        deleted: [...prev.deleted, id],
      }));
      return;
    }

    updateActiveList((list) => list.filter((item) => item.id !== id));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const values = {
      name: String(formData.get("name") || "").trim(),
      status: String(formData.get("status") || editingItem?.status || "active"),
      description: String(formData.get("description") || "").trim(),
      department: String(formData.get("department") || "").trim(),
      employeeCount: Number(formData.get("employee_count") || 0),
    };

    if (!values.name) return;

    if (isLeadSources) {
      const logo = logoFile
        ? URL.createObjectURL(logoFile)
        : editingItem?.logo || null;

      if (editingItem) {
        setSourceChanges((prev) => ({
          ...prev,
          edited: {
            ...prev.edited,
            [editingItem.id]: {
              name: values.name,
              status: values.status,
              logo,
            },
          },
        }));
      } else {
        const body = new FormData();
        body.append("name", values.name);
        body.append("status", values.status);
        if (logoFile) body.append("logo", logoFile);

        try {
          await createLead({ body }).unwrap();
        } catch (error) {
          showToast(error?.data?.message, "error");

          return;
        }
      }

      closePopup();
      return;
    }

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
        createdOn: new Date().toISOString(),
        ...values,
      };

      updateActiveList((list) => [...list, newItem]);
    }

    closePopup();
  };

  const showLoading = isLeadSources && (isLoading || isFetching);

  const showError = isLeadSources && isError;

  const columnCount = activeTab.hasLeads ? 5 : 4;

  return (
    <div className={styles.shell}>
      <aside className={styles.card}>
        <p className={styles.sideTitle}>Configure lead workflow</p>

        <ul className={styles.navList}>
          {VISIBLE_TABS.map(({ key, label, icon: Icon }) => {
            const isActive = key === activeKey;

            return (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => handleTabChange(key)}
                  className={`${styles.navLink} ${
                    isActive ? styles.navLinkActive : ""
                  }`}
                >
                  <Icon size={16} color={isActive ? "#0284c7" : "#94a3b8"} />
                  <span>{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <div>
        <div className={styles.header}>
          <div>
            <p className={styles.breadcrumb}>
              <Link href="/dashboard" className={styles.crumbLink}>
                Dashboard
              </Link>{" "}
              <span>/</span> <span className={styles.crumbLink}>Manage</span>{" "}
              <span>/</span> CRM Setting <span>/</span>
            </p>

            <h2 className={styles.title}>{activeTab.label}</h2>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className={styles.primaryBtn}
          >
            <FiPlus size={15} />
            <span>{activeTab.addLabel}</span>
          </button>
        </div>

        {summaryCards.length > 0 && (
          <div className={styles.summaryGrid} data-cards={summaryCards.length}>
            {summaryCards.map(({ label, value, icon: Icon, tone }) => (
              <div key={label} className={styles.summaryCard}>
                <div className={`${styles.summaryIcon} ${styles[tone]}`}>
                  <Icon size={18} />
                </div>

                <small className={styles.summaryLabel}>{label}</small>

                <h3 className={styles.summaryValue}>
                  {showLoading ? "..." : value}
                </h3>
              </div>
            ))}
          </div>
        )}

        <div className={styles.tableCard}>
          <div className={styles.tableTop}>
            <p className={styles.showing}>
              Showing{" "}
              <strong>
                {filteredItems.length ? `1 - ${filteredItems.length}` : "0"}
              </strong>{" "}
              from <strong>{items.length}</strong> {activeTab.label}
            </p>

            <form
              onSubmit={(event) => event.preventDefault()}
              className={styles.searchWrap}
            >
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={`Search ${activeTab.label.toLowerCase()}`}
                className={styles.searchInput}
              />

              <FiSearch size={15} className={styles.searchIcon} />
            </form>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Id</th>

                <th className={styles.th}>
                  {activeTab.hasLogo ? "Sources" : "Name"}
                </th>

                {activeTab.hasLeads && <th className={styles.th}>Leads</th>}

                <th className={styles.th}>Created on</th>

                <th className={`${styles.th} ${styles.center}`}>Action</th>
              </tr>
            </thead>

            <tbody>
              {showLoading ? (
                <tr>
                  <td colSpan={columnCount} className={styles.empty}>
                    Loading {activeTab.label.toLowerCase()}...
                  </td>
                </tr>
              ) : showError ? (
                <tr>
                  <td colSpan={columnCount} className={styles.empty}>
                    <p>Unable to fetch lead sources.</p>
                    <button type="button" onClick={() => refetch()}>
                      Try Again
                    </button>
                  </td>
                </tr>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td className={styles.td}>
                      <span className={styles.badge}>{item.code}</span>
                    </td>

                    <td className={styles.td}>
                      <div className={styles.sourceCell}>
                        {activeTab.hasLogo && (
                          <div className={styles.avatar}>
                            {item.logo ? (
                              <Image
                                src={item.logo}
                                alt={`${item.name} logo`}
                                width={32}
                                height={32}
                                unoptimized
                                className={styles.avatarImg}
                              />
                            ) : (
                              <FiGlobe size={18} color="#0284c7" />
                            )}
                          </div>
                        )}

                        <span className={styles.sourceName}>{item.name}</span>
                      </div>
                    </td>

                    {activeTab.hasLeads && (
                      <td className={`${styles.td} ${styles.tdLeads}`}>
                        {item.leads ?? "-"}
                      </td>
                    )}

                    <td className={`${styles.td} ${styles.tdDate}`}>
                      {formatDate(item.createdOn)}
                    </td>

                    <td className={`${styles.td} ${styles.center}`}>
                      <div className={styles.actions}>
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
                ))
              ) : (
                <tr>
                  <td colSpan={columnCount} className={styles.empty}>
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
          className={`${styles.popupCard} ${
            activeTab.isCompact ? styles.popupCardCompact : ""
          }`}
        >
          <h3 className={styles.popupTitle}>
            {editingItem ? "Edit" : "Add"} {activeTab.singular}
          </h3>

          <form
            key={`${activeKey}-${editingItem ? editingItem.id : "new"}`}
            onSubmit={handleSave}
          >
            {activeTab.hasLogo && (
              <div className={styles.popupGroup}>
                <label className={styles.popupLabel}>
                  Logo
                  {!editingItem && (
                    <span className={styles.popupRequired}>*</span>
                  )}
                </label>

                <div className={styles.filePicker}>
                  <span className={styles.fileName}>
                    {logoFileName || "Choose File"}
                  </span>

                  <label htmlFor="logoInput" className={styles.fileButton}>
                    Choose File
                  </label>

                  <input
                    type="file"
                    id="logoInput"
                    name="logo"
                    accept="image/*"
                    required={!editingItem}
                    className={styles.fileInput}
                    onChange={(event) => {
                      const file = event.target.files?.[0] || null;

                      setLogoFile(file);
                      setLogoFileName(file?.name || "");
                    }}
                  />
                </div>
              </div>
            )}

            <div className={styles.popupGroup}>
              <label className={styles.popupLabel}>
                {activeTab.nameLabel}{" "}
                <span className={styles.popupRequired}>*</span>
              </label>

              <input
                type="text"
                name="name"
                required
                placeholder={activeTab.namePlaceholder}
                defaultValue={editingItem?.name || ""}
                className={styles.popupInput}
              />
            </div>

            {activeTab.hasDepartment && (
              <div className={styles.popupGroup}>
                <label className={styles.popupLabel}>Department</label>

                <input
                  type="text"
                  name="department"
                  placeholder="e.g. Sales, Accounts, Management"
                  defaultValue={editingItem?.department || ""}
                  className={styles.popupInput}
                />
              </div>
            )}

            {activeTab.hasEmployeeCount && (
              <div className={styles.popupGroup}>
                <label className={styles.popupLabel}>Employee Count</label>

                <input
                  type="number"
                  name="employee_count"
                  placeholder="0"
                  min="0"
                  defaultValue={editingItem?.employeeCount ?? 0}
                  className={styles.popupInput}
                />
              </div>
            )}

            {activeTab.hasStatus && (
              <div className={`${styles.popupGroup} ${styles.popupGroupLast}`}>
                <label className={styles.popupLabel}>
                  Status <span className={styles.popupRequired}>*</span>
                </label>

                <select
                  name="status"
                  required
                  defaultValue={editingItem?.status || "active"}
                  className={styles.popupInput}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            )}

            {activeTab.hasDescription && (
              <div className={`${styles.popupGroup} ${styles.popupGroupLast}`}>
                <label className={styles.popupLabel}>
                  Description
                  {!activeTab.isCompact && (
                    <span className={styles.popupRequired}>*</span>
                  )}
                </label>

                {activeTab.isCompact ? (
                  <textarea
                    name="description"
                    rows={2}
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
                    className={styles.popupInput}
                  />
                )}
              </div>
            )}

            <div className={styles.popupFooter}>
              {activeTab.isCompact && (
                <button
                  type="button"
                  onClick={closePopup}
                  className={styles.popupCancelBtn}
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                disabled={isCreating}
                className={styles.popupSaveBtn}
              >
                {isCreating ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </CustomPopup>
    </div>
  );
}
