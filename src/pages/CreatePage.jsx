import { useState } from "react";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useRouter } from "../context/RouterContext.jsx";

export default function CreatePage() {
  const { navigate } = useRouter();
  const { user } = useAuth();
  const [form, setForm] = useState({ title:"", level:"A1", lessons:"", description:"", category:"Speaking" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const set = k => e => setForm(f => ({...f,[k]:e.target.value}));

  const handleSubmit = async () => {
    if (!form.title.trim()) return setError("Введите название курса");
    if (!form.lessons || isNaN(form.lessons) || Number(form.lessons)<1) return setError("Укажите корректное количество уроков");
    if (!form.description.trim()) return setError("Добавьте описание курса");
    setLoading(true); setError(""); setSuccess("");
    try {
      await api.createCourse({...form, lessons:Number(form.lessons), author:user.name, authorId:user.id});
      setSuccess("Курс успешно создан! Переход к списку...");
      setTimeout(() => navigate("/courses"), 1200);
    } catch(err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="form-card" style={{maxWidth:560}}>
        <div className="form-title">Новый курс</div>
        <div className="form-sub">Создайте учебный курс для студентов EnglishHub</div>
        {error && <div className="alert alert-error">⚠ {error}</div>}
        {success && <div className="alert alert-success">✓ {success}</div>}
        <div className="form-group"><label className="form-label">Название курса *</label><input className="form-input" placeholder="напр. English for Travel" value={form.title} onChange={set("title")} /></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div className="form-group"><label className="form-label">Уровень *</label><select className="form-select" value={form.level} onChange={set("level")}>{["A1","A2","B1","B2","C1","C2"].map(l=><option key={l}>{l}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Количество уроков *</label><input className="form-input" type="number" placeholder="10" min="1" max="100" value={form.lessons} onChange={set("lessons")} /></div>
        </div>
        <div className="form-group"><label className="form-label">Категория *</label><select className="form-select" value={form.category} onChange={set("category")}>{["Speaking","Grammar","Business","Exam Prep","Writing","Listening"].map(c=><option key={c}>{c}</option>)}</select></div>
        <div className="form-group"><label className="form-label">Описание курса *</label><textarea className="form-textarea" placeholder="Расскажите, чему научатся студенты..." value={form.description} onChange={set("description")} /></div>
        <button className="submit-btn" onClick={handleSubmit} disabled={loading}>{loading?"Создание...":"Создать курс"}</button>
        <div className="form-link"><a onClick={() => navigate("/courses")}>← Отмена</a></div>
      </div>
    </div>
  );
}
