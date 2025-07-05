import React from "react";
import { RequireRole } from "@/components/RequireRole";

export default function StaffLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RequireRole role="staff">{children}</RequireRole>;
}
