import { useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useRouter } from "../context/RouterContext.jsx";

export default function ProtectedRoute({ component: Component, adminOnly = false, ...props }) {
  const { user, isAdmin } = useAuth();
  const { navigate } = useRouter();
  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (adminOnly && !isAdmin) navigate("/");
  }, [user, isAdmin, adminOnly]);
  if (!user) return null;
  if (adminOnly && !isAdmin) return null;
  return <Component {...props} />;
}
