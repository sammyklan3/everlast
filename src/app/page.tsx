"use client";

import React from "react";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ShieldCheck, Truck, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const features = [
  {
    title: "Secure Clearance",
    icon: ShieldCheck,
    description: "Reliable, compliant and encrypted document handling.",
  },
  {
    title: "Real-Time Tracking",
    icon: Truck,
    description: "Track your shipments and documents in real-time.",
  },
  {
    title: "Customizable Workflows",
    icon: Settings,
    description: "Tailor processes to match your operations exactly.",
  },
];

const Home: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();

  function handleGetStarted() {
    if (user?.role === "admin") {
      router.push("/admin");
    } else if (user?.role === "staff") {
      router.push("/staff");
    } else if (user?.role === "client") {
      router.push("/client");
    } else {
      router.push("/login");
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-20 md:py-32">
        <Badge className="mb-4 text-sm" variant="secondary">
          Welcome to Everlast
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">
          Effortless Clearance & Forwarding Operations
        </h1>
        <p className="mt-4 text-muted-foreground max-w-xl text-lg md:text-xl">
          Streamline documentation, tracking, and customs processes with a
          modern, powerful internal system.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <Button className="text-lg px-6 py-4" onClick={handleGetStarted}>
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button variant="ghost" className="text-lg">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 bg-muted/50 dark:bg-muted/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Everlast?
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {features.map((feature, idx) => (
              <Card key={idx} className="p-6">
                <CardContent className="flex flex-col items-start gap-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About or CTA Section */}
      <section className="px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold">
            Built for Speed, Security & Simplicity
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Everlast empowers your clearing & forwarding business with a unified
            platform that scales with your team and clients.
          </p>
          <div className="mt-6">
            <Button size="lg">Request a Demo</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto w-full py-6 border-t text-center text-muted-foreground text-sm">
        © {new Date().getFullYear()} Everlast. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
