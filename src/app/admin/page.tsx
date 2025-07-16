"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import dayjs from "dayjs";

type DashboardData = {
  metrics: any;
  recentUsers: any[];
  shipmentsOverTime: { date: string; count: number }[];
  revenueTrend: { month: string; amount: number }[];
  invoiceStatusSummary: { paid: number; unpaid: number; overdue: number };
  recentActivities: { type: string; description: string; timestamp: string }[];
};

export default function AdminDashboard() {
  const { accessToken } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${API_URL}/stats`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch dashboard data");
        }

        setData(result);
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error);
        toast.error(error.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-md" />
          ))}
      </div>
    );
  }

  if (!data)
    return <p className="p-4 text-red-500">Failed to load dashboard</p>;

  const {
    metrics,
    shipmentsOverTime,
    revenueTrend,
    invoiceStatusSummary,
    recentUsers,
    recentActivities,
  } = data;

  const invoiceData = [
    { name: "Paid", value: invoiceStatusSummary.paid },
    { name: "Unpaid", value: invoiceStatusSummary.unpaid },
    { name: "Overdue", value: invoiceStatusSummary.overdue },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    const { resolvedTheme } = useTheme();

    if (active && payload && payload.length) {
      return (
        <div
          className={`p-2 rounded-md shadow-md border text-sm ${
            resolvedTheme === "dark"
              ? "bg-zinc-800 text-white border-zinc-700"
              : "bg-white text-black border-zinc-200"
          }`}
        >
          <div className="font-semibold">Month: {label}</div>
          <div>Revenue: KSH {Number(payload[0].value).toLocaleString()}</div>
        </div>
      );
    }

    return null;
  };

  const hasInvoiceData = invoiceData.some((item) => item.value > 0);

  const statCard = (label: string, value: number | string) => (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-semibold">Admin Dashboard</h2>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* {statCard("Total Users", metrics.totalUsers)} */}
        {statCard("Total Clients", metrics.totalClients)}
        {/* {statCard("Total Staff", metrics.totalStaff)} */}
        {statCard("Total Shipments", metrics.totalShipments)}
        {/* {statCard("In Progress Shipments", metrics.inProgressShipments)} */}
        {/* {statCard("Completed Shipments", metrics.completedShipments)} */}
        {/* {statCard("Delayed Shipments", metrics.delayedShipments)} */}
        {statCard(
          "Total Revenue",
          `KSH ${metrics.totalRevenue.toLocaleString()}`
        )}
        {/* {statCard("Total Documents", metrics.totalDocuments)} */}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
              Shipments Over Time
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 min-h-[300px] flex items-center justify-center">
            {shipmentsOverTime.length === 0 ? (
              <div className="text-sm text-zinc-500 dark:text-zinc-400">
                No shipment data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={shipmentsOverTime}
                  margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1d1e1eff",
                      borderColor: "#d1d5db",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    labelStyle={{ color: "white" }}
                    cursor={{ stroke: "#c7d2fe", strokeWidth: 1 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 4, stroke: "white", strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Status</CardTitle>
          </CardHeader>
          <CardContent>
            {hasInvoiceData ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={invoiceData}
                    innerRadius={60}
                    outerRadius={100}
                    label
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#facc15" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No invoice data available.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent className="min-h-[300px] flex items-center justify-center">
          {revenueTrend.length === 0 ? (
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              No revenue data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueTrend}>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="month" />
                <YAxis
                  tickFormatter={(value) => Number(value).toLocaleString()}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Users Table + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto min-h-[150px] flex items-center justify-center">
            {recentUsers.length === 0 ? (
              <div className="text-sm text-zinc-500 dark:text-zinc-400">
                No recent users available.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Name</th>
                    <th className="py-2 text-left">Role</th>
                    <th className="py-2 text-left">Email</th>
                    <th className="py-2 text-left">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="py-2">{user.name}</td>
                      <td className="py-2">
                        <Badge variant="outline" className="capitalize">
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-2">{user.email}</td>
                      <td className="py-2">
                        {dayjs(user.createdAt).format("MMM D, YYYY")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 min-h-[150px] flex flex-col justify-center">
            {recentActivities.length === 0 ? (
              <div className="text-sm text-zinc-500 dark:text-zinc-400 text-center">
                No recent activity.
              </div>
            ) : (
              recentActivities.map((activity, idx) => (
                <div key={idx} className="text-sm">
                  <p>{activity.description}</p>
                  <span className="text-muted-foreground text-xs">
                    {dayjs(activity.timestamp).format("MMM D, h:mm A")}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
