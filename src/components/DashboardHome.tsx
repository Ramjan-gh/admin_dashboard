import { useEffect, useState } from "react";
import { TrendingUp, Calendar, DollarSign } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const BASE_URL = "https://himsgwtkvewhxvmjapqa.supabase.co";

type Stat = {
  label: string;
  value: string | number;
  change: string;
  icon: any;
  gradient: string;
};

export function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stat[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [breakdownType, setBreakdownType] = useState<"daily" | "monthly">(
    "daily"
  );

  // 🔹 Current month dynamically
  const currentMonth = new Date().getMonth() + 1;
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentMonthName = monthNames[new Date().getMonth()];

  useEffect(() => {
    fetchOverview();
  }, [breakdownType, currentMonth]);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${BASE_URL}/rest/v1/rpc/get_overview`, {
        method: "POST",
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
          Authorization: `Bearer ${
            import.meta.env.VITE_SUPABASE_ANON_KEY || ""
          }`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          breakdown_type: breakdownType,
          target_month: breakdownType === "daily" ? currentMonth : null,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
      }

      const data: any[] = await response.json();
      console.log("Dashboard Data:", data);

      if (!Array.isArray(data) || data.length === 0) {
        // Handle empty data
        setStats([
          {
            label: "Today's Bookings",
            value: "-",
            change: "-",
            icon: Calendar,
            gradient: "from-blue-500 to-cyan-500",
          },
          {
            label: "Revenue (This Month)",
            value: "-",
            change: "-",
            icon: DollarSign,
            gradient: "from-purple-500 to-pink-500",
          },
        ]);
        setRevenueData([]);
        return;
      }

      // Sum totals
      const totalBookings = data.reduce(
        (sum, item) => sum + (item.total_bookings || 0),
        0
      );
      const totalRevenue = data.reduce(
        (sum, item) => sum + (item.total_revenue || 0),
        0
      );

      setStats([
        {
          label: "Today's Bookings",
          value: totalBookings,
          change: "+0%", // Replace with real % change if available
          icon: Calendar,
          gradient: "from-blue-500 to-cyan-500",
        },
        {
          label: `Revenue (${
            breakdownType === "daily" ? "This Month" : "This Year"
          })`,
          value: `৳${totalRevenue.toLocaleString()}`,
          change: "+0%", // Replace with real % change if available
          icon: DollarSign,
          gradient: "from-purple-500 to-pink-500",
        },
      ]);

      // Map chart data
      const chartData = data.map((item) => ({
        day: breakdownType === "daily" ? item.period_label : item.period_label,
        amount: item.total_revenue,
      }));

      setRevenueData(chartData);
    } catch (err: any) {
      console.error("Dashboard RPC Error:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-gray-900 mb-1 text-xl font-semibold">
            Dashboard Overview
          </h1>
          <p className="text-gray-500">
            Welcome back! Here's what's happening{" "}
            {breakdownType === "daily" ? "this month" : "this year"}.
          </p>
        </div>

        {/* Breakdown type toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setBreakdownType("daily")}
            className={`px-3 py-1 rounded ${
              breakdownType === "daily"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setBreakdownType("monthly")}
            className={`px-3 py-1 rounded ${
              breakdownType === "monthly"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-lg bg-gradient-to-br ${stat.gradient}`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-green-600">{stat.change}</span>
              </div>
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className="text-gray-900 text-lg font-semibold">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl p-6 border shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-gray-900 font-medium">Revenue Trend</h3>
            <p className="text-sm text-gray-500">
              {breakdownType === "daily"
                ? `This Month (${currentMonthName})`
                : "This Year"}
            </p>
          </div>
          <TrendingUp className="w-5 h-5 text-green-500" />
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#8b5cf6"
              fill="url(#colorAmount)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
