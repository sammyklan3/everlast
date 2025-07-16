"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Users,
  PackageSearch,
  LogOut,
  FileText,
  ShipIcon,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function NavBar() {
  const { user, logout } = useAuth();
  const role = user?.role;
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const commonLinks = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
  ];

  const roleLinks = {
    admin: [
      {
        label: "Shipping Lines",
        href: "/admin/shipping-lines",
        icon: ShipIcon,
      },
      {
        label: "Shipments",
        href: "/admin/shipments",
        icon: PackageSearch,
      },
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Invoices", href: "/admin/invoices", icon: FileText },
    ],
    staff: [
      { label: "Shipments", href: "/staff/shipments", icon: PackageSearch },
    ],
    client: [{ label: "My Orders", href: "/orders", icon: PackageSearch }],
  };

  const links = [
    ...commonLinks,
    ...(roleLinks[role as keyof typeof roleLinks] || []),
  ];

  return (
    <header className="w-full border-b px-4 md:px-6 py-3 shadow-sm bg-background/60 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-primary">
          Everlast
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center">
          {links.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Right: Avatar & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {/* Avatar Dropdown */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 rounded-full h-9 w-9">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={user?.image || ""}
                      alt={user?.name || ""}
                    />
                    <AvatarFallback>
                      {user?.name?.[0]?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-3 py-2 text-sm font-medium">
                  {user?.name || "User"}
                  <div className="text-xs text-muted-foreground">
                    {user?.email}
                  </div>
                </div>
                <DropdownMenuItem
                  className="cursor-pointer text-red-600"
                  onClick={logout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile Toggle */}
          <Button
            variant="ghost"
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-3 px-4 space-y-2">
          {links.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted hover:text-primary transition"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
