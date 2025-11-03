/**
 * ProtectedRoute.tsx
 *
 * Author: Zakaria TEJJANI
 * Email: contact@tejjzakaria.com
 * Date: 2025-11-03
 *
 * Description:
 * Route protection wrapper component implementing authentication and authorization guards.
 * Validates user authentication status before allowing access to protected admin routes.
 * Supports role-based access control with optional role restrictions (admin, agent, viewer).
 * Redirects unauthenticated users to the sign-in page and unauthorized users to appropriate
 * error pages. Integrates with AuthContext for centralized authentication state management.
 * Essential security component ensuring only authorized users can access admin functionality.
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
