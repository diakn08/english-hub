import { useState, useEffect } from "react";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useRouter } from "../context/RouterContext.jsx";
import Spinner from "../components/Spinner.jsx";
import CourseCard from "../components/CourseCard.jsx";

export default function FavoritesPage() {
  const { user } = useAuth();
  const { navigate } = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCourses().then(all => {
      const favIds = api.getFavorites(user.id);
      setCourses(all.filter(c => favIds.includes(c.id)));
      setLoading(false);
    });
  }, [user.id]);

  const handleRemove = (courseId) => {
    api.toggleFavorite(user.id, courseId);
    setCourses(prev => prev.filter(c => c.id !== courseId));
  };

  if (loading) return <div className="page"><Spinner /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <p className="section-title" style={{margin:0}}>★ Избранное</p>
        <button className="back-btn" style={{margin:0}} onClick={() => navigate("/dashboard")}>← Дашборд</button>
      </div>
      {courses.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">☆</div>
          <h3>Избранное пусто</h3>
          <p style={{marginBottom:20}}>Добавляйте курсы в избранное, нажав ★ на странице курса</p>
          <button className="create-btn" onClick={() => navigate("/courses")}>Смотреть курсы</button>
        </div>
      ) : (
        <>
          <p style={{color:"#6b6b6b",marginBottom:24,fontSize:14}}>{courses.length} курс(ов) в избранном</p>
          <div className="grid">
            {courses.map(c => (
              <div key={c.id} style={{position:"relative"}}>
                <CourseCard course={c} />
                <button onClick={() => handleRemove(c.id)} style={{position:"absolute",top:12,right:12,width:28,height:28,borderRadius:"50%",border:"1px solid rgba(0,0,0,0.12)",background:"white",cursor:"pointer",fontSize:14,color:"#ba7517",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2}}>★</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
