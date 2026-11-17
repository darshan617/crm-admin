import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";

const PERMISSIONS_KEY = "UP";

const readStoredPermissions = () => {
  if (typeof window === "undefined") return [];

  const storedPermissions = localStorage.getItem(PERMISSIONS_KEY);

  if (storedPermissions === "undefined" || !storedPermissions) {
    if (storedPermissions === "undefined") {
      localStorage.removeItem(PERMISSIONS_KEY);
    }
    return [];
  }

  try {
    const parsedPermissions = JSON.parse(storedPermissions);

    if (Array.isArray(parsedPermissions)) {
      return parsedPermissions;
    }

    localStorage.removeItem(PERMISSIONS_KEY);
  } catch {
    localStorage.removeItem(PERMISSIONS_KEY);
  }

  return [];
};

const readLoginAs = () => {
  const userData = Cookies.get("CRM_USER");

  if (!userData) return null;

  try {
    const parsedUserData = JSON.parse(userData);
    return parsedUserData?.role_label ?? null;
  } catch (error) {
    console.error("Invalid userData:", error);
    return null;
  }
};

const usePermissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [loginAs, setLoginAs] = useState(null);

  useEffect(() => {
    setPermissions(readStoredPermissions());
    setLoginAs(readLoginAs());
  }, []);

  const getPermission = useCallback(
    (moduleKey) => {
      return permissions.find((item) => item?.module_key === moduleKey);
    },
    [permissions],
  );

  // Full access only when the account is explicitly not a partner user.
  // This login payload often has no login_as, so those accounts follow can_*.
  const hasFullAccess =
    loginAs != null && (loginAs === "Admin" || loginAs === "super_admin");

  const allows = useCallback(
    (moduleKey, action) => {
      if (hasFullAccess) return true;
      if (!permissions.length) return true;

      const permission = getPermission(moduleKey);
      if (!permission) return false;

      // is_visible_* hides the module even when the action itself is allowed.
      if (permission[`is_visible_${action}`] === false) return false;

      return !!permission[`can_${action}`];
    },
    [hasFullAccess, permissions.length, getPermission],
  );

  const canView = useCallback(
    (moduleKey) => allows(moduleKey, "view"),
    [allows],
  );

  const canAdd = useCallback((moduleKey) => allows(moduleKey, "add"), [allows]);

  const canEdit = useCallback(
    (moduleKey) => allows(moduleKey, "edit"),
    [allows],
  );

  const canDelete = useCallback(
    (moduleKey) => allows(moduleKey, "delete"),
    [allows],
  );

  return {
    permissions,
    loginAs,
    getPermission,
    canView,
    canAdd,
    canEdit,
    canDelete,
  };
};

export default usePermissions;
