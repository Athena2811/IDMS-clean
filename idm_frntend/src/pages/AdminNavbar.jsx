import { Link, useNavigate } from "react-router-dom";
import "../styles/publicNavbar.css";

export default function PublicNavbar() {
  const navigate = useNavigate();

  return (
 <nav className="public-navbar">
  <div className="brand-container">
    <img src="/logo.png" alt="InteriorAI" className="logo" />
    <h2 className="brand-text">
      Interior<span>AI</span>
    </h2>
  </div>

  <div className="public-links">
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/login">Login</a>
    <a href="/register" className="get-started-btn">Register</a>
  </div>
</nav>


  );
}