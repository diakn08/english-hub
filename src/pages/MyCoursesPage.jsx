import { useState, useEffect } from "react";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useRouter } from "../context/RouterContext.jsx";
import Spinner from "../components/Spinner.jsx";

const LC = { A1:{bg:"#eaf3de",color:"#3b6d11"}, A2:{bg:"#eaf3de",color:"#3b6d11"}, B1:{bg:"#e6f1fb",color:"#185fa5"}, B2:{bg:"#e6f1fb",color:"#185fa5"}, C1:{bg:"#faeeda",color:"#ba7517"}, C2:{bg:"#faeeda",color:"#ba7517"} };

export default function MyCoursesPage() {
  const { user } = useAuth();
  const { navigate } = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    api.getCourses().then(all => {
      setCourses(all.filter(c => c.authorId === user.id || c.author === user.name));
      setLoading(false);
    });
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить этот курс?")) return;
    setDeleting(id);
    await api.deleteCourse(id);
    setCourses(prev => prev.filter(c => c.id !== id));
    setDeleting(null);
  };

  if (loading) return <div className="page"><Spinner /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <p className="section-title" style={{margin:0}}>Мои курсы</p>
        <div style={{display:"flex",gap:8}}>
          <button className="back-btn" style={{margin:0}} onClick={() => navigate("/dashboard")}>← Дашборд</button>
          <button className="create-btn" onClick={() => navigate("/create")}>+ Создать</button>
        </div>
      </div>
      {courses.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📭</div>
          <h3>У вас ещё нет курсов</h3>
          <p style={{marginBottom:20}}>Создайте первый курс для студентов</p>
          <button className="create-btn" onClick={() => navigate("/create")}>+ Создать курс</button>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {courses.map(c => {
            const lc = LC[c.level] || {bg:"#f8f7f4",color:"#6b6b6b"};
            return (
              <div key={c.id} style={{background:"white",borderRadius:14,border:"1px solid rgba(0,0,0,0.12)",padding:"18px 24px",display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
                <span className="badge" style={{background:lc.bg,color:lc.color,flexShrink:0}}>{c.level}</span>
                <div style={{flex:1,minWidth:180}}>
                  <div style={{fontWeight:600,marginBottom:4,cursor:"pointer"}} onClick={() => navigate(`/courses/${c.id}`)}>{c.title}</div>
                  <div style={{fontSize:13,color:"#6b6b6b"}}>{c.category} · {c.lessons} уроков</div>
                </div>
                <div style={{display:"flex",gap:8,flexShrink:0}}>
                  <button onClick={() => navigate(`/courses/${c.id}`)} style={{padding:"7px 14px",borderRadius:8,border:"1px solid rgba(0,0,0,0.12)",background:"white",color:"#6b6b6b",cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>Открыть</button>
                  <button onClick={() => navigate(`/edit/${c.id}`)} style={{padding:"7px 14px",borderRadius:8,border:"1px solid #b5d4f4",background:"#e6f1fb",color:"#185fa5",cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>✏ Изменить</button>
                  <button onClick={() => handleDelete(c.id)} disabled={deleting===c.id} style={{padding:"7px 14px",borderRadius:8,border:"1px solid #f09595",background:"#fcebeb",color:"#a32d2d",cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>{deleting===c.id?"...":"🗑 Удалить"}</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
