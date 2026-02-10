import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoomSelect from "./pages/RoomSelect";
import Themes from "./pages/Themes";
import Items from "./pages/Items";
import Generate from "./pages/Generate";
import MyDesigns from "./pages/MyDesigns";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("access");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const token = localStorage.getItem("access");

  return (
    <div className="app-wrapper">
      {token && <Navbar />}

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PRIVATE */}
        <Route path="/room-select" element={<PrivateRoute><RoomSelect /></PrivateRoute>} />
        <Route path="/themes" element={<PrivateRoute><Themes /></PrivateRoute>} />
        <Route path="/items/:themeId" element={<PrivateRoute><Items /></PrivateRoute>} />
        <Route path="/generate" element={<PrivateRoute><Generate /></PrivateRoute>} />
        <Route path="/my-designs" element={<PrivateRoute><MyDesigns /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}
export default App;