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
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/lib/auth/store";

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
  { label: "Settings", href: (name) => `/${name}/settings`, icon: Settings },
];

export default function RestaurantSidebar() {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const { clearAuth } = useAuthStore();
  const restaurantName = params?.["restaurant-name"] as string || "";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    setIsMobileMenuOpen(false);
    router.push("/home");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-40
          transform transition-transform duration-300 ease-in-out
          overflow-x-hidden overflow-y-auto
          lg:translate-x-0
          ${isMobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"}
          lg:w-20
        `}
      >
        <div className="flex flex-col h-full w-full min-w-0">
          {/* Logo/Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-center w-full min-w-0">
            <Link href={`/${restaurantName}/dashboard`} className="flex items-center justify-center w-full min-w-0">
              <div className="w-10 h-10 bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              {isMobileMenuOpen && (
                <div className="ml-3 lg:hidden min-w-0 flex-shrink-0">
                  <h1 className="text-xl font-gilroy-black text-black whitespace-nowrap truncate">PointNow</h1>
                  <p className="text-xs text-gray-500 whitespace-nowrap truncate">{restaurantName ? decodeURIComponent(restaurantName).replace(/-/g, " ") : "Restaurant"}</p>
                </div>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 lg:p-4 space-y-2 overflow-y-auto overflow-x-hidden w-full min-w-0">
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
                    flex items-center justify-center lg:justify-center px-3 lg:px-0 py-3 rounded-xl transition-colors
                    group relative w-full min-w-0
                    ${
                      isActive
                        ? "bg-[#7bc74d] text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isMobileMenuOpen && (
                    <span className="ml-3 font-semibold whitespace-nowrap lg:hidden truncate min-w-0">{item.label}</span>
                  )}
                  {/* Tooltip for collapsed state */}
                  <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity hidden lg:block">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-2 lg:p-4 border-t border-gray-200 w-full min-w-0">
            <button
              onClick={handleLogout}
              title="Logout"
              className="flex items-center justify-center lg:justify-center px-3 lg:px-0 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors group relative w-full min-w-0"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {isMobileMenuOpen && (
                <span className="ml-3 font-semibold whitespace-nowrap lg:hidden truncate min-w-0">Logout</span>
              )}
              {/* Tooltip for collapsed state */}
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity hidden lg:block">
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
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        />
      )}
    </>
  );
}
