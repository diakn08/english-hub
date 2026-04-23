import { useRouter } from "../context/RouterContext.jsx";

export default function HomePage() {
  const { navigate } = useRouter();
  return (
    <>
      <div className="hero">
        <div className="hero-inner">
          <h1>Учи английский с удовольствием</h1>
          <p>Более 30 курсов для всех уровней — от A1 до C2. Начни бесплатно уже сегодня.</p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => navigate("/courses")}>Смотреть курсы</button>
            <button className="btn-outline-white" onClick={() => navigate("/register")}>Начать бесплатно</button>
          </div>
        </div>
      </div>
      <div className="stats-bar">
        {[["12 000+","студентов"],["30+","курсов"],["6","уровней CEFR"],["4.8 ★","средний рейтинг"]].map(([n,l]) => (
          <div className="stat" key={l}><div className="stat-num">{n}</div><div className="stat-lbl">{l}</div></div>
        ))}
      </div>
      <div className="page">
        <p className="section-title">Почему EnglishHub?</p>
        <div className="features">
          {[
            ["📚","Структурированная программа","Курсы выстроены по системе CEFR от A1 до C2. Ты всегда знаешь, на каком уровне находишься и что изучать дальше."],
            ["🎯","Практические задания","Реальные диалоги, деловые письма, подготовка к экзаменам — всё, что нужно для жизни и работы."],
            ["🌐","Учись в своём темпе","Никаких дедлайнов. Возвращайся к урокам когда удобно — материалы всегда доступны на любом устройстве."],
          ].map(([icon,title,text]) => (
            <div className="feature-card" key={title}>
              <div className="feature-icon">{icon}</div>
              <div className="feature-title">{title}</div>
              <div className="feature-text">{text}</div>
            </div>
          ))}
        </div>
        <div style={{background:"#085041",borderRadius:20,padding:"48px 40px",color:"white",textAlign:"center",marginTop:48}}>
          <p style={{fontFamily:"'Lora',serif",fontSize:28,marginBottom:12}}>Готов начать?</p>
          <p style={{opacity:0.8,marginBottom:24}}>Зарегистрируйся бесплатно и открой доступ ко всем курсам</p>
          <button className="btn-primary" onClick={() => navigate("/register")}>Создать аккаунт →</button>
        </div>
      </div>
    </>
  );
}
