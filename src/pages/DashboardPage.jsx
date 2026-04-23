import { useState, useEffect } from "react";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useRouter } from "../context/RouterContext.jsx";
import Spinner from "../components/Spinner.jsx";

const LC = { A1:{bg:"#eaf3de",color:"#3b6d11"}, A2:{bg:"#eaf3de",color:"#3b6d11"}, B1:{bg:"#e6f1fb",color:"#185fa5"}, B2:{bg:"#e6f1fb",color:"#185fa5"}, C1:{bg:"#faeeda",color:"#ba7517"}, C2:{bg:"#faeeda",color:"#ba7517"} };

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const { navigate } = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.getCourses().then(c => { setCourses(c); setLoading(false); }); }, []);

  const myCourses = courses.filter(c => c.authorId === user.id || c.author === user.name);
  const favIds = api.getFavorites(user.id);
  const favCourses = courses.filter(c => favIds.includes(c.id));

  if (loading) return <div className="page"><Spinner /></div>;

  return (
    <div className="page">
      <div style={{marginBottom:32}}>
        <p className="section-title" style={{marginBottom:4}}>Дашборд</p>
        <p style={{color:"#6b6b6b",fontSize:15}}>Добро пожаловать, {user.name}! {isAdmin && <span style={{background:"#fcebeb",color:"#a32d2d",padding:"2px 10px",borderRadius:10,fontSize:12,fontWeight:600,marginLeft:8}}>ADMIN</span>}</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:16,marginBottom:40}}>
        {[
          {label:"Моих курсов",value:myCourses.length,icon:"📚",color:"#0d9e75"},
          {label:"В избранном",value:favCourses.length,icon:"★",color:"#ba7517"},
          {label:"Всего курсов",value:courses.length,icon:"🌐",color:"#185fa5"},
          {label:"Уроков создано",value:myCourses.reduce((s,c)=>s+c.lessons,0),icon:"📖",color:"#6b6b6b"},
        ].map(s => (
          <div key={s.label} style={{background:"white",borderRadius:14,border:"1px solid rgba(0,0,0,0.12)",padding:"20px 24px"}}>
            <div style={{fontSize:26,marginBottom:8}}>{s.icon}</div>
            <div style={{fontSize:26,fontWeight:600,color:s.color}}>{s.value}</div>
            <div style={{fontSize:13,color:"#6b6b6b",marginTop:2}}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{background:"white",borderRadius:14,border:"1px solid rgba(0,0,0,0.12)",padding:24,marginBottom:32}}>
        <p style={{fontWeight:600,marginBottom:16}}>Быстрые действия</p>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {[
            ["/create","+ Создать курс","create-btn"],
            ["/courses","Все курсы",""],
            ["/my-courses","Мои курсы",""],
            ["/favorites","★ Избранное",""],
            ["/profile","Профиль",""],
            ...(isAdmin ? [["/admin","⚙ Админка",""]] : []),
          ].map(([to, label, cls]) => (
            cls === "create-btn"
              ? <button key={to} className="create-btn" onClick={() => navigate(to)}>{label}</button>
              : <button key={to} onClick={() => navigate(to)} style={{padding:"10px 20px",borderRadius:10,border:"1.5px solid rgba(0,0,0,0.12)",background:"white",color:"#1a1a1a",cursor:"pointer",fontSize:14,fontFamily:"inherit",fontWeight:500,transition:"all 0.15s"}}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{marginBottom:40}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <p style={{fontWeight:600,fontSize:18}}>Мои курсы ({myCourses.length})</p>
          <button onClick={() => navigate("/my-courses")} style={{fontSize:13,color:"#0d9e75",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>Смотреть все →</button>
        </div>
        {myCourses.length === 0 ? (
          <div style={{background:"white",borderRadius:14,border:"1px solid rgba(0,0,0,0.12)",padding:32,textAlign:"center",color:"#6b6b6b"}}>
            <div style={{fontSize:32,marginBottom:8}}>📭</div>
            <p>Вы ещё не создали ни одного курса</p>
            <button className="create-btn" style={{marginTop:16}} onClick={() => navigate("/create")}>+ Создать первый курс</button>
          </div>
        ) : (
          <div className="grid">
            {myCourses.slice(0,3).map(c => {
              const lc = LC[c.level] || {bg:"#f8f7f4",color:"#6b6b6b"};
              return (
                <div key={c.id} className="card" onClick={() => navigate(`/courses/${c.id}`)}>
                  <div className="card-header">
                    <span className="badge" style={{background:lc.bg,color:lc.color}}>{c.level}</span>
                    <span className="cat-badge">{c.category}</span>
                  </div>
                  <div className="card-title">{c.title}</div>
                  <div className="card-footer">
                    <span>📖 {c.lessons} уроков</span>
                    <span style={{fontSize:12,color:"#185fa5",cursor:"pointer"}} onClick={e=>{e.stopPropagation();navigate(`/edit/${c.id}`);}}>✏ Изменить</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {favCourses.length > 0 && (
        <div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <p style={{fontWeight:600,fontSize:18}}>★ Избранное ({favCourses.length})</p>
            <button onClick={() => navigate("/favorites")} style={{fontSize:13,color:"#0d9e75",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>Смотреть все →</button>
          </div>
          <div className="grid">
            {favCourses.slice(0,3).map(c => {
              const lc = LC[c.level] || {bg:"#f8f7f4",color:"#6b6b6b"};
              return (
                <div key={c.id} className="card" onClick={() => navigate(`/courses/${c.id}`)}>
                  <div className="card-header"><span className="badge" style={{background:lc.bg,color:lc.color}}>{c.level}</span><span style={{color:"#ba7517"}}>★</span></div>
                  <div className="card-title">{c.title}</div>
                  <div className="card-footer"><span>📖 {c.lessons} уроков</span></div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
