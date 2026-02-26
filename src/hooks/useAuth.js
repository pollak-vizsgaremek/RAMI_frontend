import { useContext, createContext } from "react";

const AuthContext = createContext(null);

// This is needed in AuthContext.jsx but we define it here to avoid ESLint conflict
export { AuthContext };

// ─── Hook ─────────────────────────────────────────────────────────────────────
// Usage anywhere in the app:
//   const { user, isLoggedIn, loginSuccess, logout } = useAuth();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
