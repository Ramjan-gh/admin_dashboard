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
  PieChart,
  Pie,
  Cell,
} from "recharts";

const BASE_URL = "https://himsgwtkvewhxvmjapqa.supabase.co";

type Breakdown = "daily" | "monthly" | "yearly";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [breakdownType, setBreakdownType] = useState<Breakdown>("daily");

  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const [stats, setStats] = useState<Stat[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [sportsData, setSportsData] = useState<Sport[]>([]);

  // ---------------- HELPERS ----------------
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

  const years = Array.from({ length: 5 }, (_, i) => today.getFullYear() - i);

  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // ---------------- EFFECT ----------------
  useEffect(() => {
    fetchOverview();
  }, [breakdownType, selectedDay, selectedMonth, selectedYear]);

  // ---------------- API ----------------
  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (breakdownType === "daily") {
        params.append("target_day", selectedDay.toString());
        params.append("target_month", selectedMonth.toString());
        params.append("target_year", selectedYear.toString());
      }

      if (breakdownType === "monthly") {
        params.append("target_month", selectedMonth.toString());
        params.append("target_year", selectedYear.toString());
      }

      if (breakdownType === "yearly") {
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Dashboard Overview</h1>

        <div className="flex gap-2">
          {["daily", "monthly", "yearly"].map((t) => (
            <button
              key={t}
              onClick={() => setBreakdownType(t as Breakdown)}
              className={`px-3 py-1 rounded capitalize ${
                breakdownType === t ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        {breakdownType === "daily" && (
          <>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(+e.target.value)}
            >
              {days.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(+e.target.value)}
            >
              {monthNames.map((m, i) => (
                <option key={i} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(+e.target.value)}
            >
              {years.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </>
        )}

        {breakdownType === "monthly" && (
          <>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(+e.target.value)}
            >
              {monthNames.map((m, i) => (
                <option key={i} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(+e.target.value)}
            >
              {years.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </>
        )}

        {breakdownType === "yearly" && (
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(+e.target.value)}
          >
            {years.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        )}
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
