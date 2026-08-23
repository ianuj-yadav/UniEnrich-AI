"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  tier: string;
  avatar: string;
  provider: "google" | "email";
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
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
      const stored = localStorage.getItem("unienrich_auth_user");
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Default active user for immediate demo seamlessness
        setUser(DEFAULT_USER);
        localStorage.setItem("unienrich_auth_user", JSON.stringify(DEFAULT_USER));
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
      localStorage.setItem("unienrich_auth_user", JSON.stringify(loggedUser));
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const googleUser: AuthUser = {
        id: `usr_g_${Date.now().toString(36)}`,
        name: "Anuj Yadav",
        email: "anuj.yadav@gmail.com",
        role: "Lead Catalog Reviewer",
        organization: "Araxyss / UniEnrich Industrial AI",
        tier: "Enterprise Vault",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=AnujYadavGoogle",
        provider: "google",
      };

      setUser(googleUser);
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
