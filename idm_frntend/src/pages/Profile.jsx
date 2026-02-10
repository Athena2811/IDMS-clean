import { useEffect, useState } from "react";

export default function Profile() {
  // USER INFO (static for now – later can come from backend)
  const user = {
    username: localStorage.getItem("username") || "User",
    email: localStorage.getItem("email") || "user@example.com",
    account: "Free",
  };

  // SETTINGS STATE
  const [settings, setSettings] = useState({
    theme: "dark",
    accent: "green",
    aiQuality: "balanced",
    notify: false,
    voice: true,
  });

  // LOAD SAVED SETTINGS
  useEffect(() => {
    const saved = localStorage.getItem("settings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  // APPLY SETTINGS TO UI
  useEffect(() => {
    // THEME
    if (settings.theme === "dark") {
      document.body.style.backgroundColor = "#1e1e1e";
      document.body.style.color = "#ffffff";
    } else {
      document.body.style.backgroundColor = "#ffffff";
      document.body.style.color = "#000000";
    }

    // ACCENT COLOR
    document.documentElement.style.setProperty(
      "--accent-color",
      settings.accent
    );

    // SAVE SETTINGS
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Profile</h2>

      {/* USER INFO */}
      <p><b>Username:</b> {user.username}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Account:</b> {user.account}</p>

      <hr />

      {/* SETTINGS */}
      <h3>Settings</h3>

      {/* THEME */}
      <label>
        Theme Mode:{" "}
        <select
          value={settings.theme}
          onChange={(e) =>
            setSettings({ ...settings, theme: e.target.value })
          }
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </label>

      <br /><br />

      {/* ACCENT */}
      <label>
        Accent Color:{" "}
        <select
          value={settings.accent}
          onChange={(e) =>
            setSettings({ ...settings, accent: e.target.value })
          }
        >
          <option value="green">Green</option>
          <option value="blue">Blue</option>
          <option value="purple">Purple</option>
          <option value="orange">Orange</option>
        </select>
      </label>

      <br /><br />

      {/* AI QUALITY */}
      <label>
        AI Quality:{" "}
        <select
          value={settings.aiQuality}
          onChange={(e) =>
            setSettings({ ...settings, aiQuality: e.target.value })
          }
        >
          <option value="fast">Fast</option>
          <option value="balanced">Balanced</option>
          <option value="high">High</option>
        </select>
      </label>

      <br /><br />

      {/* NOTIFICATIONS */}
      <label>
        <input
          type="checkbox"
          checked={settings.notify}
          onChange={(e) =>
            setSettings({ ...settings, notify: e.target.checked })
          }
        />
        Notify when design is ready
      </label>

      <br /><br />

      {/* VOICE */}
      <label>
        <input
          type="checkbox"
          checked={settings.voice}
          onChange={(e) =>
            setSettings({ ...settings, voice: e.target.checked })
          }
        />
        Voice alert on generation
      </label>
    </div>
  );
}