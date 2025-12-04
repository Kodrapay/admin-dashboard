import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MerchantTable } from "@/components/dashboard/MerchantTable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Users, UserPlus, ShieldCheck, Filter } from "lucide-react";

type MerchantStatus = "active" | "pending" | "suspended" | "blocked";

type Merchant = {
  id: string;
  name: string;
  email: string;
  businessName: string;
  status: MerchantStatus;
  totalVolume: number;
  currency: string;
  joinedDate: string;
};

const merchants: Merchant[] = [
  {
    id: "mrc_001",
    name: "Adebayo Ogundimu",
    email: "adebayo@techstore.ng",
    businessName: "TechStore NG",
    status: "active" as const,
    totalVolume: 45000000,
    currency: "NGN",
    joinedDate: "Oct 15, 2024",
  },
  {
    id: "mrc_002",
    name: "Chioma Eze",
    email: "chioma@fashionhub.com",
    businessName: "FashionHub",
    status: "active" as const,
    totalVolume: 28500000,
    currency: "NGN",
    joinedDate: "Sep 20, 2024",
  },
  {
    id: "mrc_003",
    name: "Emeka Nwosu",
    email: "emeka@gadgetworld.ng",
    businessName: "GadgetWorld",
    status: "pending" as const,
    totalVolume: 0,
    currency: "NGN",
    joinedDate: "Dec 1, 2024",
  },
  {
    id: "mrc_004",
    name: "Fatima Mohammed",
    email: "fatima@luxurymart.com",
    businessName: "LuxuryMart",
    status: "active" as const,
    totalVolume: 120000000,
    currency: "NGN",
    joinedDate: "Jun 5, 2024",
  },
];

const onboardingQueue = [
  { id: "kyc_101", business: "SwiftPay Ltd", stage: "Document review", sla: "4h" },
  { id: "kyc_102", business: "Nova Rides", stage: "ID verification", sla: "6h" },
  { id: "kyc_103", business: "DukaMarket", stage: "Business checks", sla: "2h" },
];

export default function AdminMerchants() {
  const [merchantList, setMerchantList] = useState<Merchant[]>(merchants);
  const { toast } = useToast();

  const handleToggleStatus = (id: string, nextStatus: MerchantStatus) => {
    setMerchantList((current) =>
      current.map((merchant) =>
        merchant.id === id ? { ...merchant, status: nextStatus } : merchant,
      ),
    );
    toast({
      title: nextStatus === "blocked" ? "Merchant blocked" : "Merchant unblocked",
      description:
        nextStatus === "blocked"
          ? "This merchant can no longer process payments."
          : "Merchant access has been restored.",
    });
  };

  return (
    <DashboardLayout type="admin" title="Merchants">
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-5 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Active merchants</p>
            <p className="text-xl font-semibold text-foreground">1,234</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-success/10 text-success flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Verified today</p>
            <p className="text-xl font-semibold text-foreground">38</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-warning/10 text-warning flex items-center justify-center">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pending onboarding</p>
            <p className="text-xl font-semibold text-foreground">12</p>
          </div>
        </Card>
      </div>

      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <Input placeholder="Search merchants..." className="w-72" />
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add Merchant
          </Button>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MerchantTable merchants={merchantList} onToggleStatus={handleToggleStatus} />
        </div>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-foreground">Onboarding queue</h3>
            <Badge variant="secondary">{onboardingQueue.length} pending</Badge>
          </div>
          <Separator />
          <div className="space-y-3 mt-4">
            {onboardingQueue.map((item) => (
              <div key={item.id} className="p-3 rounded-lg bg-muted/40 border border-border">
                <p className="font-semibold text-foreground">{item.business}</p>
                <p className="text-sm text-muted-foreground">{item.stage}</p>
                <p className="text-xs text-warning mt-1">SLA: {item.sla}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
