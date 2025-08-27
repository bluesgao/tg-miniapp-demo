import React, { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const tg = window.Telegram.WebApp;

    // 让小程序自动全屏展开
    tg.expand();

    // 获取用户信息
    if (tg.initDataUnsafe?.user) {
      setUser(tg.initDataUnsafe.user);
    }

    // 获取主题
    setTheme(tg.colorScheme);

    // 监听主题变化
    tg.onEvent("themeChanged", () => {
      setTheme(tg.colorScheme);
    });
  }, []);

  return (
    <div
      style={{
        backgroundColor: theme === "dark" ? "#222" : "#fff",
        color: theme === "dark" ? "#fff" : "#000",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <h2>🚀 Telegram MiniApp Demo (React)</h2>
      {user ? (
        <div>
          <p>Hello, <b>{user.first_name}</b>!</p>
          {user.username && <p>@{user.username}</p>}
          <p>User ID: {user.id}</p>
        </div>
      ) : (
        <p>未获取到用户信息</p>
      )}

      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: theme === "dark" ? "#4CAF50" : "#007BFF",
          color: "#fff",
          fontSize: "16px"
        }}
        onClick={() => window.Telegram.WebApp.close()}
      >
        关闭小程序
      </button>
    </div>
  );
}

export default App;