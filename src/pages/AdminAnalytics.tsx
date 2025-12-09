import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Globe, Cpu, Activity } from "lucide-react";
import { apiClient, fetchFromAPI } from "@/lib/api-client";

const performance = [
  { label: "Nigeria", value: 64, color: "bg-primary" },
  { label: "Kenya", value: 18, color: "bg-success" },
  { label: "South Africa", value: 12, color: "bg-warning" },
  { label: "Ghana", value: 6, color: "bg-foreground" },
];

const alerts = [
  { title: "Spike detected", detail: "Transaction volume is 21% higher than forecast", type: "info" },
  { title: "FX impact", detail: "USD/NGN volatility could affect cross-border payouts", type: "warning" },
  { title: "Gateway status", detail: "Primary gateway healthy, backup on warm standby", type: "success" },
];

export default function AdminAnalytics() {
  const [revenueData, setRevenueData] = useState<Array<{ name: string; revenue: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const txResp = await fetchFromAPI(apiClient.admin.transactions);
        const txRaw = Array.isArray(txResp) ? txResp : txResp?.transactions || txResp?.data || [];
        const transactions = Array.isArray(txRaw) ? txRaw : [];

        // Group transactions by month
        const monthlyRevenue = new Map<string, number>();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        transactions.forEach((tx: any) => {
          if (tx.status === "success" || tx.status === "successful" || tx.status === "completed" || tx.status === "paid") {
            const date = new Date(tx.created_at || Date.now());
            const monthKey = monthNames[date.getMonth()];
            const amount = tx.amount || 0;
            monthlyRevenue.set(monthKey, (monthlyRevenue.get(monthKey) || 0) + amount);
          }
        });

        // Convert to chart data format
        const chartData = monthNames.map(month => ({
          name: month,
          revenue: monthlyRevenue.get(month) || 0,
        }));

        setRevenueData(chartData);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);
  return (
    <DashboardLayout type="admin" title="Analytics">
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gross volume (30d)</p>
              <p className="text-2xl font-semibold text-foreground">₦2.5B</p>
            </div>
          </div>
          <Progress value={72} />
          <p className="text-xs text-muted-foreground mt-2">72% of monthly target achieved</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-accent text-accent-foreground flex items-center justify-center">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cross-border</p>
              <p className="text-2xl font-semibold text-foreground">28% mix</p>
            </div>
          </div>
          <div className="space-y-3">
            {performance.map((entry) => (
              <div key={entry.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{entry.label}</span>
                  <span className="font-semibold text-foreground">{entry.value}%</span>
                </div>
                <Progress value={entry.value} className={entry.color} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-success/10 text-success flex items-center justify-center">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Platform health</p>
              <p className="text-2xl font-semibold text-foreground">99.97% uptime</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Latency steady at p95: 180ms. No throttling events in the last hour.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">API</Badge>
            <Badge variant="secondary">Webhooks</Badge>
            <Badge variant="secondary">Fraud</Badge>
            <Badge variant="secondary">Compliance</Badge>
          </div>
        </Card>
      </div>

      {isLoading ? (
        <Card className="p-8 text-center mb-6">
          <p className="text-muted-foreground">Loading revenue data...</p>
        </Card>
      ) : (
        <Card className="p-6 mb-6">
          <RevenueChart title="Revenue performance" data={revenueData} />
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {alerts.map((alert) => (
          <Card key={alert.title} className="p-4 flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{alert.title}</p>
              <p className="text-sm text-muted-foreground">{alert.detail}</p>
              <Badge
                className="mt-2"
                variant={alert.type === "warning" ? "destructive" : alert.type === "success" ? "secondary" : "outline"}
              >
                {alert.type}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
