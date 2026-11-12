import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

import {
  FiCheckSquare,
  FiGlobe,
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
import {
  useLeadsSourceQuery,
  useCreateLeadsMutation,
  useUpdateLeadsMutation,
  useDeleteLeadsMutation,
  useLeadsStatusQuery,
  useCreateStatusMutation,
  useUpdateStatusMutation,
  useDeleteLeadsStatusMutation,
  useLeadsBifurcationQuery,
  useCreateBifurcationMutation,
  useUpdateBifurcationMutation,
  useDeleteLeadsBifurcationMutation,
  useLeadsPriorityQuery,
  useCreatePriorityMutation,
  useUpdatePriorityMutation,
  useDeleteLeadsPriorityMutation,
  useLeadsDesignationQuery,
  useCreateDesignationMutation,
  useUpdateDesignationMutation,
  useDeleteLeadsDesignationMutation,
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
    prefix: "ST",
    columnLabel: "Status",
    showDescription: true,
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
    columnLabel: "Bifurcation",
    showDescription: true,
    popupWidth: "380px",
    nameLabel: "Bifurcation Name",
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
    columnLabel: "Priority",
    showDescription: true,
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

const formatDate = (value) => {
  const date = new Date(value);

  if (!value || Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getLogoUrl = (logo) => {
  if (!logo || typeof logo !== "string") return null;

  if (/^(https?:|blob:|data:)/.test(logo)) return logo;

  const base = (process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "").replace(
    /\/+$/,
    "",
  );

  return base ? `${base}/${logo.replace(/^\/+/, "")}` : null;
};

// Maps an API list (sources, status, bifurcation, priority or designation) to table rows
const mapItems = (list, prefix) =>
  (Array.isArray(list) ? list : []).map((item) => ({
    id: item.id,
    code: makeCode(prefix, item.id),
    name: item.name || "",
    description: item.description || "",
    department: item.department || "",
    employeeCount: item.employee_count ?? 0,
    logo: getLogoUrl(item.logo_url),
    status: item.status || "inactive",
    leads: item.leads ?? null,
    createdOn: item.created_at,
  }));

const getSummaryCards = (tabKey, summary, items) => {
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
    const managementCount = items.filter(
      (item) => item.department === "Management",
    ).length;

    return [
      {
        label: "Total Designations",
        value: summary?.total ?? items.length,
        icon: FiBriefcase,
        tone: "toneSky",
      },
      {
        label: "Total Employees",
        value: summary?.employees ?? 0,
        icon: FiUsers,
        tone: "tonePurple",
      },
      {
        label: "Most Common Designation",
        value: summary?.most_common || "-",
        icon: FiTrendingUp,
        tone: "toneGreen",
      },
      {
        label: "Management Designations",
        value: summary?.management ?? managementCount,
        icon: FiUserCheck,
        tone: "toneAmber",
      },
    ];
  }

  return [];
};

export default function CrmSetting() {
  const router = useRouter();
  const { showToast } = useToast();

  const activeTab = TABS.find((tab) => tab.key === router.query.tab) || TABS[0];
  const activeKey = activeTab.key;
  const isLeadSources = activeKey === "lead-sources";
  const isLeadStatus = activeKey === "lead-status";
  const isBifurcation = activeKey === "lead-bifurcation";
  const isPriority = activeKey === "lead-priority";
  const isDesignation = activeKey === "designation";

  const [search, setSearch] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const sources = useLeadsSourceQuery(undefined, { skip: !isLeadSources });
  const statuses = useLeadsStatusQuery(undefined, { skip: !isLeadStatus });
  const bifurcations = useLeadsBifurcationQuery(undefined, {
    skip: !isBifurcation,
  });
  const priorities = useLeadsPriorityQuery(undefined, { skip: !isPriority });
  const designations = useLeadsDesignationQuery(undefined, {
    skip: !isDesignation,
  });

  let query = null;
  if (isLeadSources) query = sources;
  else if (isLeadStatus) query = statuses;
  else if (isBifurcation) query = bifurcations;
  else if (isPriority) query = priorities;
  else if (isDesignation) query = designations;

  const [createLead] = useCreateLeadsMutation();
  const [updateLead] = useUpdateLeadsMutation();
  const [deleteLead] = useDeleteLeadsMutation();
  const [createStatus] = useCreateStatusMutation();
  const [updateStatus] = useUpdateStatusMutation();
  const [deleteStatus] = useDeleteLeadsStatusMutation();
  const [createBifurcation] = useCreateBifurcationMutation();
  const [updateBifurcation] = useUpdateBifurcationMutation();
  const [deleteBifurcation] = useDeleteLeadsBifurcationMutation();
  const [createPriority] = useCreatePriorityMutation();
  const [updatePriority] = useUpdatePriorityMutation();
  const [deletePriority] = useDeleteLeadsPriorityMutation();
  const [createDesignation] = useCreateDesignationMutation();
  const [updateDesignation] = useUpdateDesignationMutation();
  const [deleteDesignation] = useDeleteLeadsDesignationMutation();

  let api = null;
  if (isLeadSources) {
    api = { create: createLead, update: updateLead, remove: deleteLead };
  } else if (isLeadStatus) {
    api = { create: createStatus, update: updateStatus, remove: deleteStatus };
  } else if (isBifurcation) {
    api = {
      create: createBifurcation,
      update: updateBifurcation,
      remove: deleteBifurcation,
    };
  } else if (isPriority) {
    api = {
      create: createPriority,
      update: updatePriority,
      remove: deletePriority,
    };
  } else if (isDesignation) {
    api = {
      create: createDesignation,
      update: updateDesignation,
      remove: deleteDesignation,
    };
  }

  const listData = query?.data?.data;

  const items = mapItems(
    listData?.items ?? listData?.designations,
    activeTab.prefix,
  );

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const summaryCards = getSummaryCards(activeKey, listData?.summary, items);

  const showLoading = Boolean(query?.isLoading || query?.isFetching);
  const showError = Boolean(query?.isError);

  const columnCount =
    4 + (activeTab.hasLeads ? 1 : 0) + (activeTab.showDescription ? 1 : 0);

  const openPopup = (item = null) => {
    setEditingItem(item);
    setLogoFile(null);
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setEditingItem(null);
    setLogoFile(null);
  };

  const handleTabChange = (key) => {
    if (key === activeKey) return;

    setSearch("");
    closePopup();

    router.replace(
      { pathname: router.pathname, query: { ...router.query, tab: key } },
      undefined,
      { shallow: true },
    );
  };

  const handleDelete = async (id) => {
    try {
      await api.remove({ id }).unwrap();
      showToast(`${activeTab.singular} deleted successfully`, "success");
    } catch (error) {
      showToast(error?.data?.message || "Unable to delete", "error");
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const values = {
      name: String(form.get("name") || "").trim(),
      status: String(form.get("status") || editingItem?.status || "active"),
      description: String(form.get("description") || "").trim(),
      department: String(form.get("department") || "").trim(),
      employeeCount: Number(form.get("employee_count") || 0),
    };

    if (!values.name) return;

    let body = { name: values?.name, description: values?.description };

    if (isLeadSources) {
      body = new FormData();
      body.append("name", values.name);
      body.append("status", values.status);
      if (logoFile) body.append("logo", logoFile);
    }

    if (isDesignation) {
      body = {
        ...body,
        department: values.department,
        employee_count: values.employeeCount,
      };
    }

    try {
      if (editingItem) {
        await api.update({ id: editingItem.id, body }).unwrap();
      } else {
        await api.create({ body }).unwrap();
      }

      showToast(
        `${activeTab.singular} ${editingItem ? "updated" : "added"} successfully`,
        "success",
      );
    } catch (error) {
      showToast(error?.data?.message || "Something went wrong", "error");
      return;
    }

    closePopup();
  };

  return (
    <div className={styles.shell}>
      <aside className={styles.card}>
        <p className={styles.sideTitle}>Configure lead workflow</p>

        <ul className={styles.navList}>
          {TABS.map(({ key, label, icon: Icon }) => {
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
            onClick={() => openPopup()}
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
                  {activeTab.columnLabel ||
                    (activeTab.hasLogo ? "Sources" : "Name")}
                </th>

                {activeTab.showDescription && (
                  <th className={styles.th}>Description</th>
                )}

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
                    <p>Unable to fetch {activeTab.label.toLowerCase()}.</p>
                    <button type="button" onClick={() => query.refetch()}>
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

                    {activeTab.showDescription && (
                      <td className={styles.td}>{item.description || "-"}</td>
                    )}

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
                          onClick={() => openPopup(item)}
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
                    {logoFile?.name || "Choose File"}
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
                    onChange={(event) =>
                      setLogoFile(event.target.files?.[0] || null)
                    }
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

              <button type="submit" className={styles.popupSaveBtn}>
                Saving
              </button>
            </div>
          </form>
        </div>
      </CustomPopup>
    </div>
  );
}
