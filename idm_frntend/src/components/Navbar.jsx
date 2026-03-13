import { useNavigate } from "react-router-dom";
import "../styles/publicNavbar.css";

export default function Navbar(){

const navigate = useNavigate();
const username = localStorage.getItem("username");
const logout = ()=>{
localStorage.removeItem("access");
localStorage.removeItem("refresh");

localStorage.removeItem("username");
navigate("/login");
};

return(

<nav className="public-navbar">

<div className="brand-container">

<img src="/logo.png" alt="InteriorAI" className="logo"/>

<h2 className="brand-text">
Interior<span>AI</span>
</h2>

</div>

<div className="public-links">

<a href="/room-select">Home</a>
<a href="/my-designs">My Designs</a>
<span style={{color:"#c8a96a", fontWeight:"500"}}>
Hello, {username}
</span>
<button
className="get-started-btn"
onClick={logout}
>
Logout
</button>

</div>

</nav>

);

}