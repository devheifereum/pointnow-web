"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import RestaurantSidebar from "@/components/restaurant/RestaurantSidebar";
import { useAuthStore } from "@/lib/auth/store";
import { SidebarProvider, useSidebar } from "@/components/restaurant/SidebarContext";

interface RestaurantLayoutProps {
  children: React.ReactNode;
}

function RestaurantLayoutContent({ children }: RestaurantLayoutProps) {
  const router = useRouter();
  const { clearAuth, user } = useAuthStore();
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useSidebar();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleLogout = () => {
    clearAuth();
    router.push("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <RestaurantSidebar />
      <main className="xl:ml-20 min-h-screen">
        {/* Top Header with Logout */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between pl-3 sm:pl-4 xl:pl-4 pr-3 sm:pr-4 xl:pr-8 py-3 sm:py-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
              <h2 className="text-lg xl:text-xl font-gilroy-extrabold text-black truncate">
                Business Dashboard
              </h2>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {isHydrated && user && (
                <span className="text-sm text-gray-600 hidden md:block truncate max-w-32 lg:max-w-none">
                  {user.user.email}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>
        <div className="p-3 sm:p-4 md:p-6 xl:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function RestaurantLayout({ children }: RestaurantLayoutProps) {
  return (
    <SidebarProvider>
      <RestaurantLayoutContent>{children}</RestaurantLayoutContent>
    </SidebarProvider>
  );
}

