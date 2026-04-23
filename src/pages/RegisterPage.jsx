import { useState } from "react";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useRouter } from "../context/RouterContext.jsx";

export default function RegisterPage() {
  const { navigate } = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ name:"", email:"", password:"", confirm:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = k => e => setForm(f => ({...f,[k]:e.target.value}));
  const handleSubmit = async () => {
    if (!form.name||!form.email||!form.password||!form.confirm) return setError("Заполните все поля");
    if (form.password !== form.confirm) return setError("Пароли не совпадают");
    if (form.password.length < 6) return setError("Пароль минимум 6 символов");
    setLoading(true); setError("");
    try { const u = await api.register(form.name, form.email, form.password); login(u); navigate("/courses"); }
    catch(err) { setError(err.message); }
    finally { setLoading(false); }
  };
  return (
    <div className="page">
      <div className="form-card">
        <div className="form-title">Создать аккаунт</div>
        <div className="form-sub">Присоединяйтесь к тысячам студентов EnglishHub</div>
        {error && <div className="alert alert-error">⚠ {error}</div>}
        {[["name","Ваше имя","Как вас зовут?","text"],["email","Email","you@example.com","email"],["password","Пароль","Минимум 6 символов","password"],["confirm","Повторите пароль","••••••••","password"]].map(([k,label,ph,type]) => (
          <div className="form-group" key={k}><label className="form-label">{label}</label><input className="form-input" type={type} placeholder={ph} value={form[k]} onChange={set(k)} /></div>
        ))}
        <button className="submit-btn" onClick={handleSubmit} disabled={loading}>{loading?"Создание...":"Зарегистрироваться"}</button>
        <div className="form-link">Уже есть аккаунт? <a onClick={() => navigate("/login")}>Войти</a></div>
      </div>
    </div>
  );
}
