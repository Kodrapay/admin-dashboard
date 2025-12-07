import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { TransactionTable } from "@/components/dashboard/TransactionTable";
import { MerchantTable } from "@/components/dashboard/MerchantTable";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { PendingApprovals } from "@/components/dashboard/PendingApprovals";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
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
  id: string | number;
  reference: string | number;
  customer: string;
  email: string;
  amount: number;
  currency: string;
  status: "successful" | "pending" | "failed";
  date: string;
  merchant?: string;
  type?: string;
};

type Merchant = {
  id: number;
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
  const [isLoading, setIsLoading] = useState(true); // Initialize to true
  const [isError, setIsError] = useState(false);

  const normalizeStatus = (status?: string): Transaction["status"] => {
    const value = (status || "").toLowerCase();
    if (value === "success" || value === "successful" || value === "completed" || value === "paid") {
      return "successful";
    }
    if (value === "failed" || value === "error") {
      return "failed";
    }
    return "pending";
  };

  const loadData = async () => {
    setIsLoading(true);
    setIsError(false); // Reset error state on new load attempt
    try {
      // Fetch transactions from admin endpoint
      const txResp = await fetchFromAPI(apiClient.admin.transactions);
      const txRaw: any[] = Array.isArray(txResp) ? txResp : txResp?.transactions || txResp?.data || [];
      const txData: any[] = Array.isArray(txRaw) ? txRaw : [];
      setTransactions(
        txData.slice(0, 5).map((tx: any, idx: number) => ({
          id: tx.id ?? tx.reference ?? idx,
          reference: tx.reference ?? tx.id ?? `txn-${idx}`,
          customer: tx.customer_name || tx.customer || "Customer",
          email: tx.customer_email || "",
          amount: tx.amount || 0,
          currency: tx.currency || "NGN",
          status: normalizeStatus(tx.status),
          date: tx.created_at || "",
          merchant: tx.merchant || tx.merchant_name,
          type: tx.type || tx.payment_method || "payment",
        })),
      );

      // Fetch merchants from admin endpoint
      const merchResp = await fetchFromAPI(apiClient.admin.merchants);
      const merchRaw: any[] = Array.isArray(merchResp) ? merchResp : merchResp?.merchants || merchResp?.data || [];
      const merchData: any[] = Array.isArray(merchRaw) ? merchRaw : [];
      setMerchantRaw(merchData);
      setMerchants(
        merchData.slice(0, 5).map((m: any, idx: number) => {
          const merchantId = Number(m.id ?? m.merchant_id ?? idx);
          return {
            id: Number.isFinite(merchantId) ? merchantId : idx,
            name: m.name || m.contact_name || "",
            email: m.email || "",
            businessName: m.business_name || m.businessName || "",
            status: (m.status || "pending") as Merchant["status"],
            totalVolume: (m.total_volume || 0) / 100,
            currency: m.currency || "NGN",
            joinedDate: m.created_at || "",
          };
        }),
      );

      // Derive stats from live transactions
      const totalRevenueRaw = txData.reduce((sum, tx: any) => sum + (tx.amount || 0), 0);
      const totalRevenue = totalRevenueRaw / 100;
      const totalTx = txData.length;
      const successCount = txData.filter((t: any) => (t.status || "").toLowerCase() === "successful").length;
      const successRate = totalTx ? (successCount / totalTx) * 100 : 0;

      // Fetch supplemental stats (active merchants, pending, etc.)
      const statsResp = await fetchFromAPI(`${API_BASE_URL}/admin/stats`);
      const safeStats = statsResp && typeof statsResp === "object" ? (statsResp as Record<string, any>) : {};
      setStats({
        totalRevenue: new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 2 }).format(totalRevenue),
        activeMerchants: safeStats.active_merchants || 0,
        verifiedToday: safeStats.verified_today || 0,
        pendingOnboarding: safeStats.pending_kyc || 0,
        totalTransactions: totalTx || safeStats.total_transactions || 0,
        successRate: successRate || safeStats.success_rate || 0,
      });
    } catch (err) {
      console.error("Failed to load admin dashboard data:", err);
      setIsError(true);
      // Optionally reset states to empty if error occurs
      setTransactions([]);
      setMerchants([]);
      setMerchantRaw([]);
      setStats({
        totalRevenue: "₦0",
        activeMerchants: 0,
        verifiedToday: 0,
        pendingOnboarding: 0,
        totalTransactions: 0,
        successRate: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const monthlyRevenueData = useMemo(() => {
    const revenueByMonth: { [key: string]: number } = {};
    transactions.forEach(tx => {
      const month = new Date(tx.date).toLocaleString('en-US', { month: 'short' });
      revenueByMonth[month] = (revenueByMonth[month] || 0) + tx.amount;
    });

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.map(month => ({
      name: month,
      revenue: revenueByMonth[month] || 0
    }));
  }, [transactions]);

  return (
    <DashboardLayout type="admin" title="Admin Dashboard">
      {isLoading && (
        <div className="flex justify-center items-center h-48">
          <p className="text-lg text-muted-foreground">Loading dashboard data...</p>
        </div>
      )}

      {isError && (
        <div className="flex flex-col justify-center items-center h-48 text-destructive">
          <p className="text-lg">Error loading dashboard data.</p>
          <p className="text-sm">Please try again later.</p>
          <Button onClick={loadData} className="mt-4">Retry</Button>
        </div>
      )}

      {!isLoading && !isError && (
        <>
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
            <RevenueChart title="Platform Revenue Overview" data={monthlyRevenueData} />
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
        </>
      )}
    </DashboardLayout>
  );
}
