import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ProtectedLayout() {
  const token = localStorage.getItem("access");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

