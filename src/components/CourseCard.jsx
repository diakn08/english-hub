import { useRouter } from "../context/RouterContext.jsx";

const LC = { A1:{bg:"#eaf3de",color:"#3b6d11"}, A2:{bg:"#eaf3de",color:"#3b6d11"}, B1:{bg:"#e6f1fb",color:"#185fa5"}, B2:{bg:"#e6f1fb",color:"#185fa5"}, C1:{bg:"#faeeda",color:"#ba7517"}, C2:{bg:"#faeeda",color:"#ba7517"} };

export default function CourseCard({ course }) {
  const { navigate } = useRouter();
  const lc = LC[course.level] || { bg:"#f8f7f4", color:"#6b6b6b" };
  return (
    <div className="card" onClick={() => navigate(`/courses/${course.id}`)}>
      <div className="card-header">
        <span className="badge" style={{background:lc.bg,color:lc.color}}>{course.level}</span>
        <span className="cat-badge">{course.category}</span>
      </div>
      <div className="card-title">{course.title}</div>
      <div className="card-desc">{course.description}</div>
      <div className="card-footer">
        <span>📖 {course.lessons} уроков</span>
        {course.rating > 0 && <span className="rating">★ {course.rating}</span>}
      </div>
    </div>
  );
}
