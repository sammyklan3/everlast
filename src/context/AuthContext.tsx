"use client";
import { toast } from "sonner";

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

  const isAuthenticated = !!user;

  const fetchUser = async (token?: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.message) {
          throw new Error(data.message);
        } else {
          throw new Error("Failed to refresh token");
        }
      }

      const userResponse = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || data.accessToken}`,
        },
      });

      const userData = await userResponse.json();
      if (!userResponse.ok) {
        if (userData.message) {
          throw new Error(userData.message);
        } else {
          throw new Error("Failed to fetch user data");
        }
      }

      if (!userData?.user) throw new Error("User data not found");

      setAccessToken(data.accessToken);
      setUser(userData.user);
    } catch (err) {
      console.error("fetchUser error:", err);
      toast.error(err instanceof Error ? err.message : "An error occurred");
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

      toast.success("Login successful");
      return { success: true };
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
      console.error("Login failed:", err);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    phone: string,
    name: string
  ) => {
    setAuthLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, phone, name }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      if (!data.accessToken) {
        throw new Error("No access token returned");
      }

      setAccessToken(data.accessToken);
      await fetchUser(data.accessToken);

      return { success: true };
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
      console.error("Registration failed:", err);
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
      toast.error(err instanceof Error ? err.message : "An error occurred");
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
        register,
        loading,
        accessToken,
        authLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
