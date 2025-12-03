import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", revenue: 4000000 },
  { name: "Feb", revenue: 3000000 },
  { name: "Mar", revenue: 5000000 },
  { name: "Apr", revenue: 4500000 },
  { name: "May", revenue: 6000000 },
  { name: "Jun", revenue: 5500000 },
  { name: "Jul", revenue: 7000000 },
  { name: "Aug", revenue: 8500000 },
  { name: "Sep", revenue: 7500000 },
  { name: "Oct", revenue: 9000000 },
  { name: "Nov", revenue: 8000000 },
  { name: "Dec", revenue: 10500000 },
];

interface RevenueChartProps {
  title?: string;
}

export function RevenueChart({ title = "Revenue Overview" }: RevenueChartProps) {
  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `₦${(value / 1000000).toFixed(1)}M`;
    }
    return `₦${(value / 1000).toFixed(0)}K`;
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card animate-slide-up">
      <h3 className="text-lg font-semibold text-foreground mb-6">{title}</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(158, 64%, 32%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(158, 64%, 32%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 91%)" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215, 15%, 45%)", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215, 15%, 45%)", fontSize: 12 }}
              tickFormatter={formatValue}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(215, 20%, 91%)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px hsl(215 25% 15% / 0.1)",
              }}
              formatter={(value: number) => [formatValue(value), "Revenue"]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(158, 64%, 32%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
