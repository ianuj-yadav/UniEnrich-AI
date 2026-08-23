"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  apiLogin, 
  apiSignup, 
  apiGoogleAuth, 
  AuthUserResponse 
} from "@/lib/api";

export interface AuthUser extends AuthUserResponse {}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  loginWithGoogle: (customEmail?: string, customName?: string, avatarUrl?: string) => Promise<boolean>;
  signup: (name: string, email: string, password?: string) => Promise<boolean>;
  logout: () => void;
}

const DEFAULT_USER: AuthUser = {
  id: "usr_anuj_01",
  name: "Anuj Yadav",
  email: "anuj.yadav@unienrich.ai",
  role: "Lead Catalog Reviewer",
  organization: "Araxyss / UniEnrich Industrial AI",
  tier: "Enterprise Vault",
  avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Anuj",
  provider: "email",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load session from localStorage on mount
  useEffect(() => {
    try {
      const isLoggedOut = localStorage.getItem("unienrich_auth_logged_out");
      const stored = localStorage.getItem("unienrich_auth_user");
      
      if (stored) {
        setUser(JSON.parse(stored));
      } else if (!isLoggedOut) {
        // Default active demo session for first-time visitors
        setUser(DEFAULT_USER);
        localStorage.setItem("unienrich_auth_user", JSON.stringify(DEFAULT_USER));
      } else {
        setUser(null);
      }
    } catch {
      setUser(DEFAULT_USER);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password = "Password123!"): Promise<boolean> => {
    setIsLoading(true);
    try {
      // 1. Try real backend API
      try {
        const res = await apiLogin(email, password);
        if (res && res.user) {
          setUser(res.user);
          localStorage.removeItem("unienrich_auth_logged_out");
          localStorage.setItem("unienrich_auth_user", JSON.stringify(res.user));
          if (res.token) {
            localStorage.setItem("unienrich_auth_token", res.token);
          }
          return true;
        }
      } catch (backendErr) {
        console.warn("Backend auth call failed, falling back to local session:", backendErr);
      }

      // 2. Client fallback
      const nameFromEmail = email.split("@")[0].replace(".", " ").replace(/\b\w/g, (l) => l.toUpperCase());
      const loggedUser: AuthUser = {
        id: `usr_${Date.now().toString(36)}`,
        name: nameFromEmail || "Catalog Analyst",
        email,
        role: "Lead Catalog Reviewer",
        organization: "Araxyss / UniEnrich Industrial AI",
        tier: "Enterprise Vault",
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${nameFromEmail}`,
        provider: "email",
      };

      setUser(loggedUser);
      localStorage.removeItem("unienrich_auth_logged_out");
      localStorage.setItem("unienrich_auth_user", JSON.stringify(loggedUser));
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (
    customEmail = "anuj.yadav@gmail.com", 
    customName = "Anuj Yadav",
    avatarUrl?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      // 1. Try real backend Google auth API
      try {
        const res = await apiGoogleAuth(customEmail, customName, avatarUrl);
        if (res && res.user) {
          setUser(res.user);
          localStorage.removeItem("unienrich_auth_logged_out");
          localStorage.setItem("unienrich_auth_user", JSON.stringify(res.user));
          if (res.token) {
            localStorage.setItem("unienrich_auth_token", res.token);
          }
          return true;
        }
      } catch (backendErr) {
        console.warn("Backend Google auth call failed, falling back to local session:", backendErr);
      }

      // 2. Client fallback
      const googleUser: AuthUser = {
        id: `usr_g_${Date.now().toString(36)}`,
        name: customName,
        email: customEmail,
        role: "Lead Catalog Reviewer",
        organization: "Araxyss / UniEnrich Industrial AI",
        tier: "Enterprise Vault",
        avatar: avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${customName}`,
        provider: "google",
      };

      setUser(googleUser);
      localStorage.removeItem("unienrich_auth_logged_out");
      localStorage.setItem("unienrich_auth_user", JSON.stringify(googleUser));
      return true;
    } catch (err) {
      console.error("Google login failed:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password = "Password123!"): Promise<boolean> => {
    setIsLoading(true);
    try {
      // 1. Try real backend signup API
      try {
        const res = await apiSignup(name, email, password);
        if (res && res.user) {
          setUser(res.user);
          localStorage.removeItem("unienrich_auth_logged_out");
          localStorage.setItem("unienrich_auth_user", JSON.stringify(res.user));
          if (res.token) {
            localStorage.setItem("unienrich_auth_token", res.token);
          }
          return true;
        }
      } catch (backendErr) {
        console.warn("Backend signup call failed, falling back to local session:", backendErr);
      }

      // 2. Client fallback
      const newUser: AuthUser = {
        id: `usr_${Date.now().toString(36)}`,
        name,
        email,
        role: "Catalog Reviewer",
        organization: "Araxyss Industrial AI",
        tier: "Enterprise Vault",
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
        provider: "email",
      };

      setUser(newUser);
      localStorage.removeItem("unienrich_auth_logged_out");
      localStorage.setItem("unienrich_auth_user", JSON.stringify(newUser));
      return true;
    } catch (err) {
      console.error("Signup failed:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("unienrich_auth_user");
    localStorage.removeItem("unienrich_auth_token");
    localStorage.setItem("unienrich_auth_logged_out", "true");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
