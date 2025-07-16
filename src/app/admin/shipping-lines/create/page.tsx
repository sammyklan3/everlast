"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { ShippingCompany } from "@/types/shippingLines";

const CreateShippingLine: React.FC = () => {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<ShippingCompany>({
    name: "",
    contactInfo: {
      email: "",
      phone: "",
      address: "",
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (["email", "phone", "address"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      toast.success("Shipping line created successfully!");
      router.push("/admin/shipping-lines");
    } catch (error: any) {
      toast.error(error.message || "Failed to create shipping line");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <Card>
        <CardContent className="space-y-6 pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Shipping Line Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Hapag-Lloyd"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Contact Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.contactInfo.email}
                onChange={handleChange}
                placeholder="e.g. contact@hlag.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Contact Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.contactInfo.phone}
                onChange={handleChange}
                placeholder="+254 704 444444"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Office Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.contactInfo.address}
                onChange={handleChange}
                placeholder="Hapag-Lloyd Offices, Nairobi, Kenya"
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              Create Shipping Line
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateShippingLine;
