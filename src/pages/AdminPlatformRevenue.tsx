import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Percent, Repeat, ArrowUpRight } from "lucide-react";

// Mock Data
const totalRevenue = {
  value: "₦120,450,000",
  change: "+5.2%",
  changeType: "increase",
};

const subscriptionFeesSummary = {
  value: "₦20,100,000",
  change: "+3.1%",
  changeType: "increase",
};

const transactionFeesSummary = {
  value: "₦100,350,000",
  change: "+6.8%",
  changeType: "increase",
};

const subscriptionFees = [
  {
    id: "sub_1",
    plan: "Growth",
    merchant: "Alpha Merchants Ltd.",
    amount: "₦15,000",
    date: "2024-10-01",
    status: "Paid",
  },
  {
    id: "sub_2",
    plan: "Enterprise",
    merchant: "Beta Corp",
    amount: "₦50,000",
    date: "2024-10-05",
    status: "Paid",
  },
  {
    id: "sub_3",
    plan: "Starter",
    merchant: "Gamma Solutions",
    amount: "₦0",
    date: "2024-10-10",
    status: "Free",
  },
  {
    id: "sub_4",
    plan: "Growth",
    merchant: "Delta Services",
    amount: "₦15,000",
    date: "2024-10-15",
    status: "Paid",
  },
  {
    id: "sub_5",
    plan: "Growth",
    merchant: "Epsilon Ventures",
    amount: "₦15,000",
    date: "2024-10-20",
    status: "Paid",
  },
];

const transactionFees = [
  {
    id: "txn_f1",
    merchant: "Alpha Merchants Ltd.",
    transactionId: "txn_abc123",
    percentage: "1.5%",
    baseFee: "₦100",
    amount: "₦2,500",
    date: "2024-10-01",
  },
  {
    id: "txn_f2",
    merchant: "Beta Corp",
    transactionId: "txn_def456",
    percentage: "1.0%",
    baseFee: "₦0",
    amount: "₦15,000",
    date: "2024-10-05",
  },
  {
    id: "txn_f3",
    merchant: "Gamma Solutions",
    transactionId: "txn_ghi789",
    percentage: "1.5%",
    baseFee: "₦100",
    amount: "₦150",
    date: "2024-10-10",
  },
  {
    id: "txn_f4",
    merchant: "Delta Services",
    transactionId: "txn_jkl012",
    percentage: "1.5%",
    baseFee: "₦100",
    amount: "₦3,200",
    date: "2024-10-15",
  },
  {
    id: "txn_f5",
    merchant: "Epsilon Ventures",
    transactionId: "txn_mno345",
    percentage: "1.5%",
    baseFee: "₦100",
    amount: "₦1,800",
    date: "2024-10-20",
  },
];

export default function AdminPlatformRevenue() {
  return (
    <DashboardLayout type="admin" title="Platform Revenue">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Platform Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRevenue.value}</div>
              <p className="text-xs text-muted-foreground">
                {totalRevenue.change} from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Subscription Fees
              </CardTitle>
              <Repeat className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subscriptionFeesSummary.value}</div>
              <p className="text-xs text-muted-foreground">
                {subscriptionFeesSummary.change} from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Transaction Percentages
              </CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactionFeesSummary.value}</div>
              <p className="text-xs text-muted-foreground">
                {transactionFeesSummary.change} from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Subscription Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan</TableHead>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptionFees.map((fee) => (
                  <TableRow key={fee.id}>
                    <TableCell className="font-medium">{fee.plan}</TableCell>
                    <TableCell>{fee.merchant}</TableCell>
                    <TableCell>{fee.amount}</TableCell>
                    <TableCell>{fee.date}</TableCell>
                    <TableCell className="text-right">{fee.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transaction Percentage Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Base Fee</TableHead>
                  <TableHead className="text-right">Revenue Amount</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactionFees.map((fee) => (
                  <TableRow key={fee.id}>
                    <TableCell>{fee.merchant}</TableCell>
                    <TableCell>{fee.transactionId}</TableCell>
                    <TableCell>{fee.percentage}</TableCell>
                    <TableCell>{fee.baseFee}</TableCell>
                    <TableCell className="text-right">{fee.amount}</TableCell>
                    <TableCell>{fee.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
