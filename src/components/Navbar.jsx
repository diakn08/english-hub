import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useRouter } from "../context/RouterContext.jsx";

export default function Navbar() {
  const { path, navigate } = useRouter();
  const { user, isAdmin, logout } = useAuth();

  const [open, setOpen] = useState(false);

  const link = (to, label, style = {}) => (
    <button
      className={`nav-link${path === to ? " active" : ""}`}
      onClick={() => {
        navigate(to);
        setOpen(false);
      }}
      style={style}
    >
      {label}
    </button>
  );

  return (
    <nav className="nav">
      <div className="nav-inner">

        {/* ЛОГО */}
        <a className="nav-logo" onClick={() => navigate("/")}>
          🎓 <span>English<strong style={{color:"#0d9e75"}}>Hub</strong></span>
        </a>

        {/* БУРГЕР */}
        <button className="burger" onClick={() => setOpen(!open)}>
          ☰
        </button>

        {/* ДЕСКТОП МЕНЮ */}
        <div className="nav-links desktop">
          {link("/", "Главная")}
          {link("/courses", "Курсы")}
          {user && link("/dashboard", "Дашборд")}
          {user && link("/create", "+ Создать")}
          {isAdmin &&
            link("/admin", "⚙ Админка", {
              color: path === "/admin" ? "#a32d2d" : "#ba7517",
              fontWeight: 500,
            })}
        </div>

        {/* ДЕСКТОП ACTIONS */}
        <div className="nav-actions desktop">
          {user ? (
            <>
              <div className="user-chip" onClick={() => navigate("/profile")}>
                <div className="avatar">{user.name[0].toUpperCase()}</div>
                <span>{user.name}</span>
              </div>
              <button className="nav-btn outline" onClick={logout}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <button className="nav-btn outline" onClick={() => navigate("/login")}>Войти</button>
              <button className="nav-btn" onClick={() => navigate("/register")}>Регистрация</button>
            </>
          )}
        </div>
      </div>

      {/* 📱 MOBILE MENU */}
      {open && (
        <div className="mobile-menu">
          {link("/", "Главная")}
          {link("/courses", "Курсы")}
          {user && link("/dashboard", "Дашборд")}
          {user && link("/create", "+ Создать")}

          {user ? (
            <>
              <button onClick={() => { navigate("/profile"); setOpen(false); }}>Профиль</button>
              <button onClick={() => { logout(); setOpen(false); }}>Выйти</button>
            </>
          ) : (
            <>
              <button onClick={() => { navigate("/login"); setOpen(false); }}>Войти</button>
              <button onClick={() => { navigate("/register"); setOpen(false); }}>Регистрация</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}