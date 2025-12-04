import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TransactionTable } from "@/components/dashboard/TransactionTable";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Filter, Calendar, Search } from "lucide-react";

const transactions = [
  {
    id: "txn_1001",
    reference: "TXN_001234567",
    customer: "John Doe",
    email: "john@example.com",
    amount: 125000,
    currency: "NGN",
    status: "successful" as const,
    date: "Dec 3, 2024",
    merchant: "TechStore NG",
  },
  {
    id: "txn_1002",
    reference: "TXN_001234568",
    customer: "Jane Smith",
    email: "jane@example.com",
    amount: 45000,
    currency: "NGN",
    status: "successful" as const,
    date: "Dec 3, 2024",
    merchant: "FashionHub",
  },
  {
    id: "txn_1003",
    reference: "TXN_001234569",
    customer: "Mike Johnson",
    email: "mike@example.com",
    amount: 89500,
    currency: "NGN",
    status: "pending" as const,
    date: "Dec 3, 2024",
    merchant: "GadgetWorld",
  },
  {
    id: "txn_1004",
    reference: "TXN_001234570",
    customer: "Sarah Williams",
    email: "sarah@example.com",
    amount: 250000,
    currency: "NGN",
    status: "successful" as const,
    date: "Dec 2, 2024",
    merchant: "LuxuryMart",
  },
  {
    id: "txn_1005",
    reference: "TXN_001234571",
    customer: "David Brown",
    email: "david@example.com",
    amount: 15000,
    currency: "NGN",
    status: "failed" as const,
    date: "Dec 2, 2024",
    merchant: "QuickShop",
  },
];

export default function AdminTransactions() {
  return (
    <DashboardLayout type="admin" title="Transactions">
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Processed today</p>
          <p className="text-2xl font-semibold text-foreground mt-1">₦185.4M</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Success rate</p>
          <p className="text-2xl font-semibold text-foreground mt-1">98.7%</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Chargebacks</p>
          <p className="text-2xl font-semibold text-foreground mt-1 text-warning">3</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Avg. ticket size</p>
          <p className="text-2xl font-semibold text-foreground mt-1">₦54,200</p>
        </Card>
      </div>

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

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Failed today</p>
          <p className="text-xl font-semibold text-destructive mt-1">14</p>
          <p className="text-xs text-muted-foreground mt-2">
            Monitor gateways for elevated declines.
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Pending settlements</p>
          <p className="text-xl font-semibold text-foreground mt-1">₦22.4M</p>
          <p className="text-xs text-muted-foreground mt-2">
            Expected to settle within next 24 hours.
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Disputes this week</p>
          <p className="text-xl font-semibold text-warning mt-1">5</p>
          <Separator className="my-3" />
          <p className="text-xs text-muted-foreground">
            Set automated responses and evidence collection to keep win rates high.
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
