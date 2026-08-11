export const ROLE_ALIASES = {
  Auditor: "Investigator",
  Inspector: "Field Agent",
  "System Admin": "Super Admin",
};

export const normalizeRole = (role) => {
  if (typeof role !== "string") return null;
  return ROLE_ALIASES[role] || role;
};

export const hasAnyRole = (role, allowedRoles = []) => {
  if (!allowedRoles || allowedRoles.length === 0) return true;

  const normalizedRole = normalizeRole(role);
  const normalizedAllowedRoles = allowedRoles.map((allowedRole) => normalizeRole(allowedRole));

  return normalizedAllowedRoles.includes(normalizedRole);
};
