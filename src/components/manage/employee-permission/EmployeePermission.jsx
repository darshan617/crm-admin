import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiSave } from "react-icons/fi";
import { useRouter } from "next/router";
import {
  useGetEmployeePermissionsQuery,
  useSaveEmployeePermissionsMutation,
} from "@/redux/apis/employeeApi";
import { useToast } from "@/custom-hooks/toast/ToastProvider";
import styles from "./EmployeePermission.module.css";

const ACTIONS = ["view", "add", "edit", "delete"];

const ACTION_LABELS = {
  view: "View",
  add: "Add",
  edit: "Edit",
  delete: "Delete",
};

const FALLBACK_MODULES = [
  {
    key: "leads",
    label: "Leads",
    items: [
      { key: "leads", label: "Leads" },
      { key: "jd_leads", label: "JD Leads" },
      { key: "exhibition_leads", label: "Exhibition Leads" },
      { key: "import_leads", label: "Import Leads" },
    ],
  },
  {
    key: "follow_up",
    label: "Follow Up",
    items: [
      { key: "follow_ups", label: "Follow Ups" },
      { key: "meetings", label: "Meetings" },
      { key: "tasks_reminders", label: "Tasks / Reminders" },
    ],
  },
  {
    key: "quotations",
    label: "Quotations",
    items: [
      { key: "quotations", label: "Quotations" },
      { key: "discount_approval", label: "Discount Approval" },
      { key: "create_quotations", label: "Create Quotations" },
      {
        key: "update_status_of_invoice_and_quotation",
        label: "Update Status of Invoice and Quotation",
      },
    ],
  },
  {
    key: "renewals",
    label: "Renewals",
    items: [
      { key: "renewals", label: "Renewals" },
      { key: "renewal_reminders", label: "Renewal Reminders" },
    ],
  },
  {
    key: "manage",
    label: "Manage",
    items: [
      { key: "employees", label: "Employees" },
      { key: "team_assignment", label: "Team Assignment" },
      { key: "employee_permissions", label: "Employee Permissions" },
      { key: "services_providers", label: "Services & Providers" },
      { key: "crm_settings", label: "CRM Settings" },
    ],
  },
];

const emptyActions = () => ({
  view: false,
  add: false,
  edit: false,
  delete: false,
});

