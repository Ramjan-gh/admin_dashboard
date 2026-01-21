import {
  TrendingUp,
  Calendar as CalendarIcon,
  DollarSign,
  Users,
  Clock,
  AlertCircle,
  ChevronDown,
  TrendingDown,
  Target,
  Percent,
  Activity,
  CreditCard,
  UserCheck,
  Package,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ComposedChart,
  Legend,
} from "recharts";
import { useState } from "react";
import { AnalyticsContent } from "../components/AnalyticsContent";

export function DashboardHome() {
  const [viewMode, setViewMode] = useState<"day" | "month" | "year">("month");
  const [selectedDate, setSelectedDate] = useState("2025-12-12");
  const [selectedMonth, setSelectedMonth] = useState("2025-12");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [analyticsTab, setAnalyticsTab] = useState<
    "revenue" | "bookings" | "customers" | "operations"
  >("revenue");

  // Data varies by view mode
  const getRevenueData = () => {
    if (viewMode === "day") {
      // Hourly data for a specific day
      return [
        { label: "6AM", amount: 0 },
        { label: "8AM", amount: 2500 },
        { label: "10AM", amount: 3000 },
        { label: "12PM", amount: 1500 },
        { label: "2PM", amount: 2500 },
        { label: "4PM", amount: 3000 },
        { label: "6PM", amount: 5000 },
        { label: "8PM", amount: 4500 },
        { label: "10PM", amount: 2000 },
      ];
    } else if (viewMode === "month") {
      // Daily data for a month (showing week days)
      return [
        { label: "Mon", amount: 3200 },
        { label: "Tue", amount: 4100 },
        { label: "Wed", amount: 2800 },
        { label: "Thu", amount: 5200 },
        { label: "Fri", amount: 6400 },
        { label: "Sat", amount: 8100 },
        { label: "Sun", amount: 7500 },
      ];
    } else {
      // Monthly data for a year
      return [
        { label: "Jan", amount: 85000 },
        { label: "Feb", amount: 92000 },
        { label: "Mar", amount: 78000 },
        { label: "Apr", amount: 88000 },
        { label: "May", amount: 95000 },
        { label: "Jun", amount: 102000 },
        { label: "Jul", amount: 110000 },
        { label: "Aug", amount: 98000 },
        { label: "Sep", amount: 105000 },
        { label: "Oct", amount: 112000 },
        { label: "Nov", amount: 118000 },
        { label: "Dec", amount: 125000 },
      ];
    }
  };

  const getStats = () => {
    if (viewMode === "day") {
      return [
        {
          label: "Bookings",
          value: "24",
          change: "+12%",
          icon: CalendarIcon,
          gradient: "from-blue-500 to-cyan-500",
        },
        {
          label: "Revenue",
          value: "৳24,000",
          change: "+8%",
          icon: DollarSign,
          gradient: "from-purple-500 to-pink-500",
        },
        {
          label: "Customers",
          value: "18",
          change: "+5",
          icon: Users,
          gradient: "from-pink-500 to-rose-500",
        },
        {
          label: "Pending Payments",
          value: "3",
          change: "-1",
          icon: AlertCircle,
          gradient: "from-orange-500 to-red-500",
        },
      ];
    } else if (viewMode === "month") {
      return [
        {
          label: "Total Bookings",
          value: "458",
          change: "+12%",
          icon: CalendarIcon,
          gradient: "from-blue-500 to-cyan-500",
        },
        {
          label: "Revenue",
          value: "৳125,000",
          change: "+15%",
          icon: DollarSign,
          gradient: "from-purple-500 to-pink-500",
        },
        {
          label: "Active Customers",
          value: "342",
          change: "+23%",
          icon: Users,
          gradient: "from-pink-500 to-rose-500",
        },
        {
          label: "Pending Payments",
          value: "12",
          change: "-3",
          icon: AlertCircle,
          gradient: "from-orange-500 to-red-500",
        },
      ];
    } else {
      return [
        {
          label: "Total Bookings",
          value: "5,496",
          change: "+18%",
          icon: CalendarIcon,
          gradient: "from-blue-500 to-cyan-500",
        },
        {
          label: "Annual Revenue",
          value: "৳1,208,000",
          change: "+22%",
          icon: DollarSign,
          gradient: "from-purple-500 to-pink-500",
        },
        {
          label: "Total Customers",
          value: "1,248",
          change: "+35%",
          icon: Users,
          gradient: "from-pink-500 to-rose-500",
        },
        {
          label: "Avg. Monthly Revenue",
          value: "৳100,667",
          change: "+12%",
          icon: DollarSign,
          gradient: "from-orange-500 to-red-500",
        },
      ];
    }
  };

  const getChartTitle = () => {
    if (viewMode === "day") return "Hourly Revenue";
    if (viewMode === "month") return "Daily Revenue Trend";
    return "Monthly Revenue Trend";
  };

  const getChartSubtitle = () => {
    if (viewMode === "day") return `${selectedDate}`;
    if (viewMode === "month") return `December 2025`;
    return `Year 2025`;
  };

  const getDateLabel = () => {
    if (viewMode === "day") {
      const date = new Date(selectedDate);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    if (viewMode === "month") {
      const [year, month] = selectedMonth.split("-");
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    }
    return `Year ${selectedYear}`;
  };

  const occupancyData = [
    { field: "Field A", bookings: 12 },
    { field: "Field B", bookings: 18 },
    { field: "Field C", bookings: 15 },
    { field: "Field D", bookings: 9 },
  ];

  const sportsData = [
    { name: "Football", value: 45, color: "#3b82f6" },
    { name: "Cricket", value: 30, color: "#8b5cf6" },
    { name: "Badminton", value: 15, color: "#ec4899" },
    { name: "Other", value: 10, color: "#f97316" },
  ];

  const upcomingBookings = [
    {
      id: "1CE6443C",
      customer: "Ramjan Ali",
      time: "08:00 - 09:30",
      sport: "Football",
      field: "Field A",
      status: "confirmed",
    },
    {
      id: "2BF7554D",
      customer: "Karim Ahmed",
      time: "10:00 - 11:30",
      sport: "Cricket",
      field: "Field B",
      status: "confirmed",
    },
    {
      id: "3AG8665E",
      customer: "Rahim Uddin",
      time: "14:00 - 15:30",
      sport: "Football",
      field: "Field A",
      status: "pending",
    },
    {
      id: "4BH9776F",
      customer: "Jamal Hossain",
      time: "16:00 - 17:30",
      sport: "Badminton",
      field: "Field C",
      status: "confirmed",
    },
    {
      id: "5CI0887G",
      customer: "Sakib Khan",
      time: "18:00 - 19:30",
      sport: "Football",
      field: "Field A",
      status: "pending",
    },
  ];

  const revenueData = getRevenueData();
  const stats = getStats();

  // Analytics Data
  const revenueByField = [
    { field: "Field A", revenue: 45000, bookings: 156, avgValue: 288 },
    { field: "Field B", revenue: 38000, bookings: 142, avgValue: 268 },
    { field: "Field C", revenue: 28000, bookings: 98, avgValue: 286 },
    { field: "Field D", revenue: 14000, bookings: 62, avgValue: 226 },
  ];

  const revenueByTimeSlot = [
    { slot: "6-9 AM", revenue: 12000, bookings: 45, type: "off-peak" },
    { slot: "9-12 PM", revenue: 18000, bookings: 62, type: "mid" },
    { slot: "12-3 PM", revenue: 15000, bookings: 52, type: "mid" },
    { slot: "3-6 PM", revenue: 28000, bookings: 98, type: "peak" },
    { slot: "6-9 PM", revenue: 42000, bookings: 145, type: "peak" },
    { slot: "9-12 AM", revenue: 10000, bookings: 36, type: "off-peak" },
  ];

  const revenueByDayOfWeek = [
    { day: "Mon", revenue: 15000, bookings: 52 },
    { day: "Tue", revenue: 16000, bookings: 58 },
    { day: "Wed", revenue: 14000, bookings: 48 },
    { day: "Thu", revenue: 18000, bookings: 65 },
    { day: "Fri", revenue: 22000, bookings: 78 },
    { day: "Sat", revenue: 25000, bookings: 86 },
    { day: "Sun", revenue: 15000, bookings: 71 },
  ];

  const paymentMethods = [
    { method: "bKash", value: 42, color: "#ec4899", amount: 52500 },
    { method: "Nagad", value: 28, color: "#8b5cf6", amount: 35000 },
    { method: "Card", value: 18, color: "#3b82f6", amount: 22500 },
    { method: "Cash", value: 12, color: "#f97316", amount: 15000 },
  ];

  const bookingVolumeTrends = [
    { month: "Jul", bookings: 385, cancellations: 28, noShows: 12 },
    { month: "Aug", bookings: 412, cancellations: 31, noShows: 15 },
    { month: "Sep", bookings: 398, cancellations: 25, noShows: 10 },
    { month: "Oct", bookings: 445, cancellations: 34, noShows: 14 },
    { month: "Nov", bookings: 478, cancellations: 38, noShows: 16 },
    { month: "Dec", bookings: 458, cancellations: 29, noShows: 11 },
  ];

  const timeSlotHeatMap = [
    { day: "Mon", "6AM": 2, "9AM": 3, "12PM": 2, "3PM": 5, "6PM": 8, "9PM": 3 },
    { day: "Tue", "6AM": 2, "9AM": 4, "12PM": 3, "3PM": 6, "6PM": 9, "9PM": 2 },
    { day: "Wed", "6AM": 1, "9AM": 3, "12PM": 2, "3PM": 5, "6PM": 7, "9PM": 2 },
    { day: "Thu", "6AM": 3, "9AM": 4, "12PM": 3, "3PM": 7, "6PM": 9, "9PM": 4 },
    {
      day: "Fri",
      "6AM": 2,
      "9AM": 5,
      "12PM": 4,
      "3PM": 8,
      "6PM": 10,
      "9PM": 3,
    },
    {
      day: "Sat",
      "6AM": 4,
      "9AM": 6,
      "12PM": 5,
      "3PM": 9,
      "6PM": 10,
      "9PM": 5,
    },
    { day: "Sun", "6AM": 3, "9AM": 5, "12PM": 4, "3PM": 8, "6PM": 9, "9PM": 4 },
  ];

  const fieldUtilization = [
    { field: "Field A", utilization: 78, capacity: 200, actual: 156 },
    { field: "Field B", utilization: 71, capacity: 200, actual: 142 },
    { field: "Field C", utilization: 49, capacity: 200, actual: 98 },
    { field: "Field D", utilization: 31, capacity: 200, actual: 62 },
  ];

  const customerSegments = [
    { segment: "New", count: 142, percentage: 41, revenue: 35500 },
    { segment: "Returning", count: 200, percentage: 59, revenue: 89500 },
  ];

  const customerRetention = [
    { month: "Jul", retained: 72, churned: 28 },
    { month: "Aug", retained: 75, churned: 25 },
    { month: "Sep", retained: 78, churned: 22 },
    { month: "Oct", retained: 80, churned: 20 },
    { month: "Nov", retained: 82, churned: 18 },
    { month: "Dec", retained: 85, churned: 15 },
  ];

  const bookingFrequency = [
    { frequency: "1 time", customers: 85, color: "#3b82f6" },
    { frequency: "2-5 times", customers: 142, color: "#8b5cf6" },
    { frequency: "6-10 times", customers: 78, color: "#ec4899" },
    { frequency: "10+ times", customers: 37, color: "#f97316" },
  ];

  const discountPerformance = [
    { code: "WEEKEND20", uses: 86, revenue: 18200, discount: 4550, roi: 4.0 },
    { code: "NEWUSER15", uses: 142, revenue: 28400, discount: 4980, roi: 5.7 },
    { code: "HOLIDAY25", uses: 54, revenue: 12150, discount: 4050, roi: 3.0 },
    { code: "FLASH10", uses: 98, revenue: 22050, discount: 2450, roi: 9.0 },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header with Date Filter */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-1">Dashboard Overview</h1>
          <p className="text-gray-500">
            Welcome back! Here's what's happening.
          </p>
        </div>

        {/* Date Filter Controls */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
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
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            )}
          </div>

          {/* Selected Date Display */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">Viewing data for:</p>
            <p className="text-gray-900">{getDateLabel()}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-lg bg-gradient-to-br ${stat.gradient}`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span
                  className={`text-sm ${stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                >
                  {stat.change}
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
              <p className="text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-gray-900">{getChartTitle()}</h3>
              <p className="text-sm text-gray-500">{getChartSubtitle()}</p>
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
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#8b5cf6"
                fillOpacity={1}
                fill="url(#colorAmount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sports Distribution */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-gray-900 mb-6">Popular Sports</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={sportsData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {sportsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {sportsData.map((sport, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: sport.color }}
                  />
                  <span className="text-gray-700">{sport.name}</span>
                </div>
                <span className="text-gray-900">{sport.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Occupancy & Upcoming Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Field Occupancy */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-gray-900 mb-6">
            Field Occupancy
            {viewMode === "day" && " (Selected Day)"}
            {viewMode === "month" && " (This Week)"}
            {viewMode === "year" && " (This Month)"}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="field" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar
                dataKey="bookings"
                fill="url(#barGradient)"
                radius={[8, 8, 0, 0]}
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Upcoming Bookings */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-900">Upcoming Bookings</h3>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3 max-h-[280px] overflow-y-auto">
            {upcomingBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">{booking.sport[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">
                    {booking.customer}
                  </p>
                  <p className="text-xs text-gray-500">
                    {booking.time} • {booking.field}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    booking.status === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Business Analytics Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Analytics Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setAnalyticsTab("revenue")}
              className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                analyticsTab === "revenue"
                  ? "border-b-2 border-purple-500 text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Revenue Analytics
              </div>
            </button>
            <button
              onClick={() => setAnalyticsTab("bookings")}
              className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                analyticsTab === "bookings"
                  ? "border-b-2 border-purple-500 text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Booking Patterns
              </div>
            </button>
            <button
              onClick={() => setAnalyticsTab("customers")}
              className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                analyticsTab === "customers"
                  ? "border-b-2 border-purple-500 text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                Customer Insights
              </div>
            </button>
            <button
              onClick={() => setAnalyticsTab("operations")}
              className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                analyticsTab === "operations"
                  ? "border-b-2 border-purple-500 text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Operations
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <AnalyticsContent
            tab={analyticsTab}
            revenueByField={revenueByField}
            revenueByTimeSlot={revenueByTimeSlot}
            revenueByDayOfWeek={revenueByDayOfWeek}
            paymentMethods={paymentMethods}
            bookingVolumeTrends={bookingVolumeTrends}
            timeSlotHeatMap={timeSlotHeatMap}
            fieldUtilization={fieldUtilization}
            customerSegments={customerSegments}
            customerRetention={customerRetention}
            bookingFrequency={bookingFrequency}
            discountPerformance={discountPerformance}
          />
        </div>
      </div>
    </div>
  );
}
