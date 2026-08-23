"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  apiLogin, 
  apiSignup, 
  apiGoogleAuth,
  apiGetCurrentUser,
  apiLogout,
  AuthUserResponse 
} from "@/lib/api";

export interface AuthUser extends AuthUserResponse {}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  loginWithGoogle: (credential: string) => Promise<boolean>;
  signup: (name: string, email: string, password?: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Restore only a server-validated session; local storage is never trusted as identity.
  useEffect(() => {
    const restoreSession = async (): Promise<void> => {
      const token = localStorage.getItem("unienrich_auth_token");
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const currentUser = await apiGetCurrentUser(token);
        setUser(currentUser);
        localStorage.setItem("unienrich_auth_user", JSON.stringify(currentUser));
      } catch {
        localStorage.removeItem("unienrich_auth_token");
        localStorage.removeItem("unienrich_auth_user");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    void restoreSession();
  }, []);

  const login = async (email: string, password = "Password123!"): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await apiLogin(email, password);
      setUser(res.user);
      localStorage.setItem("unienrich_auth_user", JSON.stringify(res.user));
      localStorage.setItem("unienrich_auth_token", res.token);
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (credential: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await apiGoogleAuth(credential);
      setUser(res.user);
      localStorage.setItem("unienrich_auth_user", JSON.stringify(res.user));
      localStorage.setItem("unienrich_auth_token", res.token);
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
      const res = await apiSignup(name, email, password);
      setUser(res.user);
      localStorage.setItem("unienrich_auth_user", JSON.stringify(res.user));
      localStorage.setItem("unienrich_auth_token", res.token);
      return true;
    } catch (err) {
      console.error("Signup failed:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    const token = localStorage.getItem("unienrich_auth_token");
    if (token) void apiLogout(token);
    setUser(null);
    localStorage.removeItem("unienrich_auth_user");
    localStorage.removeItem("unienrich_auth_token");
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
