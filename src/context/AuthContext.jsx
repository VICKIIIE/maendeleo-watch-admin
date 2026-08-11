import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getIdTokenResult, onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { normalizeRole } from "../utils/rbac";

const AuthContext = createContext(null);
const STORAGE_ROLE_KEY = "maendeleo-role";

const readStoredRole = () => {
  try {
    return normalizeRole(window.localStorage.getItem(STORAGE_ROLE_KEY));
  } catch {
    return null;
  }
};

const writeStoredRole = (role) => {
  try {
    if (role) {
      window.localStorage.setItem(STORAGE_ROLE_KEY, role);
    } else {
      window.localStorage.removeItem(STORAGE_ROLE_KEY);
    }
  } catch {
    // Ignore storage failures in restricted browsers.
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(readStoredRole());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (!firebaseUser) {
        setRole(null);
        writeStoredRole(null);
        setLoading(false);
        return;
      }

      try {
        const tokenResult = await getIdTokenResult(firebaseUser, true);
        const claims = tokenResult?.claims || {};
        const resolvedRole = normalizeRole(
          claims.role || claims.roles || claims.role_name || claims.roleName || claims.role_id
        ) || readStoredRole() || "Investigator";

        setRole(resolvedRole);
        writeStoredRole(resolvedRole);
      } catch {
        setRole(readStoredRole() || "Investigator");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo(() => ({
    user,
    role,
    loading,
    isAuthenticated: !!user,
  }), [user, role, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
