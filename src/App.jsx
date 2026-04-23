import { AuthProvider } from "./context/AuthContext.jsx";
import { RouterProvider, Route } from "./context/RouterContext.jsx";
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

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider>
        <Navbar />
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
      </RouterProvider>
    </AuthProvider>
  );
}
