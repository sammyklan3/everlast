"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  Info,
  MapPin,
  FileText,
  Weight,
  Truck,
} from "lucide-react";
import { Shipment } from "@/types/shipment";
import { format } from "date-fns";

interface ShipmentCardProps {
  shipment: Shipment;
}

const getStatusBadge = (status: string) => {
  const base = "text-xs text-white px-2 py-0.5 rounded-full";
  switch (status) {
    case "pending":
      return (
        <Badge className={`${base} bg-gray-500 dark:bg-gray-800`}>
          Pending
        </Badge>
      );
    case "in_transit":
      return (
        <Badge className={`${base} bg-blue-200 dark:bg-blue-800`}>
          In Transit
        </Badge>
      );
    case "at_port":
      return (
        <Badge className={`${base} bg-yellow-100 dark:bg-yellow-800`}>
          At Port
        </Badge>
      );
    case "clearing":
      return (
        <Badge className={`${base} bg-orange-100 dark:bg-orange-800`}>
          Clearing
        </Badge>
      );
    case "cleared":
      return (
        <Badge className={`${base} bg-green-100 dark:bg-green-800`}>
          Cleared
        </Badge>
      );
    case "delivered":
      return (
        <Badge className={`${base} bg-emerald-100 dark:bg-emerald-800`}>
          Delivered
        </Badge>
      );
    case "cancelled":
      return (
        <Badge className={`${base} bg-red-100 dark:bg-red-800`}>
          Cancelled
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const ShipmentCard: React.FC<ShipmentCardProps> = ({ shipment }) => {
  const hasInvoice = shipment.invoice !== null;

  return (
    <Link href={`/admin/shipments/${shipment.id}`}>
      <Card className="hover:shadow-md transition rounded-2xl border border-border">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-semibold tracking-tight">
              {shipment.trackingNumber}
            </CardTitle>
            {hasInvoice && (
              <Badge className="bg-emerald-500 dark:bg-emerald-800 text-xs flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Invoiced
              </Badge>
            )}
          </div>
          <CardDescription className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            {getStatusBadge(shipment.status)}
            <span className="capitalize">{shipment.transitType}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 pt-2 text-sm">
          <div className="text-muted-foreground">
            {shipment.description ?? "No description"}
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>
              {shipment.origin} → {shipment.destination}
            </span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Weight className="w-4 h-4" />
            <span>
              Weight:{" "}
              {shipment.weightUnit === "kg" && shipment.weight > 1000
                ? `${(shipment.weight / 1000).toFixed(2)} tonnes`
                : `${shipment.weight} ${shipment.weightUnit}`}
            </span>
          </div>

          {shipment.notes && (
            <div className="flex gap-2 items-start">
              <Info className="w-4 h-4 mt-0.5 text-muted-foreground" />
              <span className="text-muted-foreground">{shipment.notes}</span>
            </div>
          )}

          <Separator className="my-2" />

          <div className="space-y-1">
            <div className="font-medium">{shipment.client.name}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="w-4 h-4" />
              {shipment.client.email}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="w-4 h-4" />+{shipment.client.phone}
            </div>
          </div>

          <div className="pt-2 text-xs text-muted-foreground flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Shipping via <strong>{shipment.shippingCompany.name}</strong>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
