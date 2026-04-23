import { useState, useEffect } from "react";
import api from "../api.js";
import { useRouter } from "../context/RouterContext.jsx";

const LC = { A1:{bg:"#eaf3de",color:"#3b6d11"}, A2:{bg:"#eaf3de",color:"#3b6d11"}, B1:{bg:"#e6f1fb",color:"#185fa5"}, B2:{bg:"#e6f1fb",color:"#185fa5"}, C1:{bg:"#faeeda",color:"#ba7517"}, C2:{bg:"#faeeda",color:"#ba7517"} };

export default function AdminPage() {
  const { navigate } = useRouter();
  const [tab, setTab] = useState("courses");
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cSearch, setCSearch] = useState(""); const [cSort, setCSort] = useState("newest"); const [cCat, setCCat] = useState("Все");
  const [uSearch, setUSearch] = useState(""); const [uRole, setURole] = useState("Все"); const [uSort, setUSort] = useState("newest");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [updatingRole, setUpdatingRole] = useState(null);

  useEffect(() => { Promise.all([api.getCourses(), api.getUsers()]).then(([c,u]) => { setCourses(c); setUsers(u); setLoading(false); }); }, []);

  const filteredCourses = courses
    .filter(c => cCat==="Все" || c.category===cCat)
    .filter(c => !cSearch || c.title.toLowerCase().includes(cSearch.toLowerCase()) || c.author.toLowerCase().includes(cSearch.toLowerCase()))
    .sort((a,b) => { if(cSort==="newest") return new Date(b.createdAt||0)-new Date(a.createdAt||0); if(cSort==="oldest") return new Date(a.createdAt||0)-new Date(b.createdAt||0); if(cSort==="title_az") return a.title.localeCompare(b.title); if(cSort==="rating") return (b.rating||0)-(a.rating||0); return 0; });

  const filteredUsers = users
    .filter(u => uRole==="Все" || u.role===uRole)
    .filter(u => !uSearch || u.name.toLowerCase().includes(uSearch.toLowerCase()) || u.email.toLowerCase().includes(uSearch.toLowerCase()))
    .sort((a,b) => { if(uSort==="newest") return new Date(b.createdAt||0)-new Date(a.createdAt||0); if(uSort==="oldest") return new Date(a.createdAt||0)-new Date(b.createdAt||0); if(uSort==="name_az") return a.name.localeCompare(b.name); return 0; });

  const handleDeleteCourse = async (id) => { await api.deleteCourse(id); setCourses(p=>p.filter(c=>c.id!==id)); setConfirmDelete(null); };
  const handleDeleteUser = async (id) => { await api.deleteUser(id); setUsers(p=>p.filter(u=>u.id!==id)); setConfirmDelete(null); };
  const handleRoleChange = async (userId, role) => { setUpdatingRole(userId); await api.updateUserRole(userId, role); setUsers(p=>p.map(u=>u.id===userId?{...u,role}:u)); setUpdatingRole(null); };

  return (
    <div className="page">
      <div style={{background:"linear-gradient(135deg,#1a1a1a,#3a3a3a)",borderRadius:16,padding:"28px 32px",marginBottom:28,color:"white"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <div>
            <p style={{fontFamily:"'Lora',serif",fontSize:26,fontWeight:500,marginBottom:4}}>⚙ Панель администратора</p>
            <p style={{opacity:0.7,fontSize:14}}>Управление курсами, пользователями и данными приложения</p>
          </div>
          <button className="back-btn" style={{margin:0,background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",color:"white"}} onClick={() => navigate("/dashboard")}>← Дашборд</button>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:14,marginBottom:28}}>
        {[
          {label:"Всего курсов",value:courses.length,icon:"📚",color:"#0d9e75"},
          {label:"Пользователей",value:users.filter(u=>u.role==="user").length,icon:"👤",color:"#185fa5"},
          {label:"Администраторов",value:users.filter(u=>u.role==="admin").length,icon:"🛡",color:"#a32d2d"},
          {label:"Всего уроков",value:courses.reduce((s,c)=>s+(c.lessons||0),0),icon:"📖",color:"#ba7517"},
        ].map(s=>(
          <div key={s.label} style={{background:"white",borderRadius:12,border:"1px solid rgba(0,0,0,0.12)",padding:"16px 20px"}}>
            <div style={{fontSize:22,marginBottom:6}}>{s.icon}</div>
            <div style={{fontSize:24,fontWeight:600,color:s.color}}>{s.value}</div>
            <div style={{fontSize:12,color:"#6b6b6b",marginTop:2}}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:4,marginBottom:24,background:"white",borderRadius:12,border:"1px solid rgba(0,0,0,0.12)",padding:4,width:"fit-content"}}>
        {[["courses","📚 Курсы"],["users","👥 Пользователи"]].map(([key,label])=>(
          <button key={key} onClick={()=>setTab(key)} style={{padding:"9px 24px",borderRadius:9,border:"none",background:tab===key?"#1a1a1a":"transparent",color:tab===key?"white":"#6b6b6b",fontWeight:tab===key?500:400,cursor:"pointer",fontFamily:"inherit",fontSize:14,transition:"all 0.15s"}}>{label}</button>
        ))}
      </div>

      {loading ? <div className="loading"><div className="spinner"/><span className="loading-text">Загрузка...</span></div> : tab==="courses" ? (
        <>
          <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
            <input className="form-input" placeholder="🔍 Поиск..." value={cSearch} onChange={e=>setCSearch(e.target.value)} style={{maxWidth:260}}/>
            <select className="form-select" value={cCat} onChange={e=>setCCat(e.target.value)} style={{width:"auto",padding:"10px 14px"}}>
              {["Все","Speaking","Grammar","Business","Exam Prep","Writing","Listening"].map(c=><option key={c}>{c}</option>)}
            </select>
            <select className="form-select" value={cSort} onChange={e=>setCSort(e.target.value)} style={{width:"auto",padding:"10px 14px"}}>
              <option value="newest">Сначала новые</option><option value="oldest">Сначала старые</option><option value="title_az">По названию</option><option value="rating">По рейтингу</option>
            </select>
            <span style={{fontSize:13,color:"#6b6b6b",marginLeft:"auto"}}>Найдено: {filteredCourses.length}</span>
          </div>
          <div style={{background:"white",borderRadius:14,border:"1px solid rgba(0,0,0,0.12)",overflow:"hidden"}}>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
                <thead><tr style={{background:"#f8f7f4",borderBottom:"1px solid rgba(0,0,0,0.08)"}}>
                  {["Курс","Уровень","Категория","Уроков","Автор","Дата","Действия"].map(h=><th key={h} style={{padding:"12px 16px",textAlign:"left",fontWeight:500,color:"#6b6b6b",whiteSpace:"nowrap"}}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {filteredCourses.map((c,i)=>{
                    const lc = LC[c.level]||{bg:"#f8f7f4",color:"#6b6b6b"};
                    return <tr key={c.id} style={{borderBottom:"1px solid rgba(0,0,0,0.06)",background:i%2===0?"white":"#fafaf9"}}>
                      <td style={{padding:"12px 16px",fontWeight:500,maxWidth:200}}><span style={{cursor:"pointer",color:"#185fa5"}} onClick={()=>navigate(`/courses/${c.id}`)}>{c.title}</span></td>
                      <td style={{padding:"12px 16px"}}><span className="badge" style={{background:lc.bg,color:lc.color}}>{c.level}</span></td>
                      <td style={{padding:"12px 16px",color:"#6b6b6b"}}>{c.category}</td>
                      <td style={{padding:"12px 16px"}}>{c.lessons}</td>
                      <td style={{padding:"12px 16px",color:"#6b6b6b"}}>{c.author}</td>
                      <td style={{padding:"12px 16px",color:"#6b6b6b",whiteSpace:"nowrap"}}>{c.createdAt||"—"}</td>
                      <td style={{padding:"12px 16px"}}>
                        <div style={{display:"flex",gap:6}}>
                          <button onClick={()=>navigate(`/edit/${c.id}`)} style={{padding:"5px 10px",borderRadius:6,border:"1px solid #b5d4f4",background:"#e6f1fb",color:"#185fa5",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>✏</button>
                          <button onClick={()=>setConfirmDelete({type:"course",id:c.id,name:c.title})} style={{padding:"5px 10px",borderRadius:6,border:"1px solid #f09595",background:"#fcebeb",color:"#a32d2d",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>🗑</button>
                        </div>
                      </td>
                    </tr>;
                  })}
                </tbody>
              </table>
              {filteredCourses.length===0 && <div style={{padding:32,textAlign:"center",color:"#6b6b6b"}}>Курсы не найдены</div>}
            </div>
          </div>
        </>
      ) : (
        <>
          <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
            <input className="form-input" placeholder="🔍 Поиск..." value={uSearch} onChange={e=>setUSearch(e.target.value)} style={{maxWidth:260}}/>
            <select className="form-select" value={uRole} onChange={e=>setURole(e.target.value)} style={{width:"auto",padding:"10px 14px"}}>
              <option value="Все">Все роли</option><option value="admin">Администраторы</option><option value="user">Пользователи</option>
            </select>
            <select className="form-select" value={uSort} onChange={e=>setUSort(e.target.value)} style={{width:"auto",padding:"10px 14px"}}>
              <option value="newest">Сначала новые</option><option value="oldest">Сначала старые</option><option value="name_az">По имени</option>
            </select>
            <span style={{fontSize:13,color:"#6b6b6b",marginLeft:"auto"}}>Найдено: {filteredUsers.length}</span>
          </div>
          <div style={{background:"white",borderRadius:14,border:"1px solid rgba(0,0,0,0.12)",overflow:"hidden"}}>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
                <thead><tr style={{background:"#f8f7f4",borderBottom:"1px solid rgba(0,0,0,0.08)"}}>
                  {["Пользователь","Email","Роль","Дата регистрации","Действия"].map(h=><th key={h} style={{padding:"12px 16px",textAlign:"left",fontWeight:500,color:"#6b6b6b",whiteSpace:"nowrap"}}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {filteredUsers.map((u,i)=>(
                    <tr key={u.id} style={{borderBottom:"1px solid rgba(0,0,0,0.06)",background:i%2===0?"white":"#fafaf9"}}>
                      <td style={{padding:"12px 16px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <div style={{width:32,height:32,borderRadius:"50%",background:u.role==="admin"?"#1a1a1a":"#0d9e75",color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:600,flexShrink:0}}>{u.name[0].toUpperCase()}</div>
                          <span style={{fontWeight:500}}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{padding:"12px 16px",color:"#6b6b6b"}}>{u.email}</td>
                      <td style={{padding:"12px 16px"}}>
                        <select value={u.role} onChange={e=>handleRoleChange(u.id,e.target.value)} disabled={updatingRole===u.id} style={{padding:"4px 10px",borderRadius:8,border:"1.5px solid",borderColor:u.role==="admin"?"#f09595":"rgba(0,0,0,0.12)",background:u.role==="admin"?"#fcebeb":"#e1f5ee",color:u.role==="admin"?"#a32d2d":"#085041",fontWeight:500,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
                          <option value="user">user</option><option value="admin">admin</option>
                        </select>
                      </td>
                      <td style={{padding:"12px 16px",color:"#6b6b6b"}}>{u.createdAt||"—"}</td>
                      <td style={{padding:"12px 16px"}}>
                        <button onClick={()=>setConfirmDelete({type:"user",id:u.id,name:u.name})} disabled={u.role==="admin"} style={{padding:"5px 12px",borderRadius:6,border:"1px solid #f09595",background:u.role==="admin"?"#f8f7f4":"#fcebeb",color:u.role==="admin"?"#ccc":"#a32d2d",cursor:u.role==="admin"?"not-allowed":"pointer",fontSize:12,fontFamily:"inherit"}}>🗑 Удалить</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length===0 && <div style={{padding:32,textAlign:"center",color:"#6b6b6b"}}>Пользователи не найдены</div>}
            </div>
          </div>
        </>
      )}

      {confirmDelete && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}}>
          <div style={{background:"white",borderRadius:16,padding:32,maxWidth:400,width:"90%",textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:12}}>⚠️</div>
            <p style={{fontWeight:600,fontSize:18,marginBottom:8}}>Удалить {confirmDelete.type==="course"?"курс":"пользователя"}?</p>
            <p style={{color:"#6b6b6b",fontSize:14,marginBottom:24}}>«{confirmDelete.name}» будет удалён навсегда.</p>
            <div style={{display:"flex",gap:12,justifyContent:"center"}}>
              <button onClick={()=>setConfirmDelete(null)} style={{padding:"10px 24px",borderRadius:8,border:"1px solid rgba(0,0,0,0.12)",background:"white",cursor:"pointer",fontFamily:"inherit",fontSize:14}}>Отмена</button>
              <button onClick={()=>confirmDelete.type==="course"?handleDeleteCourse(confirmDelete.id):handleDeleteUser(confirmDelete.id)} style={{padding:"10px 24px",borderRadius:8,border:"none",background:"#a32d2d",color:"white",cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:500}}>Да, удалить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
