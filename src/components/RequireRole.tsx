"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader } from "./Loader";
import NavBar from "./NavBar";

export const RequireRole = ({
  children,
  role,
}: {
  children: React.ReactNode;
  role: "admin" | "staff" | "client";
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.role !== role) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading || user?.role !== role) {
    return <Loader message="Checking permissions..." fullScreen={true} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 px-6 py-4">{children}</main>
    </div>
  );
};
