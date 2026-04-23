import { useState } from "react";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useRouter } from "../context/RouterContext.jsx";

export default function ProfilePage() {
  const { user, updateUser, logout, isAdmin } = useAuth();
  const { navigate } = useRouter();
  const [form, setForm] = useState({ name:user.name, email:user.email, password:"", confirm:"" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tab, setTab] = useState("info");
  const set = k => e => setForm(f => ({...f,[k]:e.target.value}));

  const handleSave = async () => {
    if (!form.name.trim()||!form.email.trim()) return setError("Имя и email обязательны");
    if (form.password && form.password !== form.confirm) return setError("Пароли не совпадают");
    if (form.password && form.password.length<6) return setError("Пароль минимум 6 символов");
    setSaving(true); setError(""); setSuccess("");
    try { const u = await api.updateProfile(user.id, {name:form.name,email:form.email,password:form.password||undefined}); updateUser(u); setSuccess("Профиль обновлён!"); setForm(f=>({...f,password:"",confirm:""})); }
    catch(err) { setError(err.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="page">
      <button className="back-btn" onClick={() => navigate("/dashboard")}>← Дашборд</button>
      <div style={{maxWidth:600,margin:"0 auto"}}>
        <div style={{background:"white",borderRadius:16,border:"1px solid rgba(0,0,0,0.12)",padding:32,marginBottom:20,display:"flex",alignItems:"center",gap:20}}>
          <div style={{width:72,height:72,borderRadius:"50%",background:isAdmin?"#1a1a1a":"#0d9e75",color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,fontWeight:600,flexShrink:0}}>{user.name[0].toUpperCase()}</div>
          <div>
            <div style={{fontWeight:600,fontSize:20,marginBottom:4}}>{user.name}</div>
            <div style={{color:"#6b6b6b",fontSize:14}}>{user.email}</div>
            <div style={{fontSize:12,marginTop:4,fontWeight:500,color:isAdmin?"#a32d2d":"#0d9e75"}}>{isAdmin?"Администратор":"Пользователь"} EnglishHub</div>
          </div>
        </div>
        <div style={{display:"flex",gap:4,marginBottom:20,background:"white",borderRadius:12,border:"1px solid rgba(0,0,0,0.12)",padding:4}}>
          {[["info","Личные данные"],["security","Безопасность"]].map(([key,label]) => (
            <button key={key} onClick={() => setTab(key)} style={{flex:1,padding:"8px 16px",borderRadius:8,border:"none",background:tab===key?"#e1f5ee":"transparent",color:tab===key?"#085041":"#6b6b6b",fontWeight:tab===key?500:400,cursor:"pointer",fontFamily:"inherit",fontSize:14,transition:"all 0.15s"}}>{label}</button>
          ))}
        </div>
        <div style={{background:"white",borderRadius:16,border:"1px solid rgba(0,0,0,0.12)",padding:32}}>
          {error && <div className="alert alert-error">⚠ {error}</div>}
          {success && <div className="alert alert-success">✓ {success}</div>}
          {tab==="info" && <>
            <div className="form-group"><label className="form-label">Имя</label><input className="form-input" value={form.name} onChange={set("name")} /></div>
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.email} onChange={set("email")} /></div>
            <button className="submit-btn" onClick={handleSave} disabled={saving}>{saving?"Сохранение...":"Сохранить изменения"}</button>
          </>}
          {tab==="security" && <>
            <p style={{fontSize:14,color:"#6b6b6b",marginBottom:20}}>Оставьте поля пустыми, если не хотите менять пароль</p>
            <div className="form-group"><label className="form-label">Новый пароль</label><input className="form-input" type="password" placeholder="Минимум 6 символов" value={form.password} onChange={set("password")} /></div>
            <div className="form-group"><label className="form-label">Повторите пароль</label><input className="form-input" type="password" placeholder="••••••••" value={form.confirm} onChange={set("confirm")} /></div>
            <button className="submit-btn" onClick={handleSave} disabled={saving}>{saving?"Сохранение...":"Обновить пароль"}</button>
          </>}
          <div style={{marginTop:24,paddingTop:24,borderTop:"1px solid rgba(0,0,0,0.08)"}}>
            <button onClick={() => { logout(); navigate("/"); }} style={{width:"100%",padding:12,borderRadius:10,border:"1px solid #f09595",background:"#fcebeb",color:"#a32d2d",cursor:"pointer",fontFamily:"inherit",fontSize:15,fontWeight:500}}>Выйти из аккаунта</button>
          </div>
        </div>
      </div>
    </div>
  );
}
