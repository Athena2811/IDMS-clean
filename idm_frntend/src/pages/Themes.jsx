import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();

  const { roomTypeId, selectedItems, selectedMaterials } =
    location.state || {};

  const [selectedTheme, setSelectedTheme] = useState(null);

  const handleContinue = () => {
    if (!selectedTheme) return;

    navigate("/generate", {
      state: {
        roomTypeName:location.state.roomTypeName,
        themeName: themes.find(t => t.id === selectedTheme)?.name || null,
      },
    });
  };

  return (
    <div className="themes-container">
      <div className="themes-header">
       <div className="themes-header">
  <h1>Choose Your Style</h1>
  <p>Select a theme that matches your interior vision</p>
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
      
        <div className="bottom-nav">
  <button
    className="back-btn"
    onClick={() => navigate("/room-select")}
  >
    ← Back to Rooms
  </button>
</div>
      <button
        className="themes-continue"
        disabled={!selectedTheme}
        onClick={handleContinue}
      >
        Generate Design →
      </button>
    </div>
    </div>
  );
}