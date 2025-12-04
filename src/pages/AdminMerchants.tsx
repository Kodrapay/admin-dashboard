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
type KYCStatus = "pending" | "approved" | "rejected" | "not_started";

type Merchant = {
  id: string;
  name: string;
  email: string;
  businessName: string;
  status: MerchantStatus;
  kycStatus: KYCStatus; // Added kycStatus
  totalVolume: number;
  currency: string;
  joinedDate: string;
};


type OnboardingItem = {
  id: string;
  business: string;
  stage: string;
  sla: string;
};

export default function AdminMerchants() {
  const [merchantList, setMerchantList] = useState<Merchant[]>([]);
  const [pendingMerchants, setPendingMerchants] = useState<Merchant[]>([]); // New state for pending
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    activeMerchants: 0,
    verifiedToday: 0,
    pendingOnboarding: 0,
  });
  const { toast } = useToast();

  const fetchMerchantsData = async () => {
    setIsLoading(true);
    try {
      // Fetch all merchants (if still needed, otherwise remove)
      // const allMerchantsResponse = await fetch("http://localhost:8000/admin/merchants");
      // if (!allMerchantsResponse.ok) {
      //   throw new Error("Failed to fetch all merchants");
      // }
      // const allMerchantsData = await allMerchantsResponse.json();
      // const transformedAllMerchants = allMerchantsData.map((m: any) => ({
      //   id: m.id,
      //   name: m.name,
      //   email: m.email,
      //   businessName: m.business_name,
      //   status: m.status as MerchantStatus,
      //   kycStatus: m.kyc_status as KYCStatus,
      //   totalVolume: m.total_volume || 0,
      //   currency: "NGN",
      //   joinedDate: new Date(m.created_at || Date.now()).toLocaleDateString("en-US", {
      //     year: "numeric",
      //     month: "short",
      //     day: "numeric",
      //   }),
      // }));
      // setMerchantList(transformedAllMerchants);

      // Fetch pending merchants
      const pendingMerchantsResponse = await fetch(
        "http://localhost:8000/admin/merchants/pending",
      );
      if (!pendingMerchantsResponse.ok) {
        throw new Error("Failed to fetch pending merchants");
      }
      const pendingMerchantsData = await pendingMerchantsResponse.json();
      const transformedPendingMerchants = pendingMerchantsData.map((m: any) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        businessName: m.business_name,
        status: m.status as MerchantStatus,
        kycStatus: m.kyc_status as KYCStatus,
        totalVolume: m.total_volume || 0,
        currency: "NGN",
        joinedDate: new Date(m.created_at || Date.now()).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      }));
      setPendingMerchants(transformedPendingMerchants);

      // Fetch stats
      const statsResponse = await fetch("http://localhost:8000/admin/stats");
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats({
          activeMerchants: statsData.active_merchants || 0,
          verifiedToday: statsData.verified_today || 0,
          pendingOnboarding: statsData.pending_kyc || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load data from database",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchantsData();
  }, [toast]);

  const handleApproveMerchant = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/admin/merchants/${id}/approve`,
        {
          method: "POST",
        },
      );
      if (!response.ok) {
        throw new Error("Failed to approve merchant");
      }
      toast({
        title: "Merchant Approved",
        description: `Merchant ${id} has been approved.`,
      });
      fetchMerchantsData(); // Refresh list
    } catch (error) {
      console.error("Error approving merchant:", error);
      toast({
        title: "Error",
        description: "Failed to approve merchant",
        variant: "destructive",
      });
    }
  };

  const handleRejectMerchant = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/admin/merchants/${id}/reject`,
        {
          method: "POST",
        },
      );
      if (!response.ok) {
        throw new Error("Failed to reject merchant");
      }
      toast({
        title: "Merchant Rejected",
        description: `Merchant ${id} has been rejected.`,
      });
      fetchMerchantsData(); // Refresh list
    } catch (error) {
      console.error("Error rejecting merchant:", error);
      toast({
        title: "Error",
        description: "Failed to reject merchant",
        variant: "destructive",
      });
    }
  };

  const handleAddMerchant = () => {
    toast({
      title: "Coming Soon",
      description: "Manual merchant creation will be available in the next release.",
    });
  };

  const onboardingQueue = pendingMerchants.map((m: Merchant, idx: number) => ({
    id: m.id,
    business: m.businessName,
    stage: "KYC Review",
    sla: `${2 + idx * 2}h`,
  }));

  return (
    <DashboardLayout type="admin" title="Merchants">
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-5 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Active merchants</p>
            <p className="text-xl font-semibold text-foreground">{stats.activeMerchants}</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-success/10 text-success flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Verified today</p>
            <p className="text-xl font-semibold text-foreground">{stats.verifiedToday}</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-warning/10 text-warning flex items-center justify-center">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pending onboarding</p>
            <p className="text-xl font-semibold text-foreground">{stats.pendingOnboarding}</p>
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
          <Button className="gap-2" onClick={handleAddMerchant}>
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
            <MerchantTable
              merchants={pendingMerchants} // Display pending merchants here
              onApprove={handleApproveMerchant}
              onReject={handleRejectMerchant}
            />
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
