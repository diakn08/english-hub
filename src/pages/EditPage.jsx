import { useState, useEffect } from "react";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useRouter } from "../context/RouterContext.jsx";
import Spinner from "../components/Spinner.jsx";

export default function EditPage({ id }) {
  const { navigate } = useRouter();
  const { user, isAdmin } = useAuth();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const set = k => e => setForm(f => ({...f,[k]:e.target.value}));

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    api.getCourse(id).then(c => {
      if (!c) { setError("Курс не найден"); setLoading(false); return; }
      const isOwner = user.id===c.authorId || user.name===c.author || isAdmin;
      if (!isOwner) { setError("У вас нет прав для редактирования этого курса"); setLoading(false); return; }
      setForm({ title:c.title, level:c.level, lessons:String(c.lessons), description:c.description, category:c.category });
      setLoading(false);
    }).catch(() => { setError("Ошибка загрузки"); setLoading(false); });
  }, [id, user]);

  const handleSubmit = async () => {
    if (!form.title.trim()) return setError("Введите название курса");
    if (!form.lessons||isNaN(form.lessons)||Number(form.lessons)<1) return setError("Укажите корректное количество уроков");
    if (!form.description.trim()) return setError("Добавьте описание курса");
    setSaving(true); setError(""); setSuccess("");
    try { await api.updateCourse(id, {...form, lessons:Number(form.lessons)}); setSuccess("Курс обновлён!"); setTimeout(() => navigate(`/courses/${id}`), 1000); }
    catch(err) { setError(err.message); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="page"><Spinner /></div>;
  if (error && !form) return <div className="page"><div className="alert alert-error">⚠ {error}</div><button className="back-btn" onClick={() => navigate("/courses")}>← К курсам</button></div>;

  return (
    <div className="page">
      <button className="back-btn" onClick={() => navigate(`/courses/${id}`)}>← Назад к курсу</button>
      <div className="form-card" style={{maxWidth:560}}>
        <div className="form-title">Редактировать курс</div>
        <div className="form-sub">Измените данные курса и сохраните изменения</div>
        {error && <div className="alert alert-error">⚠ {error}</div>}
        {success && <div className="alert alert-success">✓ {success}</div>}
        {form && <>
          <div className="form-group"><label className="form-label">Название курса *</label><input className="form-input" value={form.title} onChange={set("title")} /></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div className="form-group"><label className="form-label">Уровень *</label><select className="form-select" value={form.level} onChange={set("level")}>{["A1","A2","B1","B2","C1","C2"].map(l=><option key={l}>{l}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Кол-во уроков *</label><input className="form-input" type="number" min="1" max="100" value={form.lessons} onChange={set("lessons")} /></div>
          </div>
          <div className="form-group"><label className="form-label">Категория *</label><select className="form-select" value={form.category} onChange={set("category")}>{["Speaking","Grammar","Business","Exam Prep","Writing","Listening"].map(c=><option key={c}>{c}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Описание *</label><textarea className="form-textarea" value={form.description} onChange={set("description")} /></div>
          <button className="submit-btn" onClick={handleSubmit} disabled={saving}>{saving?"Сохранение...":"Сохранить изменения"}</button>
          <div className="form-link"><a onClick={() => navigate(`/courses/${id}`)}>← Отмена</a></div>
        </>}
      </div>
    </div>
  );
}
