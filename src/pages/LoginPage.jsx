import { useState } from "react";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useRouter } from "../context/RouterContext.jsx";

export default function LoginPage() {
  const { navigate } = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = k => e => setForm(f => ({...f,[k]:e.target.value}));
  const handleSubmit = async () => {
    if (!form.email || !form.password) return setError("Заполните все поля");
    setLoading(true); setError("");
    try { const u = await api.login(form.email, form.password); login(u); navigate("/courses"); }
    catch(err) { setError(err.message); }
    finally { setLoading(false); }
  };
  return (
    <div className="page">
      <div className="form-card">
        <div className="form-title">Добро пожаловать!</div>
        <div className="form-sub">Войдите в свой аккаунт EnglishHub</div>
        {error && <div className="alert alert-error">⚠ {error}</div>}
        <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} onKeyDown={e=>e.key==="Enter"&&handleSubmit()} /></div>
        <div className="form-group"><label className="form-label">Пароль</label><input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={set("password")} onKeyDown={e=>e.key==="Enter"&&handleSubmit()} /></div>
        <div style={{fontSize:12,color:"#6b6b6b",background:"#f8f7f4",padding:"8px 12px",borderRadius:8,marginBottom:4}}>
          🔑 Admin: <code>admin@test.com</code> / <code>admin123</code><br/>
          👤 User: <code>user@test.com</code> / <code>user123</code>
        </div>
        <button className="submit-btn" onClick={handleSubmit} disabled={loading}>{loading?"Вход...":"Войти"}</button>
        <div className="form-link">Нет аккаунта? <a onClick={() => navigate("/register")}>Зарегистрироваться</a></div>
      </div>
    </div>
  );
}
