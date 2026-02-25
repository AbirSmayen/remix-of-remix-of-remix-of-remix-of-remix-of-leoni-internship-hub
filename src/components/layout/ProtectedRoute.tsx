import { Navigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const roleRoutes: Record<UserRole, string> = {
      rh: "/dashboard/rh",
      encadrant: "/dashboard/encadrant",
      stagiaire: "/dashboard/stagiaire",
    };
    return <Navigate to={roleRoutes[user.role]} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
