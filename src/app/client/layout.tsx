import React from "react";
import { RequireRole } from "@/components/RequireRole";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RequireRole role="client">{children}</RequireRole>;
}
