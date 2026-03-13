import "../styles/about.css";

export default function About() {
  return (
    <div className="about-page">
      <h1>About InteriorAI</h1>

      <p>
        InteriorAI is an intelligent interior design platform that allows users
        to upload their room, select a design theme, and instantly generate a
        redesigned version using AI.
      </p>

      <div className="about-features">
        <div>
          <h3>AI-Powered Redesign</h3>
          <p>Transform your space using advanced AI models.</p>
        </div>

        <div>
          <h3>Theme Customization</h3>
          <p>Choose from modern, Scandinavian, and bohemian styles.</p>
        </div>

        <div>
          <h3>Interactive Design</h3>
          <p>Drag, drop, and personalize your dream interior.</p>
        </div>
      </div>
    </div>
  );
}