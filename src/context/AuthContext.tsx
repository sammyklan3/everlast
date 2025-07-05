"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { AuthContextType, User } from "@/types/auth";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  const fetchUser = async (token?: string) => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Token refresh failed");
      const data = await response.json();

      const userResponse = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || data.accessToken}`,
        },
      });

      if (!userResponse.ok) throw new Error("Failed to fetch user");

      const userData = await userResponse.json();
      if (!userData?.user) throw new Error("User data not found");

      setAccessToken(data.accessToken);
      setUser(userData.user);
    } catch (err) {
      console.error("fetchUser error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user && loading) {
      fetchUser();
    }
  }, [user, loading]);

  const login = async (email: string, password: string) => {
    setAuthLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (!data.accessToken) {
        throw new Error("No access token returned");
      }

      setAccessToken(data.accessToken);
      await fetchUser(data.accessToken);

      return { success: true };
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken || ""}`,
        },
        credentials: "include",
      });
    } catch (err) {
      console.warn("Logout failed:", err);
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        loading,
        accessToken,
        error,
        authLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
