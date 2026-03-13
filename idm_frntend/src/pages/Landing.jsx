import "../styles/landing.css";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">

      <div className="hero-section">
        <div className="hero-overlay">
          <h1>Design Your Dream Space with AI</h1>
          <p>
            Upload your room, choose a style, and let AI transform your interior instantly.
          </p>

          <button onClick={() => navigate("/register")}>
            Start Designing
          </button>
        </div>
      </div>

      <section className="how-section">
        <h2>How It Works</h2>

        <div className="steps">
          <div className="step">
            <h3>Upload Room</h3>
            <p>Upload your existing space and let AI analyze the layout.</p>
          </div>

          <div className="step">
            <h3>Choose Theme</h3>
            <p>Select from modern, luxury, minimal, Scandinavian and more.</p>
          </div>

          <div className="step">
            <h3>Generate Design</h3>
            <p>Instantly receive AI-generated interior transformations.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
