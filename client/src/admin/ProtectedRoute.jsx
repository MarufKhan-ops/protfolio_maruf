import { Navigate } from "react-router-dom";
import { auth } from "../api.js";

export default function ProtectedRoute({ children }) {
  if (!auth.isLoggedIn()) return <Navigate to="/admin/login" replace />;
  return children;
}
