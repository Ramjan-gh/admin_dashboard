import { useMemo } from "react";
import { TrendingUp, Loader2 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: any[];
  startDate: string;
  endDate: string;
  loading: boolean;
}

export function RevenueTrendChart({
  data,
  startDate,
  endDate,
  loading,
}: Props) {
  const chartData = useMemo(() => {
    const dataMap = new Map<string, number>();
    data.forEach((item) => {
      const current = dataMap.get(item.period_date) || 0;
      dataMap.set(item.period_date, current + Number(item.total_revenue));
    });

    const fullRange = [];
    let curr = new Date(startDate);
    const last = new Date(endDate);

    while (curr <= last) {
      const dateStr = curr.toISOString().split("T")[0];
      fullRange.push({
        fullDate: dateStr,
        label: curr.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
        }),
        amount: dataMap.get(dateStr) || 0,
      });
      curr.setDate(curr.getDate() + 1);
    }
    return fullRange;
  }, [data, startDate, endDate]);

  return (
    <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm min-h-[450px]">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-500" />
          Revenue Over Time
        </h3>
        {loading && (
          <Loader2 className="animate-spin text-purple-600 w-5 h-5" />
        )}
      </div>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f3f4f6"
            />
            <XAxis
              dataKey="label"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              minTickGap={30}
            />
            <YAxis
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `৳${v}`}
            />
            <Tooltip
              labelFormatter={(_, payload) => payload[0]?.payload?.fullDate}
              formatter={(val: number) => [
                `৳${val.toLocaleString()}`,
                "Revenue",
              ]}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#8b5cf6"
              strokeWidth={3}
              fill="url(#colorRev)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
