import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { TransactionTable } from "@/components/dashboard/TransactionTable";
import { MerchantTable } from "@/components/dashboard/MerchantTable";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  TrendingUp,
} from "lucide-react";

const recentTransactions = [
  {
    id: "1",
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
    id: "2",
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
    id: "3",
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
    id: "4",
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
    id: "5",
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

const recentMerchants = [
  {
    id: "1",
    name: "Adebayo Ogundimu",
    email: "adebayo@techstore.ng",
    businessName: "TechStore NG",
    status: "active" as const,
    totalVolume: 45000000,
    currency: "NGN",
    joinedDate: "Oct 15, 2024",
  },
  {
    id: "2",
    name: "Chioma Eze",
    email: "chioma@fashionhub.com",
    businessName: "FashionHub",
    status: "active" as const,
    totalVolume: 28500000,
    currency: "NGN",
    joinedDate: "Sep 20, 2024",
  },
  {
    id: "3",
    name: "Emeka Nwosu",
    email: "emeka@gadgetworld.ng",
    businessName: "GadgetWorld",
    status: "pending" as const,
    totalVolume: 0,
    currency: "NGN",
    joinedDate: "Dec 1, 2024",
  },
  {
    id: "4",
    name: "Fatima Mohammed",
    email: "fatima@luxurymart.com",
    businessName: "LuxuryMart",
    status: "active" as const,
    totalVolume: 120000000,
    currency: "NGN",
    joinedDate: "Jun 5, 2024",
  },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout type="admin" title="Admin Dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Revenue"
          value="₦2.5B"
          change="+12.5% from last month"
          changeType="positive"
          icon={DollarSign}
          iconColor="bg-success/10 text-success"
          delay={0}
        />
        <StatsCard
          title="Active Merchants"
          value="1,234"
          change="+48 new this month"
          changeType="positive"
          icon={Users}
          iconColor="bg-primary/10 text-primary"
          delay={100}
        />
        <StatsCard
          title="Transactions"
          value="45.2K"
          change="+8.3% from last month"
          changeType="positive"
          icon={CreditCard}
          iconColor="bg-warning/10 text-warning"
          delay={200}
        />
        <StatsCard
          title="Success Rate"
          value="98.7%"
          change="-0.2% from last month"
          changeType="negative"
          icon={TrendingUp}
          iconColor="bg-accent text-accent-foreground"
          delay={300}
        />
      </div>

      {/* Charts */}
      <div className="mb-8">
        <RevenueChart title="Platform Revenue Overview" />
      </div>

      {/* Recent Merchants */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Merchants</h2>
          <Button variant="outline" size="sm">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
        <MerchantTable merchants={recentMerchants} />
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Transactions</h2>
          <Button variant="outline" size="sm">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
        <TransactionTable transactions={recentTransactions} showMerchant />
      </div>
    </DashboardLayout>
  );
}
