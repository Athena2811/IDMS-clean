import { useNavigate } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  return (
  

    <nav className="navbar">
      <h2 onClick={() => navigate("/")}>InteriorAI</h2>

      <div className="nav-links">
        <button onClick={() => navigate("/my-designs")}>My Designs</button>
        <button onClick={() => navigate("/profile")}>Profile</button>
        <button
          className="logout"
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
