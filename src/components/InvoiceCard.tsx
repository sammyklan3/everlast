import { FC, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InvoiceCardProps } from "@/types/invoice";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  FileText,
  Clock,
  CheckCircle2,
  Package,
  User,
  CreditCard,
} from "lucide-react";
import { format } from "date-fns";

export const InvoiceCard: FC<InvoiceCardProps> = ({ invoice }) => {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleRequestPayment = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ invoiceId: invoice.id }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.message || data.error || "Failed to request payment"
        );
      }

      toast.success("Payment request sent successfully");
      router.push(`/admin/invoices`);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border shadow-md rounded-2xl overflow-hidden">
      <CardHeader className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <div className="flex items-center gap-2 text-lg font-medium">
          <FileText className="w-5 h-5 text-primary" />
          Invoice for {invoice.client.name}
        </div>
        <Badge
          variant={invoice.status === "paid" ? "secondary" : "destructive"}
          className="p-1"
        >
          {invoice.status.toUpperCase()}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Amount & Due Date */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b pb-4">
          <div className="text-xl font-bold text-primary">
            {invoice.currency}{" "}
            {Number(invoice.amount).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            Due: {format(new Date(invoice.dueDate), "PPP")}
          </div>
        </div>

        {/* Client Info */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <User className="w-4 h-4" />
              <span className="font-semibold">Client Info</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm">Name: {invoice.client.name}</p>
              <p className="text-sm">Email: {invoice.client.email}</p>
              <p className="text-sm">Phone: +{invoice.client.phone}</p>
            </div>
          </div>

          {/* Shipment Info */}
          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Package className="w-4 h-4" />
              <span className="font-semibold">Shipment</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm">
                Tracking: {invoice.shipment.trackingNumber}
              </p>
              <p className="text-sm">{invoice.shipment.description}</p>
              <p className="text-sm">
                From {invoice.shipment.origin} → {invoice.shipment.destination}
              </p>
              <p className="text-sm">
                Weight: {invoice.shipment.weight} {invoice.shipment.weightUnit}
              </p>
            </div>
          </div>

          {/* Notes (if any) */}
          {invoice.notes && (
            <div>
              <div className="text-muted-foreground font-semibold mb-1">
                Notes
              </div>
              <p className="text-sm italic text-muted-foreground">
                {invoice.notes}
              </p>
            </div>
          )}
        </div>

        {/* Payments */}
        {invoice.payments.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CreditCard className="w-4 h-4" />
              <span className="font-semibold">Payments</span>
            </div>
            {invoice.payments.map((payment) => (
              <div
                key={payment.id}
                className="flex justify-between items-center bg-muted/30 p-2 rounded-md text-sm"
              >
                <div>
                  <p>
                    {payment.method.toUpperCase()} •{" "}
                    {Number(payment.amount).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    • Ref: {payment.reference}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Paid at: {format(new Date(payment.paidAt), "PPPp")}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {payment.status === "pending" ? (
                    <>
                      <Clock className="w-4 h-4 text-yellow-500" />
                      <span className="text-yellow-600">Pending</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-green-600">Paid</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Request Payment Button */}
        {["unpaid", "overdue"].includes(invoice.status) &&
          invoice.payments.length === 0 && (
            <div className="pt-4">
              <Button
                disabled={loading}
                onClick={handleRequestPayment}
                className="w-full"
              >
                Request Payment
              </Button>
            </div>
          )}
      </CardContent>
    </Card>
  );
};
