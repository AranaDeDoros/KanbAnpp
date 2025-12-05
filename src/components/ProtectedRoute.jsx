import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { TokenContext } from "../context/TokenContext";

export  function ProtectedRoute({ children }) {
  const { token, loading } = useContext(TokenContext);
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (!token && location.pathname === "/login") {
    return children;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
