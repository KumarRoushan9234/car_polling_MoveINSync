import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Loader from "./Loader";

const ProtectedRoute = ({ children }) => {
  const { authUser, isCheckingAuth } = useAuthStore();
  const [loading, setLoading] = useState(isCheckingAuth);

  if (!authUser) {
    return <Navigate to="/login" />;
  }

  if (!authUser.isemailVerified) {
    return <Navigate to="/verify-email" />;
  }

  return children;
};

export default ProtectedRoute;
