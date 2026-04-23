import { createContext, useContext, useState, useEffect } from "react";

const RouterCtx = createContext(null);

export function RouterProvider({ children }) {
  const [path, setPath] = useState(window.location.hash.slice(1) || "/");
  useEffect(() => {
    const h = () => { setPath(window.location.hash.slice(1) || "/"); window.scrollTo(0,0); };
    window.addEventListener("hashchange", h);
    return () => window.removeEventListener("hashchange", h);
  }, []);
  const navigate = (to) => { window.location.hash = to; setPath(to); window.scrollTo(0,0); };
  return <RouterCtx.Provider value={{ path, navigate }}>{children}</RouterCtx.Provider>;
}

export function useRouter() { return useContext(RouterCtx); }

export function Route({ pattern, component: Component }) {
  const { path } = useRouter();
  if (pattern === path) return <Component />;
  if (pattern.includes(":id")) {
    const base = pattern.replace("/:id", "");
    if (path.startsWith(base + "/")) return <Component id={path.slice(base.length + 1)} />;
  }
  return null;
}
