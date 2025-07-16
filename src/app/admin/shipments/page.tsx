"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Mail, Phone, Truck, Info, MapPin } from "lucide-react";
import { Shipment } from "@/types/shipment";
import { ShipmentCard } from "@/components/ShipmentCard";

const Shipments: React.FC = () => {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  async function fetchShipments() {
    try {
      const response = await fetch(`${API_URL}/shipments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch shipments");
      }

      setShipments(data || []);
    } catch (error: any) {
      console.error("Error fetching shipments:", error);
      setError(error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (accessToken) {
      fetchShipments();
    } else {
      setError("Access token is missing");
      setLoading(false);
    }
  }, [accessToken]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
            Pending
          </Badge>
        );
      case "in_transit":
        return (
          <Badge className="bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
            In Transit
          </Badge>
        );
      case "at_port":
        return (
          <Badge className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100">
            At Port
          </Badge>
        );
      case "clearing":
        return (
          <Badge className="bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-100">
            Clearing
          </Badge>
        );
      case "cleared":
        return (
          <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
            Cleared
          </Badge>
        );
      case "delivered":
        return (
          <Badge className="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100">
            Delivered
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100">
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return <Loader message="Loading Shipments..." fullScreen />;
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
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Truck className="w-6 h-6" /> Shipments
        </h1>
        <Button
          variant="default"
          className="px-4 py-2 text-sm font-medium rounded-lg transition"
          onClick={() => {
            // Placeholder for navigation or modal logic
            router.push("/admin/shipments/create");
          }}
        >
          + Create Shipment
        </Button>
      </div>

      {shipments.length === 0 ? (
        <div className="text-muted-foreground text-center py-12">
          No shipments found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shipments.map((shipment) => (
            <ShipmentCard key={shipment.id} shipment={shipment} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shipments;
