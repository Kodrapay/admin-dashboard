import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TransactionTable } from "@/components/dashboard/TransactionTable";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Filter, Calendar, Search } from "lucide-react";

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

type Stats = {
  processedToday: string;
  successRate: string;
  chargebacks: number;
  avgTicketSize: string;
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
    avgTicketSize: "₦0",
    failedToday: 0,
    pendingSettlements: "₦0",
    disputesThisWeek: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch transactions
        const txResponse = await fetch("http://localhost:8000/admin/transactions");
        if (txResponse.ok) {
          const txData = await txResponse.json();
          const txList = (Array.isArray(txData) ? txData : txData.transactions || []).map((tx: any) => ({
            id: tx.id || tx.reference,
            reference: tx.reference || tx.id,
            customer: tx.customer_name || tx.customer || "Customer",
            email: tx.customer_email || "",
            amount: (tx.amount || 0) / 100,
            currency: tx.currency || "NGN",
            status: (tx.status || "pending") as Transaction["status"],
            date: new Date(tx.created_at || Date.now()).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            merchant: tx.merchant_name || tx.merchant,
          }));
          setTransactions(txList);

          // Calculate stats from transactions
          const total = txList.reduce((sum: number, tx: Transaction) => sum + tx.amount, 0);
          const successful = txList.filter((tx: Transaction) => tx.status === "successful").length;
          const failed = txList.filter((tx: Transaction) => tx.status === "failed").length;
          const successRate = txList.length > 0 ? ((successful / txList.length) * 100).toFixed(1) : "0";
          const avgTicket = txList.length > 0 ? total / txList.length : 0;

          setStats({
            processedToday: `₦${(total / 1000000).toFixed(1)}M`,
            successRate: `${successRate}%`,
            chargebacks: 0,
            avgTicketSize: `₦${avgTicket.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`,
            failedToday: failed,
            pendingSettlements: `₦${(total * 0.12).toLocaleString("en-NG", { maximumFractionDigits: 0 })}`,
            disputesThisWeek: 0,
          });
        }
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
            <p className="text-sm text-muted-foreground">Avg. ticket size</p>
            <p className="text-2xl font-semibold text-foreground mt-1">{stats.avgTicketSize}</p>
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
        <TransactionTable transactions={transactions} showMerchant />
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
