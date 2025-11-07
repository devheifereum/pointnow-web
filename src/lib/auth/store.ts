"use client";

import { create } from "zustand";
import type { AuthUser, User, BackendTokens, UserRole } from "../types/auth";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuth: (user: User, tokens: BackendTokens) => void;
  clearAuth: () => void;
  getAccessToken: () => string | null;
  initialize: () => void;
}

// Helper function to extract roles and determine user type
function createAuthUser(user: User, tokens: BackendTokens): AuthUser {
  const roles: UserRole[] = user.user_roles.map((ur) => ur.role.name);
  const businessId =
    user.admin?.business_id || user.staff?.business_id || null;

  return {
    user,
    tokens,
    roles,
    businessId,
    isAdmin: roles.includes("ADMIN"),
    isStaff: roles.includes("STAFF"),
    isCustomer: roles.includes("CUSTOMER") || roles.includes("USER"),
  };
}

// Load from localStorage on initialization
function loadAuthFromStorage(): { user: AuthUser | null; isAuthenticated: boolean } {
  if (typeof window === "undefined") {
    return { user: null, isAuthenticated: false };
  }

  try {
    const stored = localStorage.getItem("auth-storage");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.user && parsed.isAuthenticated) {
        return parsed;
      }
    }
  } catch {
    // Ignore parse errors
  }

  return { user: null, isAuthenticated: false };
}

export const useAuthStore = create<AuthState>()((set) => {
  // Initialize from localStorage
  const stored = loadAuthFromStorage();

  return {
    user: stored.user,
    isAuthenticated: stored.isAuthenticated,
    setAuth: (user: User, tokens: BackendTokens) => {
      const authUser = createAuthUser(user, tokens);
      
      // Store tokens in localStorage for API client
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", tokens.access_token);
        localStorage.setItem("refresh_token", tokens.refresh_token);
        
        // Store auth state
        localStorage.setItem(
          "auth-storage",
          JSON.stringify({
            user: authUser,
            isAuthenticated: true,
          })
        );
      }

      set({
        user: authUser,
        isAuthenticated: true,
      });
    },
    clearAuth: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("auth-storage");
      }
      set({
        user: null,
        isAuthenticated: false,
      });
    },
    getAccessToken: () => {
      if (typeof window === "undefined") return null;
      return localStorage.getItem("access_token");
    },
    initialize: () => {
      const stored = loadAuthFromStorage();
      set({
        user: stored.user,
        isAuthenticated: stored.isAuthenticated,
      });
    },
  };
});
