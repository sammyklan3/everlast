export type Shipment = {
  id: string;
  trackingNumber: string;
  shippingCompanyId: string;
  description: string | null;
  origin: string;
  destination: string;
  portOfEntryId: string | null;
  weight: number;
  weightUnit: "kg" | "lb" | string;
  status: "pending" | "in_transit" | "delivered" | "cancelled" | string;
  clientId: string;
  transitType: "domestic" | "transit" | "export" | string;
  borderExitPoint: string | null;
  assignedTo: string | null;
  expectedDeliveryDate: string | null;
  actualDeliveryDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: "client" | string;
    status: "active" | "inactive" | string;
    last_login: string | null;
    createdAt: string;
    updatedAt: string;
  };
  agent: any | null;
  shippingCompany: {
    id: string;
    name: string;
    contactInfo: {
      email: string;
      phone: string;
      address: string;
    };
    createdAt: string;
    updatedAt: string;
  };
  entryPort: any | null; // Replace `any` when the structure of entryPort is known
};
