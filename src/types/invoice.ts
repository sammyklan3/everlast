export type Invoice = {
  id: string;
  amount: string;
  currency: string;
  status: "unpaid" | "paid";
  dueDate: string;
  notes?: string;
  client: {
    name: string;
    email: string;
    phone: string;
  };
  shipment: {
    trackingNumber: string;
    description: string;
    origin: string;
    destination: string;
    weight: number;
    weightUnit: string;
  };
  payments: {
    id: string;
    amount: string;
    method: string;
    status: string;
    paidAt: string;
    reference: string;
  }[];
};

export interface InvoiceCardProps {
  invoice: Invoice;
}
