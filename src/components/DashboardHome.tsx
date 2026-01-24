import { useState, useEffect, useMemo, useCallback } from "react";
import {
  TrendingUp,
  Calendar,
  AlertCircle,
  Loader2,
  ArrowRight,
  RefreshCcw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// 1. Define the API response interface
interface RevenueApiResponse {
  field_id: string;
  field_name: string;
  period_date: string;
  period_label: string;
  total_revenue: number;
  total_bookings: number;
}

export function DashboardHome() {
  // Default range: Last 30 days
  const [startDate, setStartDate] = useState("2025-12-25");
  const [endDate, setEndDate] = useState("2026-01-24");

  const [apiData, setApiData] = useState<RevenueApiResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. Memoized Headers including start_date and end_date
  const getRequestHeaders = useCallback(
    () => ({
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      start_date: startDate,
      end_date: endDate,
    }),
    [startDate, endDate],
  );

  // 3. API Fetch Logic
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const baseUrl = "https://himsgwtkvewhxvmjapqa.supabase.co";
        const url = `${baseUrl}/rest/v1/rpc/get_revenue_trend`;

        const response = await fetch(url, {
          method: "GET",
          headers: getRequestHeaders() as HeadersInit,
        });

        if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(errorBody.message || "Failed to fetch revenue data");
        }

        const data: RevenueApiResponse[] = await response.json();
        setApiData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate, getRequestHeaders]);

  // 4. Generate a strict continuous date range for the X-Axis
  const chartData = useMemo(() => {
    const dataMap = new Map<string, number>();

    // Map existing API data to date keys
    apiData.forEach((item) => {
      const current = dataMap.get(item.period_date) || 0;
      dataMap.set(item.period_date, current + Number(item.total_revenue));
    });

    const fullRangeData = [];
    let curr = new Date(startDate);
    const last = new Date(endDate);

    // Loop through every day between start and end date
    while (curr <= last) {
      const dateStr = curr.toISOString().split("T")[0];

      fullRangeData.push({
        fullDate: dateStr,
        // Short label for X-Axis (e.g., "Jan 01")
        label: curr.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
        }),
        amount: dataMap.get(dateStr) || 0, // Fallback to 0 if no API data
      });

      curr.setDate(curr.getDate() + 1);
    }

    return fullRangeData;
  }, [apiData, startDate, endDate]);

  const resetDates = () => {
    setStartDate("2025-12-25");
    setEndDate("2026-01-24");
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Revenue Analytics
          </h1>
          <p className="text-gray-500 text-sm">
            Querying via custom date headers
          </p>
        </div>

        <div className="bg-white rounded-xl p-2 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center gap-2">
          <div className="flex items-center gap-2 px-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-sm border-none focus:ring-0 outline-none bg-transparent"
            />
          </div>

          <ArrowRight className="hidden sm:block w-4 h-4 text-gray-300" />

          <div className="flex items-center gap-2 px-2 border-l border-gray-100">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-sm border-none focus:ring-0 outline-none bg-transparent"
            />
          </div>

          <button
            onClick={resetDates}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-400 hover:text-purple-600"
            title="Reset Range"
          >
            <RefreshCcw size={16} />
          </button>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm min-h-[480px] flex flex-col">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Growth Trend</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                Timeline: {startDate} — {endDate}
              </p>
            </div>
          </div>
          {loading ? (
            <Loader2 className="animate-spin text-purple-600 w-5 h-5" />
          ) : (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold">
              <TrendingUp className="w-3 h-3" />
              LIVE
            </div>
          )}
        </div>

        {error ? (
          <div className="flex-1 flex flex-col items-center justify-center text-red-400 bg-red-50/50 rounded-xl border border-dashed border-red-100">
            <AlertCircle size={32} className="mb-2" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        ) : (
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height={380}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
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
                  tick={{ fill: "#9ca3af" }}
                  minTickGap={40}
                  dy={15}
                />
                <YAxis
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#9ca3af" }}
                  tickFormatter={(v) => `৳${v}`}
                />
                <Tooltip
                  cursor={{ stroke: "#c4b5fd", strokeWidth: 1.5 }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                    padding: "12px",
                  }}
                  labelFormatter={(label: any, payload: any[]) => {
                    return payload[0]?.payload?.fullDate || label;
                  }}
                  formatter={(value: number) => [
                    `৳${value.toLocaleString()}`,
                    "Total Revenue",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                  animationDuration={1200}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
