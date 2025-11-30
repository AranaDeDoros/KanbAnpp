import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { TokenContext } from "../context/TokenContext";

export  function ProtectedRoute({ children }) {
  const { token } = useContext(TokenContext);

  if (!token) return <Navigate to="/login" replace />;

  return children;
}
