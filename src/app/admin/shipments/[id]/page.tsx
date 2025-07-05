"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Shipment } from "@/types/shipment";
import { ConfirmDialog } from "@/components/ConfirmDialog";

const ShipmentPage: React.FC<Shipment> = () => {
  const router = useRouter();
  const params = useParams();
  const { accessToken } = useAuth();
  const id = params?.id;
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  async function fetchShipment() {
    try {
      const response = await fetch(`${API_URL}/shipments/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch shipment");
      }

      setShipment(data);
    } catch (error: any) {
      setError(error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (accessToken && id) {
      fetchShipment();
    } else {
      setError("Access token or shipment ID is missing");
      setLoading(false);
    }
  }, [accessToken, id]);

  async function handleDeleteShipment() {
    setActionLoading(true);
    try {
      const response = await fetch(`${API_URL}/shipments/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete shipment");
      }

      setShipment(null);
      router.push("/admin/shipments");
    } catch (error) {
      console.error("Failed to delete shipment:", error);
    } finally {
      setActionLoading(false);
    }
  }

  function handleUpdateShipment() {
    router.push(`/admin/shipments/${shipment?.id}/edit`);
  }

  if (loading)
    return <Loader message="Loading shipment details..." fullScreen />;
  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h2 className="text-xl font-semibold text-red-600">Error</h2>
        <p className="mt-2 text-muted-foreground">{error}</p>
      </div>
    );

  if (!shipment)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h2 className="text-xl font-semibold">No shipment data</h2>
        <p className="mt-2 text-muted-foreground">
          The shipment details could not be found.
        </p>
      </div>
    );

  const {
    trackingNumber,
    status,
    description,
    origin,
    destination,
    transitType,
    weight,
    weightUnit,
    expectedDeliveryDate,
    actualDeliveryDate,
    notes,
    client,
    shippingCompany,
  } = shipment;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Shipment Details
            <Badge variant="outline" className="capitalize">
              {status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Tracking Number</p>
            <p className="font-medium">{trackingNumber}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Transit Type</p>
            <p className="capitalize">{transitType || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Origin</p>
            <p>{origin || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Destination</p>
            <p>{destination || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Weight</p>
            <p>
              {weight} {weightUnit}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Expected Delivery</p>
            <p>
              {expectedDeliveryDate
                ? new Date(expectedDeliveryDate).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Actual Delivery</p>
            <p>
              {actualDeliveryDate
                ? new Date(actualDeliveryDate).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground">Notes</p>
            <p>{notes || "N/A"}</p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p>{client?.name || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p>{client?.email || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p>{client?.phone || "N/A"}</p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Shipping Company</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Company Name</p>
            <p>{shippingCompany?.name || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Contact Email</p>
            <p>{shippingCompany?.contactInfo?.email || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p>{shippingCompany?.contactInfo?.phone || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Address</p>
            <p>{shippingCompany?.contactInfo?.address || "N/A"}</p>
          </div>
        </CardContent>
      </Card>
      {["pending", "cancelled"].includes(status) && (
        <div className="flex justify-end gap-4">
          <Button
            onClick={handleUpdateShipment}
            disabled={!["pending", "cancelled"].includes(status)}
          >
            Update
          </Button>

          <ConfirmDialog
            onConfirm={handleDeleteShipment}
            actionLoading={actionLoading}
            title="Delete this shipment?"
            description="Are you sure you want to delete this shipment? This action is permanent."
          >
            <Button variant="destructive">Delete</Button>
          </ConfirmDialog>
        </div>
      )}
    </div>
  );
};

export default ShipmentPage;
