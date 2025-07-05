"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Building2, Mail, Phone, MapPin } from "lucide-react";
import { ShippingCompany } from "@/types/shippingLines";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const ShippingLines: React.FC = () => {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [companies, setCompanies] = useState<ShippingCompany[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  async function fetchShippingLines() {
    try {
      const response = await fetch(`${API_URL}/companies`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch shipping lines");
      }

      setCompanies(data || []);
    } catch (error: any) {
      console.error("Error fetching shipping lines:", error);
      setError(error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (accessToken) {
      fetchShippingLines();
    } else {
      setError("Access token is missing");
      setLoading(false);
    }
  }, [accessToken]);

  if (loading) {
    return <Loader message="Loading shipping lines..." fullScreen />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Building2 className="w-6 h-6" /> Shipping Lines
        </h1>
        <Button
          variant="default"
          className="px-4 py-2 text-sm font-medium rounded-lg transition"
          onClick={() => {
            router.push("/admin/shipping-lines/create");
          }}
        >
          + Add Shipping Line
        </Button>
      </div>

      {companies.length === 0 ? (
        <div className="text-muted-foreground text-center py-12">
          No shipping lines found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <Card key={company.id} className="hover:shadow-md transition">
              <CardHeader>
                <CardTitle className="text-lg">{company.name}</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="text-sm space-y-2 pt-4">
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <span>{company.contactInfo.email}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <span>{company.contactInfo.phone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <span>{company.contactInfo.address}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShippingLines;
