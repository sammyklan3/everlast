import React from "react";
import { RequireRole } from "@/components/RequireRole";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RequireRole role="admin">{children}</RequireRole>;
}
