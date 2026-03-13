import { Routes, Route, Navigate } from "react-router-dom";
import "./index.css"; 
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import Landing from "./pages/Landing";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

import RoomSelect from "./pages/RoomSelect";
import Themes from "./pages/Themes";
import Generate from "./pages/Generate";
import MyDesigns from "./pages/MyDesigns";
import Profile from "./pages/Profile";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("access");
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Route>

      {/* ADMIN ROUTE (NO DashboardLayout) */}
      <Route
        path="/admin-dashboard"
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      {/* USER DASHBOARD ROUTES */}
      <Route
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route path="/room-select" element={<RoomSelect />} />
        <Route path="/themes" element={<Themes />} />
        <Route path="/theme-select" element={<Themes />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/my-designs" element={<MyDesigns />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

    </Routes>
  );
}

export default App;