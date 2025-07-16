"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/Loader";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      if (user?.role === "admin") {
        router.push("/admin");
      } else if (user?.role === "staff") {
        router.push("/staff");
      } else {
        router.push("/client");
      }
    }
  }, [isAuthenticated, loading, user]);

  if (loading || isAuthenticated) {
    return <Loader message="Checking authentication..." fullScreen={true} />;
  }

  return <>{children}</>;
}
