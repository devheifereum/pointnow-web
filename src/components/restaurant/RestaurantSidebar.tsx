"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useParams, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  History,
  Settings,
  Trophy,
  LogOut,
  X,
  Building2,
} from "lucide-react";
import { useAuthStore } from "@/lib/auth/store";
import { useSidebar } from "./SidebarContext";

interface SidebarItem {
  label: string;
  href: (restaurantName: string) => string;
  icon: React.ComponentType<{ className?: string }>;
}

const sidebarItems: SidebarItem[] = [
  { label: "Dashboard", href: (name) => `/${name}/dashboard`, icon: LayoutDashboard },
  { label: "Analytics", href: (name) => `/${name}/analytics`, icon: BarChart3 },
  { label: "Transactions", href: (name) => `/${name}/transactions`, icon: History },
  { label: "Leaderboard", href: (name) => `/${name}/leaderboard`, icon: Trophy },
  { label: "Branches", href: (name) => `/${name}/branches`, icon: Building2 },
  { label: "Settings", href: (name) => `/${name}/settings`, icon: Settings },
];

export default function RestaurantSidebar() {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const { clearAuth } = useAuthStore();
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useSidebar();
  const restaurantName = params?.["restaurant-name"] as string || "";

  const handleLogout = () => {
    clearAuth();
    setIsMobileMenuOpen(false);
    router.push("/home");
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50
          transform transition-all duration-300 ease-in-out
          overflow-x-hidden overflow-y-auto
          shadow-xl xl:shadow-none
          xl:translate-x-0
          ${isMobileMenuOpen ? "translate-x-0 w-72 sm:w-80" : "-translate-x-full xl:translate-x-0"}
          xl:w-20
        `}
      >
        <div className="flex flex-col h-full w-full min-w-0">
          {/* Logo/Header */}
          <div className="p-4 xl:p-6 border-b border-gray-200 flex items-center justify-between w-full min-w-0">
            <Link 
              href={`/${restaurantName}/dashboard`} 
              className="flex items-center flex-1 min-w-0"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="w-12 h-12 xl:w-10 xl:h-10 bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl xl:text-lg">P</span>
              </div>
              <div className="ml-4 xl:hidden min-w-0 flex-1">
                <h1 className="text-xl font-gilroy-black text-black truncate">PointNow</h1>
                <p className="text-sm text-gray-500 truncate">
                  {restaurantName ? decodeURIComponent(restaurantName).replace(/-/g, " ") : "Restaurant"}
                </p>
              </div>
            </Link>
            {/* Close button for mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="xl:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2 flex-shrink-0"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 xl:p-4 space-y-1 xl:space-y-2 overflow-y-auto overflow-x-hidden w-full min-w-0">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const href = item.href(restaurantName);
              const isActive = pathname === href;
              return (
                <Link
                  key={item.label}
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  title={item.label}
                  className={`
                    flex items-center px-4 xl:px-0 xl:justify-center py-4 xl:py-3 rounded-xl transition-all duration-200
                    group relative w-full min-w-0
                    ${
                      isActive
                        ? "bg-[#7bc74d] text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                >
                  <Icon className="w-6 h-6 xl:w-5 xl:h-5 flex-shrink-0" />
                  <span className="ml-4 xl:hidden font-semibold text-base truncate min-w-0">{item.label}</span>
                  {/* Tooltip for collapsed state */}
                  <span className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-[70] transition-opacity hidden xl:block">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-3 xl:p-4 border-t border-gray-200 w-full min-w-0">
            <button
              onClick={handleLogout}
              title="Logout"
              className="flex items-center px-4 xl:px-0 xl:justify-center py-4 xl:py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group relative w-full min-w-0"
            >
              <LogOut className="w-6 h-6 xl:w-5 xl:h-5 flex-shrink-0" />
              <span className="ml-4 xl:hidden font-semibold text-base truncate min-w-0">Logout</span>
              {/* Tooltip for collapsed state */}
              <span className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-[70] transition-opacity hidden xl:block">
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/30 z-40 xl:hidden backdrop-blur-sm transition-opacity duration-300"
          aria-hidden="true"
        />
      )}
    </>
  );
}
