import { useState, useEffect } from "react";
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
  const [merchantList, setMerchantList] = useState<Merchant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch merchants from API
    const fetchMerchants = async () => {
      try {
        const response = await fetch("http://localhost:7003/admin/merchants");
        if (!response.ok) {
          throw new Error("Failed to fetch merchants");
        }
        const data = await response.json();

        // Transform API response to match our Merchant type
        const transformedData = data.map((m: any) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          businessName: m.business_name,
          status: m.status as MerchantStatus,
          totalVolume: m.total_volume || 0, // From database aggregation
          currency: "NGN",
          joinedDate: new Date(m.created_at || Date.now()).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
        }));

        setMerchantList(transformedData);
      } catch (error) {
        console.error("Error fetching merchants:", error);
        toast({
          title: "Error",
          description: "Failed to load merchants from database",
          variant: "destructive",
        });
        // Fallback to demo data if API fails
        setMerchantList(merchants);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMerchants();
  }, [toast]);

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
          {isLoading ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Loading merchants from database...</p>
            </Card>
          ) : (
            <MerchantTable merchants={merchantList} onToggleStatus={handleToggleStatus} />
          )}
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