const formatLabel = (key) =>
  String(key)
    .split("_")
    .filter(Boolean)
    .map((word) => {
      const lower = word.toLowerCase();
      if (lower === "jd") return "JD";
      if (lower === "crm") return "CRM";
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");

const readActions = (source) => ({
  view: Boolean(source?.view),
  add: Boolean(source?.add),
  edit: Boolean(source?.edit),
  delete: Boolean(source?.delete),
});

const toModules = (modulesMap) => {
  if (!modulesMap || typeof modulesMap !== "object" || Array.isArray(modulesMap)) {
    return FALLBACK_MODULES;
  }

  const modules = Object.entries(modulesMap).map(([key, module]) => ({
    key,
    label: module?.label || formatLabel(key),
    items: Object.entries(module?.items || {}).map(([itemKey, label]) => ({
      key: itemKey,
      label: typeof label === "string" ? label : formatLabel(itemKey),
    })),
  }));

  return modules.length ? modules : FALLBACK_MODULES;
};

const buildPermissions = (source = {}, modules = FALLBACK_MODULES) => {
  const next = {};

  modules.forEach((module) => {
    next[module.key] = {};

    module.items.forEach((item) => {
      next[module.key][item.key] = readActions(source?.[module.key]?.[item.key]);
    });

    Object.keys(source?.[module.key] || {}).forEach((itemKey) => {
      if (next[module.key][itemKey]) return;
      next[module.key][itemKey] = readActions(source[module.key][itemKey]);
    });
  });

  Object.keys(source || {}).forEach((moduleKey) => {
    if (next[moduleKey]) return;

    next[moduleKey] = {};
    Object.entries(source[moduleKey] || {}).forEach(([itemKey, value]) => {
      next[moduleKey][itemKey] = readActions(value);
    });
  });

  return next;
};

const unwrapPermissions = (result) => {
  if (result?.permissions) return result;
  if (result?.data?.permissions) return result.data;
  return null;
};

const moduleItems = (module, permissions) => {
  const known = new Set(module.items.map((item) => item.key));
  const extras = Object.keys(permissions?.[module.key] || {})
    .filter((key) => !known.has(key))
    .map((key) => ({ key, label: formatLabel(key) }));

  return [...module.items, ...extras];
};

const selectionState = (permissions, moduleKey, items) => {
  const values = items.flatMap((item) =>
    ACTIONS.map((action) => Boolean(permissions?.[moduleKey]?.[item.key]?.[action])),
  );
  const selected = values.filter(Boolean).length;

  return {
    checked: values.length > 0 && selected === values.length,
    indeterminate: selected > 0 && selected < values.length,
  };
};

function PermissionCheckbox({
  checked,
  indeterminate = false,
  onChange,
  label,
  disabled = false,
}) {
  return (
    <input
      type="checkbox"
      className={styles.checkbox}
      checked={checked}
      disabled={disabled}
      ref={(node) => {
        if (node) node.indeterminate = indeterminate && !checked;
      }}
      onChange={onChange}
      aria-label={label}
    />
  );
}

const EmployeePermission = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [role, setRole] = useState("Admin");
  const [employeeId, setEmployeeId] = useState("");
  const [queryReady, setQueryReady] = useState(false);
  const [permissions, setPermissions] = useState(null);
  const [details, setDetails] = useState(null);
  const appliedQuery = useRef(false);

  useEffect(() => {
    if (!router.isReady || appliedQuery.current) return;

    const queryRole = router.query.role;
    const queryEmployeeId = router.query.employee_id;

    if (typeof queryRole === "string" && queryRole) {
      setRole(queryRole);
    }

    if (typeof queryEmployeeId === "string" && queryEmployeeId) {
      setEmployeeId(queryEmployeeId);
    }

    appliedQuery.current = true;
    setQueryReady(true);
  }, [router.isReady, router.query.role, router.query.employee_id]);

  const permissionType = employeeId ? "employee" : "role";
  const { data, isFetching, isError, error } = useGetEmployeePermissionsQuery(
    {
      type: permissionType,
      role,
      employeeId,
    },
    { skip: !queryReady || !role },
  );
  const [saveEmployeePermissions, { isLoading: isSaving }] =
    useSaveEmployeePermissionsMutation();

  const payload = useMemo(() => unwrapPermissions(data), [data]);
  const modules = useMemo(
    () => toModules(details?.modules),
    [details?.modules],
  );
  const employees = details?.employees || [];
  const roleOptions = useMemo(() => {
    const values = Array.isArray(details?.roles) ? [...details.roles] : [];

    if (role && !values.includes(role)) values.unshift(role);

    return values.length ? values : [role];
  }, [details?.roles, role]);

  useEffect(() => {
    if (!payload?.permissions) return;

    const nextModules = toModules(payload.modules);
    setDetails(payload);
    setPermissions(buildPermissions(payload.permissions, nextModules));
  }, [payload]);

  const selectedEmployee =
    employees.find((employee) => String(employee?.id) === String(employeeId)) ||
    (details?.selected_employee &&
    String(details.selected_employee.id) === String(employeeId)
      ? details.selected_employee
      : null);

  const allSelected = useMemo(() => {
    if (!permissions) return false;

    return modules.every((module) => {
      const items = moduleItems(module, permissions);
      return selectionState(permissions, module.key, items).checked;
    });
  }, [modules, permissions]);

  const setAction = (moduleKey, itemKey, action, value) => {
    setPermissions((current) => {
      const next = structuredClone(current || buildPermissions());

      if (!next[moduleKey]) next[moduleKey] = {};
      if (!next[moduleKey][itemKey]) next[moduleKey][itemKey] = emptyActions();

      next[moduleKey][itemKey][action] = value;
      return next;
    });
  };

  const setModuleValue = (moduleKey, items, value) => {
    setPermissions((current) => {
      const next = structuredClone(current || buildPermissions());

      if (!next[moduleKey]) next[moduleKey] = {};

      items.forEach((item) => {
        next[moduleKey][item.key] = {
          view: value,
          add: value,
          edit: value,
          delete: value,
        };
      });

      return next;
    });
  };

  const handleSelectAll = () => {
    setPermissions((current) => {
      const next = structuredClone(current || buildPermissions());

      Object.keys(next).forEach((moduleKey) => {
        Object.keys(next[moduleKey] || {}).forEach((itemKey) => {
          next[moduleKey][itemKey] = {
            view: true,
            add: true,
            edit: true,
            delete: true,
          };
        });
      });

      return next;
    });
  };

  const handleRoleChange = (value) => {
    setRole(value);
    setEmployeeId("");
  };

  const handleEmployeeChange = (value) => {
    setEmployeeId(value);

    const employee = employees.find((item) => String(item?.id) === value);
    if (employee?.role) setRole(String(employee.role));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!permissions) return;

    const savingEmployee = Boolean(employeeId);

    try {
      const res = await saveEmployeePermissions({
        body: {
          type: savingEmployee ? "employee" : "role",
          role,
          employee_id: savingEmployee ? Number(employeeId) || employeeId : null,
          permissions,
        },
      }).unwrap();

      if (res?.success === false) {
        showToast(res?.message || "Unable to save permissions.", "error");
        return;
      }

      showToast(res?.message || "Permissions saved.", "success");
    } catch (saveError) {
      showToast(
        saveError?.data?.message || "Unable to save permissions.",
        "error",
      );
    }
  };

  const note = employeeId
    ? `These permissions apply only to ${
        selectedEmployee?.name || `employee ${employeeId}`
      } and replace the ${role} role defaults.`
    : `These defaults apply to all ${role} employees without an individual override.`;

  return (
    <form className={styles.card} onSubmit={handleSave}>
      <div className={styles.filters}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="role-defaults">
            Role defaults
          </label>
          <select
            id="role-defaults"
            className={styles.select}
            value={role}
            onChange={(event) => handleRoleChange(event.target.value)}
          >
            {roleOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="employee-override">
            Employee override
          </label>
          <div className={styles.overrideRow}>
            <select
              id="employee-override"
              className={styles.select}
              value={employeeId}
              onChange={(event) => handleEmployeeChange(event.target.value)}
            >
              <option value="">Use role defaults</option>
              {employeeId && !selectedEmployee ? (
                <option value={employeeId}>Employee #{employeeId}</option>
              ) : null}
              {employees.map((employee) => (
                <option key={employee?.id} value={employee?.id}>
                  {employee?.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              className={styles.selectAll}
              onClick={handleSelectAll}
              disabled={!permissions || allSelected || isFetching}
            >
              Select All
            </button>
          </div>
        </div>
      </div>

      <p className={styles.note}>{note}</p>

      {isError ? (
        <p className={`${styles.status} ${styles.statusError}`}>
          {error?.data?.message || "Unable to load permissions."}
        </p>
      ) : null}

      {!permissions && isFetching ? (
        <p className={styles.status}>Loading permissions...</p>
      ) : null}

      <div className={`${styles.tableWrap} ${isFetching ? styles.tableBusy : ""}`}>
        <div className={`${styles.grid} ${styles.head}`}>
          <span>Module</span>
          {ACTIONS.map((action) => (
            <span key={action}>{ACTION_LABELS[action]}</span>
          ))}
        </div>

        {modules.map((module) => {
          const items = moduleItems(module, permissions);
          const moduleState = selectionState(permissions, module.key, items);

          return (
            <div key={module.key}>
              <div className={`${styles.grid} ${styles.moduleRow}`}>
                <div className={styles.moduleLabel}>
                  <PermissionCheckbox
                    checked={moduleState.checked}
                    indeterminate={moduleState.indeterminate}
                    disabled={!permissions}
                    label={`${module.label} permissions`}
                    onChange={(event) =>
                      setModuleValue(module.key, items, event.target.checked)
                    }
                  />
                  <span className={styles.pill}>{module.label}</span>
                </div>
                <span />
                <span />
                <span />
                <span />
              </div>

              {items.map((item) => (
                <div
                  key={`${module.key}-${item.key}`}
                  className={`${styles.grid} ${styles.itemRow}`}
                >
                  <span className={styles.itemLabel}>{item.label}</span>
                  {ACTIONS.map((action) => (
                    <span key={action} className={styles.checkCell}>
                      <PermissionCheckbox
                        checked={Boolean(
                          permissions?.[module.key]?.[item.key]?.[action],
                        )}
                        disabled={!permissions}
                        label={`${item.label} ${ACTION_LABELS[action]}`}
                        onChange={(event) =>
                          setAction(
                            module.key,
                            item.key,
                            action,
                            event.target.checked,
                          )
                        }
                      />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <div className={styles.footer}>
        <button
          type="submit"
          className={styles.saveButton}
          disabled={!permissions || isSaving || isFetching}
        >
          <FiSave size={15} />
          {isSaving
            ? "Saving..."
            : employeeId
              ? "Save Employee Permissions"
              : "Save Role Defaults"}
        </button>
      </div>
    </form>
  );
};

export default EmployeePermission;
