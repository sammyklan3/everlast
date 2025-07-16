"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader } from "@/components/Loader";
import { InvoiceCard } from "@/components/InvoiceCard";
import type { Invoice } from "@/types/invoice";

const InvoicesPage = () => {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/invoices`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch invoices");
      setInvoices(data);
    } catch (error: any) {
      toast.error(
        error.message || "An error occurred while fetching invoices."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) fetchInvoices();
    else toast.error("Access token is missing");
  }, [accessToken]);

  if (loading) return <Loader fullScreen message="Loading Invoices..." />;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold">Invoices</h1>

      {invoices.length === 0 ? (
        <p className="text-muted-foreground text-center">No invoices found.</p>
      ) : (
        invoices.map((invoice) => (
          <InvoiceCard key={invoice.id} invoice={invoice} />
        ))
      )}
    </div>
  );
};

export default InvoicesPage;
