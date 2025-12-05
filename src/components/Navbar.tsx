"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth/store";
import { businessApi } from "@/lib/api/business";
import { User, LogOut, Menu, X, Home, Store, DollarSign, ChevronRight, LayoutDashboard, Info } from "lucide-react";

// Helper function to create slug from name
const createSlug = (name: string): string => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
};

export default function Navbar() {
  const { user, isAuthenticated, clearAuth, initialize } = useAuthStore();
  const router = useRouter();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [businessSlug, setBusinessSlug] = useState<string | null>(null);
  
  // Initialize auth store on mount to ensure localStorage is loaded
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Fetch business name from businessId if user is admin/staff
  useEffect(() => {
    const fetchBusinessSlug = async () => {
      if (user?.businessId && (user.isAdmin || user.isStaff)) {
        try {
          const response = await businessApi.getAll({ limit: 100 });
          const businesses = response.data.businesses;
          const matchingBusiness = businesses.find(b => b.id === user.businessId);
          if (matchingBusiness) {
            setBusinessSlug(createSlug(matchingBusiness.name));
          }
        } catch (err) {
          console.error("Failed to fetch business:", err);
        }
      }
    };

    if (user?.businessId) {
      fetchBusinessSlug();
    } else {
      setBusinessSlug(null);
    }
  }, [user?.businessId, user?.isAdmin, user?.isStaff]);

  const handleDashboardClick = () => {
    if (user?.businessId && businessSlug && (user.isAdmin || user.isStaff)) {
      router.push(`/${businessSlug}/dashboard`);
    } else {
      router.push("/dashboard");
    }
    setShowMobileMenu(false);
    setShowProfileDropdown(false);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileMenu]);
  
  const navLinks = [
    { label: "Home", href: "/home", icon: Home },
    { label: "Businesses", href: "/businesses", icon: Store },
    { label: "Pricing", href: "/pricing", icon: DollarSign },
    { label: "About", href: "/about", icon: Info },
  ];

  return (
    <nav className="flex justify-between items-center py-4 px-4 sm:px-6 lg:px-20 bg-white/70 backdrop-blur-md relative z-[9999]">
      <Link href="/home" className="text-2xl sm:text-3xl font-gilroy-extrabold text-black hover:text-[#7bc74d] transition">
        PointNow.
      </Link>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6 lg:gap-10">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-gray-700 font-medium hover:text-[#7bc74d] transition text-sm lg:text-base"
          >
            {link.label}
          </Link>
        ))}
        <div className="flex items-center gap-2 lg:gap-4">
          <button
            onClick={handleDashboardClick}
            className="bg-black hover:bg-gray-800 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-full font-semibold transition text-sm lg:text-base"
          >
            Dashboard
          </button>
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
              </button>
              
              {showProfileDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-[9998]" 
                    onClick={() => setShowProfileDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-[9999]">
                    <Link
                      href={`/profile/${user.user.id}`}
                      onClick={() => setShowProfileDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">My Profile</span>
                    </Link>
                    <div className="border-t border-gray-200 my-1" />
                    <button
                      onClick={() => {
                        clearAuth();
                        setShowProfileDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/auth?mode=user">
              <button className="bg-[#7bc74d] text-white px-4 lg:px-8 py-2 lg:py-3 rounded-full font-semibold hover:bg-[#6ab63d] transition text-sm lg:text-base">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center gap-2">
        {isAuthenticated && user && (
          <Link href={`/profile/${user.user.id}`} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-[#7bc74d] to-[#6ab63d] rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </Link>
        )}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="p-2 text-gray-700 hover:text-[#7bc74d] hover:bg-gray-100 rounded-full transition-all"
          aria-label="Toggle menu"
        >
          {showMobileMenu ? (
            <X className="w-6 h-6 transition-transform duration-200" />
          ) : (
            <Menu className="w-6 h-6 transition-transform duration-200" />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <>
          {/* Backdrop - only covers content below navbar */}
          <div 
            className="fixed inset-x-0 top-[80px] bottom-0 bg-black/30 z-[9998] md:hidden"
            onClick={() => setShowMobileMenu(false)}
          />

          {/* Menu Container - dropdown from navbar */}
          <div className="absolute top-full left-0 right-0 bg-white shadow-2xl z-[9999] md:hidden max-h-[calc(100vh-80px)] overflow-y-auto">
            
            {/* User Profile Section (if authenticated) */}
            {isAuthenticated && user && (
              <div className="p-4 bg-gradient-to-r from-[#7bc74d] to-[#6ab63d]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-gilroy-extrabold text-white truncate">
                      {user.user.name || user.user.email.split("@")[0]}
                    </p>
                    <p className="text-sm text-white/80 truncate">{user.user.email}</p>
                  </div>
                </div>
                <Link
                  href={`/profile/${user.user.id}`}
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center justify-between w-full bg-white/20 text-white px-3 py-2 rounded-lg font-medium hover:bg-white/30 transition-all duration-200"
                >
                  <span>View Profile</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* Dashboard Button */}
            <div className="p-4 border-b border-gray-100">
              <button
                onClick={handleDashboardClick}
                className="w-full flex items-center gap-4 p-4 bg-black hover:bg-gray-800 text-white rounded-xl transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-gilroy-extrabold text-white">Dashboard</p>
                  <p className="text-xs text-white/80">
                    {user?.businessId && (user.isAdmin || user.isStaff) ? "Business dashboard" : "Merchant access"}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/80" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="p-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-[#7bc74d]/10 to-[#6ab63d]/10 rounded-lg flex items-center justify-center group-hover:from-[#7bc74d]/20 group-hover:to-[#6ab63d]/20 transition-all">
                      <Icon className="w-5 h-5 text-[#7bc74d]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-gilroy-extrabold text-gray-900 group-hover:text-[#7bc74d] transition-colors">
                        {link.label}
                      </p>
                      <p className="text-xs text-gray-500">
                        {link.label === 'Home' && 'Discover businesses'}
                        {link.label === 'Businesses' && 'Browse all locations'}
                        {link.label === 'Pricing' && 'View plans & pricing'}
                        {link.label === 'About' && 'Our story & mission'}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#7bc74d] transition-colors" />
                  </Link>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-gray-100">
              {isAuthenticated && user ? (
                <button
                  onClick={() => {
                    clearAuth();
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center justify-center gap-3 p-3 text-red-600 font-medium hover:bg-red-50 rounded-xl transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              ) : (
                <Link href="/auth?mode=user" onClick={() => setShowMobileMenu(false)} className="block">
                  <button className="w-full bg-gradient-to-r from-[#7bc74d] to-[#6ab63d] text-white p-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Login / Sign Up</span>
                  </button>
                </Link>
              )}
            </div>
          </div>
        </>
      )}

    </nav>
  );
}
