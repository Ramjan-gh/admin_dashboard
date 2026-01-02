import { useEffect, useMemo, useState } from "react";
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

  const currentMonth = new Date().getMonth() + 1;

  // ✅ timezone-safe today
  const todayDate = new Date(
    new Date().getTime() - new Date().getTimezoneOffset() * 60000
  )
    .toISOString()
    .split("T")[0];

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
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
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || ""}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          breakdown_type: breakdownType,
          target_month: breakdownType === "daily" ? currentMonth : null,
        }),
      });

      if (!response.ok) throw new Error(await response.text());

      const data: any[] = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        setStats([
          {
            label:
              breakdownType === "daily"
                ? "Today's Bookings"
                : "Total Bookings (This Year)",
            value: 0,
            change: "-",
            icon: Calendar,
            gradient: "from-blue-500 to-cyan-500",
          },
          {
            label:
              breakdownType === "daily"
                ? "Revenue (This Month)"
                : "Revenue (This Year)",
            value: "৳0",
            change: "-",
            icon: DollarSign,
            gradient: "from-purple-500 to-pink-500",
          },
        ]);
        setRevenueData([]);
        return;
      }

      // ✅ today bookings
      const todaysBookings = data
        .filter((item) => item.period_date === todayDate)
        .reduce((sum, item) => sum + (item.total_bookings || 0), 0);

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
          label:
            breakdownType === "daily"
              ? "Today's Bookings"
              : "Total Bookings (This Year)",
          value: breakdownType === "daily" ? todaysBookings : totalBookings,
          change: "+0%",
          icon: Calendar,
          gradient: "from-blue-500 to-cyan-500",
        },
        {
          label:
            breakdownType === "daily"
              ? "Revenue (This Month)"
              : "Revenue (This Year)",
          value: `৳${totalRevenue.toLocaleString()}`,
          change: "+0%",
          icon: DollarSign,
          gradient: "from-purple-500 to-pink-500",
        },
      ]);

      // ✅ Store sortable values
      setRevenueData(
        data.map((item) => ({
          label:
            breakdownType === "daily"
              ? new Date(item.period_date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })
              : item.period_label,
          date: item.period_date,
          amount: item.total_revenue,
        }))
      );

    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // ✅ SORT DATA FOR X-AXIS
  const sortedRevenueData = useMemo(() => {
    return [...revenueData].sort((a, b) => {
      if (breakdownType === "daily") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }

      return (
        monthNames.indexOf(a.label) - monthNames.indexOf(b.label)
      );
    });
  }, [revenueData, breakdownType]);

  if (loading) return <div className="p-6">Loading dashboard...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">Dashboard Overview</h1>
          <p className="text-gray-500">
            {breakdownType === "daily"
              ? "Today's performance"
              : "Yearly performance"}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setBreakdownType("daily")}
            className={`px-3 py-1 rounded ${
              breakdownType === "daily"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setBreakdownType("monthly")}
            className={`px-3 py-1 rounded ${
              breakdownType === "monthly"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white border rounded-xl p-6 shadow-sm">
              <div className="flex justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.gradient}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-green-600">{stat.change}</span>
              </div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-lg font-semibold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <div className="flex justify-between mb-4">
          <div>
            <h3 className="font-medium">Revenue Trend</h3>
            <p className="text-sm text-gray-500">
              {breakdownType === "daily"
                ? `This Month (${currentMonthName})`
                : "This Year"}
            </p>
          </div>
          <TrendingUp className="w-5 h-5 text-green-500" />
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={sortedRevenueData}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
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
