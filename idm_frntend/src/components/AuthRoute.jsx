import { Navigate } from "react-router-dom";

export default function AuthRoute({ children }) {
  const token = localStorage.getItem("access");

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
