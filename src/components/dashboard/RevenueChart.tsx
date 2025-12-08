import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RevenueDataPoint {
  name: string;
  revenue: number;
}

interface RevenueChartProps {
  title?: string;
  data: RevenueDataPoint[];
}

export function RevenueChart({ title = "Revenue Overview", data }: RevenueChartProps) {
  const formatValue = (value: number) => {
    const valueInNaira = value / 100;
    if (valueInNaira >= 1000000) {
      return `₦${(valueInNaira / 1000000).toFixed(1)}M`;
    }
    if (valueInNaira >= 1000) {
      return `₦${(valueInNaira / 1000).toFixed(0)}K`;
    }
    return `₦${valueInNaira.toFixed(0)}`;
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
