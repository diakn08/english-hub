import { createContext, useContext, useState } from "react";
import api from "../api.js";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => api.getSession());
  const login = (u) => setUser(u);
  const logout = () => { api.logout(); setUser(null); };
  const updateUser = (u) => setUser(u);
  const isAdmin = user?.role === "admin";
  return <AuthCtx.Provider value={{ user, login, logout, updateUser, isAdmin }}>{children}</AuthCtx.Provider>;
}

export function useAuth() { return useContext(AuthCtx); }
