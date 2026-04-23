import { createContext, useContext, useState, useEffect } from "react";
 
const RouterCtx = createContext(null);
 
// Хранит все зарегистрированные паттерны маршрутов
const registeredPatterns = new Set();
 
function matchPattern(pattern, path) {
  if (pattern === path) return true;
  if (pattern.includes(":id")) {
    const base = pattern.replace("/:id", "");
    if (path.startsWith(base + "/")) {
      const rest = path.slice(base.length + 1);
      return rest.length > 0 && !rest.includes("/");
    }
  }
  return false;
}
 
export function isKnownPath(path) {
  for (const pattern of registeredPatterns) {
    if (matchPattern(pattern, path)) return true;
  }
  return false;
}
 
export function RouterProvider({ children }) {
  const [path, setPath] = useState(window.location.hash.slice(1) || "/");
 
  useEffect(() => {
    const h = () => {
      setPath(window.location.hash.slice(1) || "/");
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", h);
    return () => window.removeEventListener("hashchange", h);
  }, []);
 
  const navigate = (to) => {
    window.location.hash = to;
    setPath(to);
    window.scrollTo(0, 0);
  };
 
  return (
    <RouterCtx.Provider value={{ path, navigate }}>
      {children}
    </RouterCtx.Provider>
  );
}
 
export function useRouter() {
  return useContext(RouterCtx);
}
 
export function Route({ pattern, component: Component }) {
  const { path } = useRouter();
 
  // Регистрируем паттерн при каждом рендере (Set не добавит дубликаты)
  registeredPatterns.add(pattern);
 
  if (pattern === path) return <Component />;
 
  if (pattern.includes(":id")) {
    const base = pattern.replace("/:id", "");
    if (path.startsWith(base + "/")) {
      const rest = path.slice(base.length + 1);
      if (rest.length > 0 && !rest.includes("/")) {
        return <Component id={rest} />;
      }
    }
  }
 
  return null;
}
 