"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth/store";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, initialize } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Initialize auth state from localStorage
    initialize();
    setIsChecking(false);
  }, [initialize]);

  useEffect(() => {
    if (!isChecking) {
      // Not authenticated at all - redirect to login
      if (!isAuthenticated || !user) {
        router.replace("/auth?mode=business");
        return;
      }

      // If requireAdmin is true, check if user is admin or staff
      if (requireAdmin) {
        const isAdminOrStaff = user.isAdmin || user.isStaff;
        
        if (!isAdminOrStaff) {
          // User is authenticated but not admin/staff - redirect to home
          router.replace("/home");
          return;
        }
      }
    }
  }, [isAuthenticated, user, router, isChecking, requireAdmin]);

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#7bc74d] mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show loading while redirecting
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#7bc74d] mx-auto mb-4" />
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // If requireAdmin is true and user is not admin/staff, show loading while redirecting
  if (requireAdmin) {
    const isAdminOrStaff = user.isAdmin || user.isStaff;
    
    if (!isAdminOrStaff) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#7bc74d] mx-auto mb-4" />
            <p className="text-gray-600">Access denied. Redirecting...</p>
          </div>
        </div>
      );
    }
  }

  // User is authenticated (and admin/staff if required) - render children
  return <>{children}</>;
}

