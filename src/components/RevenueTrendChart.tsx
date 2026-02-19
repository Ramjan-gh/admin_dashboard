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
    if (!data || data.length === 0) return [];

    const isSingleDay = startDate === endDate;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysDiff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    const isMonthlyView = daysDiff > 31;

    // CASE 1: SINGLE DAY - HOURLY VIEW
    if (isSingleDay) {
      const hourlyData = data
        .filter((item) => item.slot_start_time !== null)
        .sort((a, b) =>
          String(a.slot_start_time).localeCompare(String(b.slot_start_time)),
        );

      // Group by time slot and sum revenue
      const timeSlotMap = new Map<string, number>();
      hourlyData.forEach((item) => {
        const timeKey = String(item.slot_start_time).slice(0, 5);
        const existing = timeSlotMap.get(timeKey) || 0;
        timeSlotMap.set(timeKey, existing + Number(item.total_revenue || 0));
      });

      return Array.from(timeSlotMap.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([time, amount]) => ({
          displayLabel: time,
          fullDate: `${time}:00`,
          amount: amount,
        }));
    }

    // CASE 2: MONTHLY VIEW (> 31 days)
    if (isMonthlyView) {
      const monthlyMap = new Map<string, { amount: number; label: string }>();

      data.forEach((item) => {
        if (!item.period_date) return;
        // Extract year-month (e.g., "2026-01")
        const monthKey = item.period_date.substring(0, 7);
        const existing = monthlyMap.get(monthKey);
        const amount = Number(item.total_revenue || 0);

        monthlyMap.set(monthKey, {
          amount: (existing?.amount || 0) + amount,
          label: item.period_label || monthKey,
        });
      });

      return Array.from(monthlyMap.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([key, value]) => {
          // Format the month properly (e.g., "Jan 2026")
          const [year, month] = key.split("-");
          const date = new Date(parseInt(year), parseInt(month) - 1, 1);
          const monthLabel = date.toLocaleDateString("en-GB", {
            month: "short",
            year: "numeric",
          });

          return {
            fullDate: monthLabel,
            label: monthLabel,
            amount: value.amount,
          };
        });
    }

    // CASE 3: DAILY VIEW (2-31 days)
    const dailyMap = new Map<string, { amount: number; label: string }>();

    data.forEach((item) => {
      const dateKey = item.period_date;
      if (!dateKey) return;
      const existing = dailyMap.get(dateKey);
      const amount = Number(item.total_revenue || 0);

      dailyMap.set(dateKey, {
        amount: (existing?.amount || 0) + amount,
        label: item.period_label || dateKey,
      });
    });

    // Fill in missing dates with 0 revenue
    const fullRange = [];
    let curr = new Date(startDate);
    const last = new Date(endDate);

    while (curr <= last) {
      const dateStr = curr.toISOString().split("T")[0];
      const entry = dailyMap.get(dateStr);

      fullRange.push({
        fullDate: dateStr,
        label:
          entry?.label ||
          new Date(dateStr).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          }),
        amount: entry?.amount || 0,
      });

      curr.setDate(curr.getDate() + 1);
    }

    return fullRange;
  }, [data, startDate, endDate]);

  const viewType = useMemo(() => {
    if (startDate === endDate) return "Hourly";
    const daysDiff = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return daysDiff > 31 ? "Monthly" : "Daily";
  }, [startDate, endDate]);

  return (
    <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm min-h-[450px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            Revenue Over Time
          </h3>
          <p className="text-xs text-gray-500 mt-1">{viewType} breakdown</p>
        </div>
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
              dataKey={startDate === endDate ? "displayLabel" : "label"}
              fontSize={10}
              tickLine={false}
              axisLine={false}
              minTickGap={30}
              angle={viewType === "Hourly" ? -45 : 0}
              textAnchor={viewType === "Hourly" ? "end" : "middle"}
              height={viewType === "Hourly" ? 60 : 30}
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
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
