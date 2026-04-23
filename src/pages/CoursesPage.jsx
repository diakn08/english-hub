import { useState, useEffect } from "react";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useRouter } from "../context/RouterContext.jsx";
import Spinner from "../components/Spinner.jsx";
import CourseCard from "../components/CourseCard.jsx";

const CATS = ["Все","Speaking","Grammar","Business","Exam Prep","Writing","Listening"];
const LVLS = ["Все уровни","A1","A2","B1","B2","C1","C2"];

export default function CoursesPage() {
  const { navigate } = useRouter();
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cat, setCat] = useState("Все");
  const [lvl, setLvl] = useState("Все уровни");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => { api.getCourses().then(setCourses).catch(() => setError("Не удалось загрузить курсы")).finally(() => setLoading(false)); }, []);

  const reset = () => { setCat("Все"); setLvl("Все уровни"); setSearch(""); setSort("newest"); };
  const hasFilters = cat !== "Все" || lvl !== "Все уровни" || search !== "" || sort !== "newest";

  const filtered = courses
    .filter(c => cat === "Все" || c.category === cat)
    .filter(c => lvl === "Все уровни" || c.level === lvl)
    .filter(c => !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => {
      if (sort==="newest") return new Date(b.createdAt||0)-new Date(a.createdAt||0);
      if (sort==="oldest") return new Date(a.createdAt||0)-new Date(b.createdAt||0);
      if (sort==="title_az") return a.title.localeCompare(b.title);
      if (sort==="title_za") return b.title.localeCompare(a.title);
      if (sort==="rating") return (b.rating||0)-(a.rating||0);
      if (sort==="lessons") return b.lessons-a.lessons;
      return 0;
    });

  return (
    <div className="page">
      <div className="page-header">
        <p className="section-title" style={{margin:0}}>Все курсы</p>
        {user && <button className="create-btn" onClick={() => navigate("/create")}>+ Новый курс</button>}
      </div>
      <input className="form-input" placeholder="🔍  Поиск курсов..." value={search} onChange={e => setSearch(e.target.value)} style={{maxWidth:400,marginBottom:16}} />
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)} style={{padding:"5px 14px",borderRadius:20,border:"1.5px solid",borderColor:cat===c?"#0d9e75":"rgba(0,0,0,0.12)",background:cat===c?"#e1f5ee":"white",color:cat===c?"#085041":"#6b6b6b",fontSize:13,fontWeight:cat===c?500:400,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}}>{c}</button>
        ))}
      </div>
      <div style={{display:"flex",gap:10,marginBottom:24,flexWrap:"wrap",alignItems:"center"}}>
        <select value={lvl} onChange={e => setLvl(e.target.value)} className="form-select" style={{width:"auto",padding:"8px 14px"}}>
          {LVLS.map(l => <option key={l}>{l}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)} className="form-select" style={{width:"auto",padding:"8px 14px"}}>
          <option value="newest">Сначала новые</option>
          <option value="oldest">Сначала старые</option>
          <option value="title_az">По названию А→Я</option>
          <option value="title_za">По названию Я→А</option>
          <option value="rating">По рейтингу</option>
          <option value="lessons">По кол-ву уроков</option>
        </select>
        {hasFilters && <button onClick={reset} style={{padding:"8px 16px",borderRadius:8,border:"1px solid rgba(0,0,0,0.12)",background:"white",color:"#6b6b6b",cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>✕ Сбросить</button>}
        <span style={{fontSize:13,color:"#6b6b6b",marginLeft:"auto"}}>Найдено: {filtered.length}</span>
      </div>
      {loading && <Spinner />}
      {error && <div className="alert alert-error">⚠ {error}</div>}
      {!loading && !error && filtered.length === 0 && (
        <div className="empty"><div className="empty-icon">📭</div><h3>Ничего не найдено</h3><p style={{marginBottom:16}}>Попробуйте изменить фильтры</p><button onClick={reset} style={{padding:"9px 20px",borderRadius:8,border:"1px solid rgba(0,0,0,0.12)",background:"white",cursor:"pointer",fontFamily:"inherit"}}>Сбросить фильтры</button></div>
      )}
      {!loading && !error && <div className="grid">{filtered.map(c => <CourseCard key={c.id} course={c} />)}</div>}
    </div>
  );
}
