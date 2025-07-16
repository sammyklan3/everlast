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
  status:
    | "pending"
    | "in_transit"
    | "at_port"
    | "clearing"
    | "cleared"
    | "delivered"
    | "cancelled"
    | string;
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

  agent: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: "staff" | string;
    status: "active" | "inactive" | string;
    last_login: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;

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

  invoice: {
    id: string;
    shipmentId: string;
    issuedTo: string;
    amount: string;
    currency: string;
    status: "paid" | "unpaid" | "partial" | string;
    dueDate: string;
    paidAt: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;

  entryPort: any | null; // Placeholder — update this once the entry port object structure is known
};
