import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { TransactionTable } from "@/components/dashboard/TransactionTable";
import { MerchantTable } from "@/components/dashboard/MerchantTable";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { PendingApprovals } from "@/components/dashboard/PendingApprovals";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, apiClient, fetchFromAPI } from "@/lib/api-client";
import {
  DollarSign,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  TrendingUp,
} from "lucide-react";

type Transaction = {
  id: string;
  reference: string;
  customer: string;
  email: string;
  amount: number;
  currency: string;
  status: "successful" | "pending" | "failed";
  date: string;
  merchant?: string;
};

type Merchant = {
  id: string;
  name: string;
  email: string;
  businessName: string;
  status: "active" | "pending" | "suspended" | "blocked";
  totalVolume: number;
  currency: string;
  joinedDate: string;
};

type DashboardStats = {
  totalRevenue: string;
  activeMerchants: number;
  verifiedToday: number;
  pendingOnboarding: number;
  totalTransactions: number;
  successRate: number;
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [merchantRaw, setMerchantRaw] = useState<any[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: "₦0",
    activeMerchants: 0,
    verifiedToday: 0,
    pendingOnboarding: 0,
    totalTransactions: 0,
    successRate: 0,
  });

  const loadData = async () => {
    // Fetch transactions from admin endpoint
    try {
      const txResp = await fetchFromAPI(apiClient.admin.transactions);
      const txData: any[] = Array.isArray(txResp) ? txResp : txResp.transactions || txResp.data || [];
      setTransactions(
        txData.slice(0, 5).map((tx: any) => ({
          id: tx.id || tx.reference,
          reference: tx.reference || tx.id,
          customer: tx.customer_name || tx.customer || "Customer",
          email: tx.customer_email || "",
          amount: (tx.amount || 0) / 100,
          currency: tx.currency || "NGN",
          status: (tx.status || "pending") as Transaction["status"],
          date: tx.created_at || "",
          merchant: tx.merchant || tx.merchant_name,
        })),
      );
    } catch {
      setTransactions([]);
    }

    // Fetch merchants from admin endpoint
    try {
      const merchResp = await fetchFromAPI(apiClient.admin.merchants);
      const merchData: any[] = Array.isArray(merchResp) ? merchResp : merchResp.merchants || merchResp.data || [];
      setMerchantRaw(merchData);
      setMerchants(
        merchData.slice(0, 5).map((m: any) => ({
          id: m.id,
          name: m.name || m.contact_name || "",
          email: m.email || "",
          businessName: m.business_name || m.businessName || "",
          status: (m.status || "pending") as Merchant["status"],
          totalVolume: (m.total_volume || 0) / 100,
          currency: m.currency || "NGN",
          joinedDate: m.created_at || "",
        })),
      );
    } catch {
      setMerchants([]);
      setMerchantRaw([]);
    }

    // Fetch stats from admin endpoint
    try {
      const statsResp = await fetchFromAPI(`${API_BASE_URL}/admin/stats`);
      const volumeInNaira = (statsResp.total_volume || 0) / 100;
      setStats({
        totalRevenue: `₦${(volumeInNaira / 1000000000).toFixed(1)}B`,
        activeMerchants: statsResp.active_merchants || 0,
        verifiedToday: statsResp.verified_today || 0,
        pendingOnboarding: statsResp.pending_kyc || 0,
        totalTransactions: statsResp.total_transactions || 0,
        successRate: statsResp.success_rate || 0,
      });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <DashboardLayout type="admin" title="Admin Dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Revenue"
          value={stats.totalRevenue}
          change={`₦${((stats.totalTransactions * 4167) / 100).toFixed(2)} avg per txn`}
          changeType="positive"
          icon={DollarSign}
          iconColor="bg-success/10 text-success"
          delay={0}
        />
        <StatsCard
          title="Active Merchants"
          value={stats.activeMerchants.toString()}
          change={`${stats.pendingOnboarding} pending onboarding`}
          changeType={stats.pendingOnboarding > 0 ? "positive" : "neutral"}
          icon={Users}
          iconColor="bg-primary/10 text-primary"
          delay={100}
        />
        <StatsCard
          title="Transactions"
          value={stats.totalTransactions.toLocaleString()}
          change={`${((stats.totalTransactions / 30) || 0).toFixed(0)} per day avg`}
          changeType="positive"
          icon={CreditCard}
          iconColor="bg-warning/10 text-warning"
          delay={200}
        />
        <StatsCard
          title="Success Rate"
          value={`${stats.successRate.toFixed(1)}%`}
          change={stats.successRate >= 90 ? "Excellent performance" : "Needs attention"}
          changeType={stats.successRate >= 90 ? "positive" : "negative"}
          icon={TrendingUp}
          iconColor="bg-accent text-accent-foreground"
          delay={300}
        />
      </div>

      {/* Charts */}
      <div className="mb-8">
        <RevenueChart title="Platform Revenue Overview" />
      </div>

      {/* Pending Approvals */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Pending Approvals</h2>
          <Button variant="outline" size="sm" onClick={loadData}>
            Refresh
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
        <PendingApprovals merchants={merchantRaw} onApprovalChange={loadData} />
      </div>

      {/* Recent Merchants */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Merchants</h2>
          <Button variant="outline" size="sm" onClick={() => navigate("/admin/merchants")}>
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
        <MerchantTable merchants={merchants} />
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Transactions</h2>
          <Button variant="outline" size="sm" onClick={() => navigate("/admin/transactions")}>
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
        <TransactionTable transactions={transactions} showMerchant />
      </div>
    </DashboardLayout>
  );
}
