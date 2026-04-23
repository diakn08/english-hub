import { useRouter } from "../context/RouterContext.jsx";

export default function NotFoundPage({ path }) {
  const { navigate } = useRouter();

  return (
    <div className="page" style={{ textAlign: "center", padding: "80px 24px" }}>
      <div style={{ fontSize: 96, marginBottom: 16, lineHeight: 1 }}>🔍</div>

      <div
        style={{
          display: "inline-block",
          background: "#fcebeb",
          color: "#a32d2d",
          fontFamily: "monospace",
          fontSize: 13,
          padding: "4px 14px",
          borderRadius: 8,
          marginBottom: 24,
          wordBreak: "break-all",
          maxWidth: 400,
        }}
      >
        {path || "неизвестный адрес"}
      </div>

      <h1
        style={{
          fontFamily: "'Lora', serif",
          fontSize: 40,
          fontWeight: 500,
          marginBottom: 12,
          color: "#1a1a1a",
        }}
      >
        Страница не найдена
      </h1>

      <p
        style={{
          fontSize: 16,
          color: "#6b6b6b",
          maxWidth: 420,
          margin: "0 auto 36px",
          lineHeight: 1.6,
        }}
      >
        Такой страницы не существует. Проверьте адрес или вернитесь на одну из
        доступных страниц.
      </p>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button
          className="btn-primary"
          onClick={() => navigate("/")}
        >
          На главную
        </button>
        <button
          className="btn-outline-white"
          style={{
            border: "1.5px solid rgba(0,0,0,0.18)",
            color: "#1a1a1a",
            background: "white",
          }}
          onClick={() => navigate("/courses")}
        >
          Все курсы
        </button>
        <button
          style={{
            padding: "10px 20px",
            borderRadius: 10,
            border: "1.5px solid rgba(0,0,0,0.12)",
            background: "white",
            color: "#6b6b6b",
            cursor: "pointer",
            fontSize: 15,
            fontFamily: "inherit",
          }}
          onClick={() => window.history.back()}
        >
          ← Назад
        </button>
      </div>

      <div
        style={{
          marginTop: 60,
          padding: "24px 32px",
          background: "white",
          borderRadius: 16,
          border: "1px solid rgba(0,0,0,0.08)",
          display: "inline-block",
          textAlign: "left",
        }}
      >
        <p style={{ fontSize: 13, color: "#6b6b6b", marginBottom: 12, fontWeight: 500 }}>
          Возможно, вы искали:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            ["/", "🏠 Главная"],
            ["/courses", "📚 Каталог курсов"],
            ["/dashboard", "📊 Дашборд"],
            ["/login", "🔑 Войти"],
          ].map(([to, label]) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              style={{
                background: "none",
                border: "none",
                color: "#185fa5",
                cursor: "pointer",
                fontSize: 14,
                textAlign: "left",
                padding: "2px 0",
                fontFamily: "inherit",
                textDecoration: "underline",
                textDecorationColor: "rgba(24,95,165,0.3)",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}