import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function DashboardLayout() {
  return (
    <>
      <Navbar />
      <div className="p-8 bg-gray-50 min-h-screen">
        <Outlet />
      </div>
    </>
  );
}

