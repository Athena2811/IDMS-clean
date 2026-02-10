import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/themes.css";

const themes = [
  {
    id: 1,
    name: "Modern Minimal",
    desc: "Clean lines, neutral tones, clutter-free living",
    image: "http://127.0.0.1:8000/media/themes/morden_minimal.jpg",
  },
  {
    id: 2,
    name: "Scandinavian",
    desc: "Bright, cozy, natural materials & warmth",
    image: "http://127.0.0.1:8000/media/themes/scandivian.jpg",
  },
  {
    id: 3,
    name: "Bohemian",
    desc: "Relaxed, artistic, earthy & expressive",
    image: "http://127.0.0.1:8000/media/themes/boheminan.jpg",
  },
];

export default function Themes() {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState(null);

  const handleContinue = () => {
    if (!selectedTheme) return;
    navigate(`/items/${selectedTheme}`);
  };

  return (
    <div className="themes-wrapper">
      <div className="themes-header">
        <h1>Choose Your Style</h1>
        <p>Step 2 of 4 · Select a design theme</p>
      </div>

      <div className="themes-grid">
        {themes.map((theme, index) => (
          <motion.div
            key={theme.id}
            className={`theme-card ${
              selectedTheme === theme.id ? "active" : ""
            }`}
            onClick={() => setSelectedTheme(theme.id)}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
          >
            <img src={theme.image} alt={theme.name} />
            <div className="theme-info">
              <h3>{theme.name}</h3>
              <p>{theme.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <button
        className="themes-continue"
        disabled={!selectedTheme}
        onClick={handleContinue}
      >
        Continue →
      </button>
    </div>
  );
}
