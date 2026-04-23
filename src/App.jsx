import { AuthProvider } from "./context/AuthContext.jsx";
import { RouterProvider, Route, useRouter, isKnownPath } from "./context/RouterContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";

import HomePage from "./pages/HomePage.jsx";
import CoursesPage from "./pages/CoursesPage.jsx";
import DetailsPage from "./pages/DetailsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import CreatePage from "./pages/CreatePage.jsx";
import EditPage from "./pages/EditPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import MyCoursesPage from "./pages/MyCoursesPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// Все известные паттерны маршрутов
const KNOWN_PATTERNS = [
  "/",
  "/courses",
  "/courses/:id",
  "/login",
  "/register",
  "/create",
  "/edit/:id",
  "/dashboard",
  "/favorites",
  "/my-courses",
  "/profile",
  "/admin",
];

function AppRoutes() {
  const { path } = useRouter();

  // Проверяем — совпадает ли текущий путь с каким-либо известным паттерном
  const known = KNOWN_PATTERNS.some((pattern) => {
    if (pattern === path) return true;
    if (pattern.includes(":id")) {
      const base = pattern.replace("/:id", "");
      if (path.startsWith(base + "/")) {
        const rest = path.slice(base.length + 1);
        return rest.length > 0 && !rest.includes("/");
      }
    }
    return false;
  });

  if (!known) {
    return <NotFoundPage path={path} />;
  }

  return (
    <>
      <Route pattern="/" component={HomePage} />
      <Route pattern="/courses" component={CoursesPage} />
      <Route pattern="/courses/:id" component={DetailsPage} />
      <Route pattern="/login" component={LoginPage} />
      <Route pattern="/register" component={RegisterPage} />
      <Route pattern="/create" component={() => <ProtectedRoute component={CreatePage} />} />
      <Route pattern="/edit/:id" component={({ id }) => <ProtectedRoute component={EditPage} id={id} />} />
      <Route pattern="/dashboard" component={() => <ProtectedRoute component={DashboardPage} />} />
      <Route pattern="/favorites" component={() => <ProtectedRoute component={FavoritesPage} />} />
      <Route pattern="/my-courses" component={() => <ProtectedRoute component={MyCoursesPage} />} />
      <Route pattern="/profile" component={() => <ProtectedRoute component={ProfilePage} />} />
      <Route pattern="/admin" component={() => <ProtectedRoute component={AdminPage} adminOnly={true} />} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider>
        <Navbar />
        <AppRoutes />
      </RouterProvider>
    </AuthProvider>
  );
}