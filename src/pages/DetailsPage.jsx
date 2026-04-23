import { useState, useEffect } from "react";
import api from "../api.js";
import { useRouter } from "../context/RouterContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Spinner from "../components/Spinner.jsx";

const LC = { A1:{bg:"#eaf3de",color:"#3b6d11"}, A2:{bg:"#eaf3de",color:"#3b6d11"}, B1:{bg:"#e6f1fb",color:"#185fa5"}, B2:{bg:"#e6f1fb",color:"#185fa5"}, C1:{bg:"#faeeda",color:"#ba7517"}, C2:{bg:"#faeeda",color:"#ba7517"} };
const LESSONS = ["Введение в курс","Базовая лексика","Произношение","Грамматика: основы","Диалоги и разговорные фразы","Чтение и понимание текста","Письменные упражнения","Аудирование","Грамматика: продвинутый уровень","Практика разговорной речи","Деловая лексика","Финальный тест"];

export default function DetailsPage({ id }) {
  const { navigate } = useRouter();
  const { user, isAdmin } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolled, setEnrolled] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.getCourse(id).then(c => { if(!c) setError("Курс не найден"); else { setCourse(c); if(user) setIsFav(api.isFavorite(user.id,c.id)); } }).catch(() => setError("Ошибка загрузки")).finally(() => setLoading(false));
  }, [id, user]);

  const isOwner = user && course && (user.id === course.authorId || user.name === course.author || isAdmin);
  const handleFav = () => { if(!user) return navigate("/login"); setIsFav(api.toggleFavorite(user.id, course.id)); };
  const handleDelete = async () => { setDeleting(true); await api.deleteCourse(course.id); navigate("/courses"); };

  if (loading) return <div className="page"><Spinner /></div>;
  if (error) return <div className="page"><div className="alert alert-error">⚠ {error}</div><button className="back-btn" onClick={() => navigate("/courses")}>← Назад</button></div>;
  if (!course) return null;

  const lc = LC[course.level] || {bg:"#f8f7f4",color:"#6b6b6b"};
  const lessons = Array.from({length:Math.min(course.lessons,12)},(_,i)=>({num:i+1,name:LESSONS[i]||`Урок ${i+1}`}));

  return (
    <div className="page">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginBottom:20}}>
        <button className="back-btn" style={{margin:0}} onClick={() => navigate("/courses")}>← Назад к курсам</button>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <button onClick={handleFav} style={{padding:"8px 16px",borderRadius:8,border:"1px solid rgba(0,0,0,0.12)",background:isFav?"#faeeda":"white",color:isFav?"#ba7517":"#6b6b6b",cursor:"pointer",fontSize:14,fontFamily:"inherit"}}>
            {isFav ? "★ В избранном" : "☆ В избранное"}
          </button>
          {isOwner && <>
            <button onClick={() => navigate(`/edit/${course.id}`)} style={{padding:"8px 16px",borderRadius:8,border:"1px solid #b5d4f4",background:"#e6f1fb",color:"#185fa5",cursor:"pointer",fontSize:14,fontFamily:"inherit"}}>✏ Редактировать</button>
            <button onClick={() => setShowConfirm(true)} style={{padding:"8px 16px",borderRadius:8,border:"1px solid #f09595",background:"#fcebeb",color:"#a32d2d",cursor:"pointer",fontSize:14,fontFamily:"inherit"}}>🗑 Удалить</button>
          </>}
        </div>
      </div>

      {showConfirm && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}}>
          <div style={{background:"white",borderRadius:16,padding:32,maxWidth:400,width:"90%",textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:12}}>⚠️</div>
            <p style={{fontWeight:600,fontSize:18,marginBottom:8}}>Удалить курс?</p>
            <p style={{color:"#6b6b6b",fontSize:14,marginBottom:24}}>«{course.title}» будет удалён навсегда.</p>
            <div style={{display:"flex",gap:12,justifyContent:"center"}}>
              <button onClick={() => setShowConfirm(false)} style={{padding:"10px 24px",borderRadius:8,border:"1px solid rgba(0,0,0,0.12)",background:"white",cursor:"pointer",fontFamily:"inherit",fontSize:14}}>Отмена</button>
              <button onClick={handleDelete} disabled={deleting} style={{padding:"10px 24px",borderRadius:8,border:"none",background:"#a32d2d",color:"white",cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:500}}>{deleting?"Удаление...":"Да, удалить"}</button>
            </div>
          </div>
        </div>
      )}

      <div className="detail-grid">
        <div>
          <div className="detail-hero">
            <div className="detail-meta">
              <span className="badge" style={{background:lc.bg,color:lc.color}}>{course.level}</span>
              <span className="cat-badge">{course.category}</span>
              {course.rating>0 && <span style={{fontSize:14,color:"#ba7517"}}>★ {course.rating}</span>}
            </div>
            <div className="detail-title">{course.title}</div>
            <div className="detail-desc">{course.description}</div>
          </div>
          <div style={{background:"white",borderRadius:14,border:"1px solid rgba(0,0,0,0.12)",padding:28,marginBottom:24}}>
            <p style={{fontWeight:600,marginBottom:16}}>Чему вы научитесь</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {["Читать и понимать тексты","Говорить уверенно","Писать грамотно","Понимать носителей языка","Использовать в профессии","Сдавать международные экзамены"].map(s => (
                <div key={s} style={{display:"flex",gap:8,fontSize:14,color:"#6b6b6b"}}><span style={{color:"#0d9e75"}}>✓</span>{s}</div>
              ))}
            </div>
          </div>
          <div className="lessons-list">
            <p style={{fontWeight:600,marginBottom:16}}>Программа курса ({course.lessons} уроков)</p>
            {lessons.map(l => <div className="lesson-item" key={l.num}><div className="lesson-num">{l.num}</div><span>{l.name}</span></div>)}
            {course.lessons>12 && <div style={{textAlign:"center",paddingTop:12,color:"#6b6b6b",fontSize:14}}>и ещё {course.lessons-12} уроков...</div>}
          </div>
        </div>
        <div className="detail-sidebar">
          <p style={{fontWeight:600,marginBottom:16,fontSize:18}}>О курсе</p>
          {[["Уровень",course.level],["Уроков",course.lessons],["Категория",course.category],["Автор",course.author]].map(([k,v]) => (
            <div className="sidebar-stat" key={k}><span style={{color:"#6b6b6b"}}>{k}</span><strong>{v}</strong></div>
          ))}
          {course.rating>0 && <div className="sidebar-stat"><span style={{color:"#6b6b6b"}}>Рейтинг</span><strong style={{color:"#ba7517"}}>★ {course.rating}</strong></div>}
          {enrolled ? (
            <div className="alert alert-success" style={{marginTop:20,justifyContent:"center"}}>✓ Вы записаны!</div>
          ) : user ? (
            <button className="enroll-btn" onClick={() => setEnrolled(true)}>Записаться на курс</button>
          ) : (
            <>
              <button className="enroll-btn" onClick={() => navigate("/register")}>Зарегистрироваться</button>
              <p style={{textAlign:"center",fontSize:13,color:"#6b6b6b",marginTop:12}}>Уже есть аккаунт? <span style={{color:"#0d9e75",cursor:"pointer"}} onClick={() => navigate("/login")}>Войти</span></p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
