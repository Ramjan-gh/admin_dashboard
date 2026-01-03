import { useEffect, useMemo, useState } from "react";
import { TrendingUp, Calendar, DollarSign, ChevronDown } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const BASE_URL = "https://himsgwtkvewhxvmjapqa.supabase.co";

type Stat = {
  label: string;
  value: string | number;
  change: string;
  icon: any;
  gradient: string;
};

type Sport = {
  name: string;
  value: number;
  color: string;
};

export function DashboardHome() {
  const today = new Date();

  // ---------------- STATES ----------------
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<"day" | "month" | "year">("day");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState(
    today.toISOString().split("T")[0]
  ); // YYYY-MM-DD
  const [selectedMonth, setSelectedMonth] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`
  ); // YYYY-MM
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const [stats, setStats] = useState<Stat[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [sportsData, setSportsData] = useState<Sport[]>([]);

  // ---------------- HELPERS ----------------
  const getDateLabel = () => {
    if (viewMode === "day") return selectedDate;
    if (viewMode === "month") return selectedMonth;
    return selectedYear.toString();
  };

  const years = Array.from({ length: 5 }, (_, i) => today.getFullYear() - i);

  // ---------------- API ----------------
  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (viewMode === "day") {
        const d = new Date(selectedDate);
        params.append("target_day", d.getDate().toString());
        params.append("target_month", (d.getMonth() + 1).toString());
        params.append("target_year", d.getFullYear().toString());
      }

      if (viewMode === "month") {
        const [year, month] = selectedMonth.split("-").map(Number);
        params.append("target_month", month.toString());
        params.append("target_year", year.toString());
      }

      if (viewMode === "year") {
        params.append("target_year", selectedYear.toString());
      }

      const response = await fetch(
        `${BASE_URL}/rest/v1/rpc/get_overview?${params.toString()}`,
        {
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
            Authorization: `Bearer ${
              import.meta.env.VITE_SUPABASE_ANON_KEY || ""
            }`,
          },
        }
      );

      if (!response.ok) throw new Error(await response.text());

      const data: any[] = await response.json();

      if (!data.length) {
        setStats([]);
        setRevenueData([]);
        setSportsData([]);
        return;
      }

      // ---------------- STATS ----------------
      const totalBookings = data.reduce(
        (s, i) => s + (i.total_bookings || 0),
        0
      );

      const totalRevenue = data.reduce((s, i) => s + (i.total_revenue || 0), 0);

      setStats([
        {
          label: "Total Bookings",
          value: totalBookings,
          change: "+0%",
          icon: Calendar,
          gradient: "from-blue-500 to-cyan-500",
        },
        {
          label: "Revenue",
          value: `৳${totalRevenue.toLocaleString()}`,
          change: "+0%",
          icon: DollarSign,
          gradient: "from-purple-500 to-pink-500",
        },
      ]);

      // ---------------- CHART DATA ----------------
      setRevenueData(
        data.map((i) => ({
          label: i.period_label,
          date: i.period_date,
          amount: i.total_revenue,
        }))
      );

      // ---------------- PIE DATA ----------------
      const colors = ["#f87171", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa"];
      const map: Record<string, Sport> = {};

      data.forEach((i, idx) => {
        if (!map[i.field_name]) {
          map[i.field_name] = {
            name: i.field_name,
            value: i.total_revenue || 0,
            color: colors[idx % colors.length],
          };
        } else {
          map[i.field_name].value += i.total_revenue || 0;
        }
      });

      const arr = Object.values(map);
      const sum = arr.reduce((s, i) => s + i.value, 0);

      setSportsData(
        arr.map((i) => ({
          ...i,
          value: sum ? Math.round((i.value / sum) * 100) : 0,
        }))
      );
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [viewMode, selectedDate, selectedMonth, selectedYear]);

  // ---------------- SORT ----------------
  const sortedRevenueData = useMemo(() => {
    return [...revenueData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [revenueData]);

  if (loading) return <div className="p-6">Loading dashboard...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  // ---------------- UI ----------------
  return (
    <div className="p-6 space-y-6">
      {/* Header with Date Filter */}
      <div className="flex flex-col justify-between lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-1 text-xl font-semibold">
            Dashboard Overview
          </h1>
          <p className="text-gray-500">
            Welcome back! Here's what's happening.
          </p>
        </div>

        {/* Date Filter Controls */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3 mb-1">
            {/* View Mode Selector */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white min-w-[140px] justify-between"
              >
                <span className="text-gray-700">
                  {viewMode === "day" && "Daily View"}
                  {viewMode === "month" && "Monthly View"}
                  {viewMode === "year" && "Yearly View"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => {
                      setViewMode("day");
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700 rounded-t-lg"
                  >
                    Daily View
                  </button>
                  <button
                    onClick={() => {
                      setViewMode("month");
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    Monthly View
                  </button>
                  <button
                    onClick={() => {
                      setViewMode("year");
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700 rounded-b-lg"
                  >
                    Yearly View
                  </button>
                </div>
              )}
            </div>

            {/* Date/Month/Year Picker */}
            {viewMode === "day" && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            )}

            {viewMode === "month" && (
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            )}

            {viewMode === "year" && (
              <div className="relative">
                <button
                  onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white min-w-[140px] justify-between"
                >
                  <span className="text-gray-700">{selectedYear}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {yearDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {years.map((y, idx) => (
                      <button
                        key={y}
                        onClick={() => {
                          setSelectedYear(y);
                          setYearDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700 ${
                          idx === 0 ? "rounded-t-lg" : ""
                        } ${idx === years.length - 1 ? "rounded-b-lg" : ""}`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected Date Display */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">Viewing data for:</p>
            <p className="text-gray-900">{getDateLabel()}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-xl border">
              <div className="flex justify-between mb-3">
                <div className={`p-3 rounded bg-gradient-to-br ${s.gradient}`}>
                  <Icon className="text-white" />
                </div>
                <span className="text-green-600 text-sm">{s.change}</span>
              </div>
              <p className="text-gray-500">{s.label}</p>
              <p className="text-xl font-semibold">{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border">
          <h3 className="mb-4 font-medium">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={sortedRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#8b5cf6"
                fill="#ddd6fe"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <h3 className="mb-4">Popular Sports</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={sportsData}
                dataKey="value"
                innerRadius={50}
                outerRadius={80}
              >
                {sportsData.map((s, i) => (
                  <Cell key={i} fill={s.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
