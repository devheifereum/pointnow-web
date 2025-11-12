"use client";

import { create } from "zustand";
import type { AuthUser, User, BackendTokens, UserRole, PhoneRegisterUser } from "../types/auth";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuth: (user: User, tokens: BackendTokens) => void;
  setAuthFromPhone: (phoneUser: PhoneRegisterUser, token: string, refreshToken: string) => void;
  clearAuth: () => void;
  getAccessToken: () => string | null;
  initialize: () => void;
}

// Helper function to convert PhoneRegisterUser to User
function convertPhoneUserToUser(phoneUser: PhoneRegisterUser): User {
  try {
    const emailPrefix = phoneUser.email ? phoneUser.email.split("@")[0] : "User";
    
    return {
      id: phoneUser.id?.toString() || "",
      email: phoneUser.email || "",
      name: emailPrefix,
      phone_number: phoneUser.phone_no || null,
      created_at: phoneUser.created_at || new Date().toISOString(),
      updated_at: phoneUser.updated_at || new Date().toISOString(),
      metadata: null,
      is_active: phoneUser.active === 1,
      admin: null,
      staff: null,
      customer: {
        name: emailPrefix,
        phone_number: phoneUser.phone_no || "",
        email: phoneUser.email || "",
      },
      user_roles: [
        {
          role: {
            name: "CUSTOMER" as UserRole,
          },
        },
      ],
    };
  } catch (error) {
    console.error("Error converting PhoneRegisterUser to User:", error, phoneUser);
    throw new Error("Failed to process user data");
  }
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
    setAuthFromPhone: (phoneUser: PhoneRegisterUser, token: string, refreshToken: string) => {
      const user = convertPhoneUserToUser(phoneUser);
      const tokens: BackendTokens = {
        access_token: token,
        refresh_token: refreshToken,
        expires_in: 3600, // Default expiry, adjust if needed
      };
      const authUser = createAuthUser(user, tokens);
      
      // Store tokens in localStorage for API client
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", token);
        localStorage.setItem("refresh_token", refreshToken);
        
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
