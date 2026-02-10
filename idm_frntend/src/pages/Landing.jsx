import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/landing.css";

const images = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  "https://images.unsplash.com/photo-1600607687939-ce8b7d5f1d60",
  "https://images.unsplash.com/photo-1600573472591-ee6981cf6f37",
  "https://images.unsplash.com/photo-1600210492493-0946911123ea",
];

export default function Landing() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 2000); // 2 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="page landing-container">
      <div
        className="hero-bg"
        style={{ backgroundImage: `url(${images[index]})` }}
      />
<div className="landing-hero">
  <div className="overlay">
    <h1>Design Your Dream Space with AI</h1>
    <p>Upload your room, choose a style, and let AI transform it instantly.</p>
    <button onClick={() => navigate("/room-select")}>
      Start Designing
    </button>
  </div>
</div>
    </div>
  );
}

