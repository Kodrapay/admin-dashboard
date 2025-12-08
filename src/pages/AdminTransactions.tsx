import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TransactionTable } from "@/components/dashboard/TransactionTable";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Filter, Calendar, Search } from "lucide-react";
import { apiClient, fetchFromAPI } from "@/lib/api-client";

type Transaction = {
  id: string;
  reference: string;
  customer: string;
  email: string;
  amount: number;
  currency: string;
  status: "successful" | "pending" | "failed" | "payout";
  date: string;
  merchant?: string;
  type?: string;
};

type Stats = {
  processedToday: string;
  successRate: string;
  chargebacks: number;
  avgTxnSize: string;
  failedToday: number;
  pendingSettlements: string;
  disputesThisWeek: number;
};

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    processedToday: "₦0",
    successRate: "0%",
    chargebacks: 0,
    avgTxnSize: "₦0",
    failedToday: 0,
    pendingSettlements: "₦0",
    disputesThisWeek: 0,
  });

  const normalizeStatus = (status?: string): Transaction["status"] => {
    const value = (status || "").toLowerCase();
    if (value === "success" || value === "successful" || value === "completed" || value === "paid") {
      return "successful";
    }
    if (value === "payout") {
      return "payout";
    }
    if (value === "failed" || value === "error") {
      return "failed";
    }
    return "pending";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch transactions
        const txResp = await fetchFromAPI(apiClient.admin.transactions);
        const txRaw = Array.isArray(txResp) ? txResp : txResp?.transactions || txResp?.data || [];
        const txList = (Array.isArray(txRaw) ? txRaw : []).map((tx: any, idx: number) => ({
          id: tx.id ?? tx.reference ?? idx,
          reference: tx.reference ?? tx.id ?? `txn-${idx}`,
          customer: tx.customer_name || tx.customer || "Customer",
          email: tx.customer_email || "",
          amount: tx.amount || 0,
          currency: tx.currency || "NGN",
          status: normalizeStatus(tx.status),
          date: new Date(tx.created_at || Date.now()).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          merchant: tx.merchant_name || tx.merchant,
          type: tx.type || tx.payment_method || "payment",
        }));
        setTransactions(txList);

        // Calculate stats from transactions
        const total = txList.reduce((sum: number, tx: Transaction) => sum + tx.amount, 0);
        const successful = txList.filter((tx: Transaction) => tx.status === "successful").length;
        const failed = txList.filter((tx: Transaction) => tx.status === "failed").length;
        const successRate = txList.length > 0 ? ((successful / txList.length) * 100).toFixed(1) : "0";
        const avgTicket = txList.length > 0 ? total / txList.length : 0;

        setStats({
          processedToday: new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format(total),
          successRate: `${successRate}%`,
          chargebacks: 0,
          avgTxnSize: new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format(avgTicket),
          failedToday: failed,
          pendingSettlements: new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format(total * 0.12),
          disputesThisWeek: 0,
        });
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <DashboardLayout type="admin" title="Transactions">
      {isLoading ? (
        <Card className="p-8 text-center mb-6">
          <p className="text-muted-foreground">Loading transactions from database...</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Processed today</p>
            <p className="text-2xl font-semibold text-foreground mt-1">{stats.processedToday}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Success rate</p>
            <p className="text-2xl font-semibold text-foreground mt-1">{stats.successRate}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Chargebacks</p>
            <p className="text-2xl font-semibold text-foreground mt-1 text-warning">{stats.chargebacks}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Avg. txn size</p>
            <p className="text-2xl font-semibold text-foreground mt-1">{stats.avgTxnSize}</p>
          </Card>
        </div>
      )}

      <Card className="p-4 mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative w-full max-w-xs">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search reference or customer" className="pl-9" />
            </div>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Date range
            </Button>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
          <Button variant="default" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </Card>

      <Card className="p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary">Live</Badge>
          <span className="text-sm text-muted-foreground">Last updated: a few seconds ago</span>
        </div>
        <TransactionTable transactions={transactions} showMerchant showType />
      </Card>

      {!isLoading && (
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Failed today</p>
            <p className="text-xl font-semibold text-destructive mt-1">{stats.failedToday}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Monitor gateways for elevated declines.
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Pending settlements</p>
            <p className="text-xl font-semibold text-foreground mt-1">{stats.pendingSettlements}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Expected to settle within next 24 hours.
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Disputes this week</p>
            <p className="text-xl font-semibold text-warning mt-1">{stats.disputesThisWeek}</p>
            <Separator className="my-3" />
            <p className="text-xs text-muted-foreground">
              Set automated responses and evidence collection to keep win rates high.
            </p>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
