"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/Loader";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface ShippingCompany {
  id: string;
  name: string;
}

interface ShipmentFormData {
  trackingNumber: string;
  origin: string;
  destination: string;
  description: string;
  weight: string;
  clientId: string;
  shippingCompanyId: string;
  assignedTo?: string;
}

const CreateShipment: React.FC = () => {
  const { user, accessToken } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [shippingCompanies, setShippingCompanies] = useState<ShippingCompany[]>(
    []
  );

  const [formData, setFormData] = useState<ShipmentFormData>({
    trackingNumber: "",
    origin: "",
    destination: "",
    description: "",
    weight: "",
    clientId: "",
    shippingCompanyId: "",
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, companiesRes] = await Promise.all([
          fetch(`${API_URL}/users`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }),
          fetch(`${API_URL}/companies`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }),
        ]);

        const usersData = await usersRes.json();
        const companiesData = await companiesRes.json();
        setUsers(usersData);
        setShippingCompanies(companiesData);
      } catch (error) {
        toast.error("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: keyof ShipmentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const res = await fetch(`${API_URL}/shipments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create shipment");
      toast.success("Shipment created successfully");
      router.push("/admin/shipments");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const clients = users.filter((u) => u.role === "client");
  const staff = users.filter((u) => u.role === "staff");

  if (loading) return <Loader message="Loading..." fullScreen />;

  return (
    <Card className="max-w-4xl mx-auto my-8 p-2 sm:p-6">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">Create Shipment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Shipment Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Tracking Number *</Label>
              <Input
                name="trackingNumber"
                value={formData.trackingNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Description *</Label>
              <Input
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Origin *</Label>
              <Input
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Destination *</Label>
              <Input
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Weight (kg) *</Label>
              <Input
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Client and Company Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Client *</Label>
              <Select
                onValueChange={(val) => handleSelectChange("clientId", val)}
                value={formData.clientId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem
                      key={client.id}
                      value={client.id}
                      disabled={client.status === "suspended"}
                    >
                      {client.name} ({client.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Shipping Company *</Label>
              <Select
                onValueChange={(val) =>
                  handleSelectChange("shippingCompanyId", val)
                }
                value={formData.shippingCompanyId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Company" />
                </SelectTrigger>
                <SelectContent>
                  {shippingCompanies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Staff Assignment */}
          <div className="flex flex-col gap-2">
            <Label>Assigned To (Staff)</Label>
            <Select
              onValueChange={(val) => handleSelectChange("assignedTo", val)}
              value={formData.assignedTo}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Staff (optional)" />
              </SelectTrigger>
              <SelectContent>
                {staff.map((member) => (
                  <SelectItem
                    key={member.id}
                    value={member.id}
                    disabled={member.status === "suspended"}
                  >
                    {member.name} ({member.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit */}
          <div>
            <Button type="submit" className="w-full" disabled={actionLoading}>
              Create Shipment
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateShipment;
