import React, { useMemo } from "react";
import {
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
  AreaChart,
  Area,
} from "recharts";
import { Zap, Clock, CreditCard, Target } from "lucide-react";
import {
  type RevenueByFieldItem,
  type WeeklyRevenuePatternItem,
  type RevenueTrendItem,
  type PaymentMethodItem,
  type DiscountCodePerformanceItem,
  type RevenueByTimeSlotItem,
  type PaymentChartData,
  type BookingVolumeData,
} from "../../src/components/utils/analytics-api";
import { b } from "framer-motion/dist/types.d-a9pt5qxk";

interface AnalyticsContentProps {
  tab: "revenue" | "bookings" | "customers" | "operations";
  weeksAnalyzed: number;
  revenueByField: RevenueByFieldItem[];
  revenueByTimeSlot: RevenueByTimeSlotItem[];
  revenueByDayOfWeek: WeeklyRevenuePatternItem[];
  paymentMethods: PaymentMethodItem[];
  bookingVolumeTrends: BookingVolumeData[];
  timeSlotHeatMap: WeeklyRevenuePatternItem[];
  fieldUtilization: RevenueByFieldItem[];
  customerSegments: RevenueByFieldItem[];
  customerRetention: RevenueByFieldItem[];
  bookingFrequency: RevenueByFieldItem[];
  discountPerformance: DiscountCodePerformanceItem[];
  fieldsList: any[];
  currentFieldId: string;
  onFieldChange: (id: string) => void;
}

export function AnalyticsContent({
  weeksAnalyzed,
  tab,
  revenueByField,
  revenueByTimeSlot,
  revenueByDayOfWeek,
  paymentMethods,
  bookingVolumeTrends,
  timeSlotHeatMap,
  fieldUtilization,
  customerSegments,
  customerRetention,
  bookingFrequency,
  discountPerformance,
  fieldsList,
  currentFieldId,
  onFieldChange,
}: AnalyticsContentProps) {
  if (tab === "revenue") {
    // Transform API data for charts
    const revenueByFieldChart =
      revenueByField.length > 0
        ? revenueByField.map((item) => ({
            field: item.field_name,
            revenue: item.total_revenue,
            bookings: item.total_bookings,
            avgValue:
              item.total_bookings > 0
                ? Math.round(item.total_revenue / item.total_bookings)
                : 0,
          }))
        : [
            { field: "Field A", revenue: 45000, bookings: 156, avgValue: 288 },
            { field: "Field B", revenue: 38000, bookings: 142, avgValue: 268 },
            { field: "Field C", revenue: 28000, bookings: 98, avgValue: 286 },
            { field: "Field D", revenue: 14000, bookings: 62, avgValue: 226 },
          ];

    const weeklyPatternChart = useMemo(() => {
      if (!revenueByDayOfWeek || revenueByDayOfWeek.length === 0) return [];

      return [...revenueByDayOfWeek]
        .sort((a, b) => a.day_of_week - b.day_of_week) // Ensures Sunday (0) to Saturday (6)
        .map((item) => ({
          day: item.day_name.substring(0, 3), // "Sunday" -> "Sun"
          revenue: Number(item.total_revenue), // Ensure it's a number
          bookings: item.total_bookings,
          avgTicket: Number(item.avg_revenue_per_booking),
        }));
    }, [revenueByDayOfWeek]);

    const paymentMethodsChart: PaymentChartData[] =
      paymentMethods.length > 0
        ? paymentMethods.map((item, index) => {
            const colors = ["#ec4899", "#8b5cf6", "#3b82f6", "#f97316"];
            return {
              method:
                item.payment_method.charAt(0).toUpperCase() +
                item.payment_method.slice(1),
              value: item.percentage,
              color: colors[index % colors.length],
              amount: item.total_amount,
              bookings: item.total_bookings,
            };
          })
        : [];

    const discountPerformanceTable =
      discountPerformance.length > 0
        ? discountPerformance.map((item) => ({
            code: item.code,
            uses: item.total_uses,
            revenue: item.total_revenue,
            discount: item.total_discount_given,
            roi: item.roi_percentage / 100,
          }))
        : [];

    // Mock data for time slot analysis (no API endpoint for this yet)
    const revenueByTimeSlotData =
      revenueByTimeSlot.length > 0
        ? revenueByTimeSlot.map((item) => {
            // 1. Clean up time strings (10:00:00 -> 10:00)
            const start = item.start_time.slice(0, 5);
            const end = item.end_time.slice(0, 5);
            const hour = parseInt(start.split(":")[0]);

            // 2. Determine type based on hour (example logic)
            let slotType = "off-peak";
            if (hour >= 17 && hour <= 21) {
              slotType = "peak"; // 5 PM - 9 PM
            } else if (hour >= 9 && hour < 17) {
              slotType = "mid"; // 9 AM - 5 PM
            }

            return {
              slot: `${start} - ${end}`,
              revenue: Number(item.total_revenue),
              bookings: item.total_bookings,
              type: slotType, // This powers your <Cell /> fill logic
              avgValue: Math.round(Number(item.avg_revenue_per_booking || 0)),
            };
          })
        : [
            /* Your fallback mock data stays here */
          ];

    const bookingVolumeTable = bookingVolumeTrends.map((item) => ({
      bookingDate: item.booking_date,
      totalBookings: item.total_bookings,
      cancelledBookings: item.cancelled_bookings,
    }));

    

    return (
      <div className="space-y-24">
        {/* Revenue by Field */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-gray-900 mb-4">Revenue by Field</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueByFieldChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="field" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" tickFormatter={(v) => `৳${v}`} />
                <Tooltip />
                <Bar
                  dataKey="revenue"
                  fill="url(#revenueGradient)"
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {revenueByFieldChart.map((field, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-700">{field.field}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500">
                      {field.bookings} bookings
                    </span>
                    <span className="text-gray-900 font-medium">
                      ৳{field.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue by Time Slot */}
          <div className="">
            <h4 className="text-gray-900 mb-4">Revenue by Time Slot</h4>
            {/* Dynamic Field Dropdown */}
            <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100">
              <span className="text-[10px] uppercase font-bold text-purple-400">
                Select Field:
              </span>
              <select
                value={currentFieldId}
                onChange={(e) => onFieldChange(e.target.value)}
                className="bg-transparent text-sm font-semibold text-purple-700 focus:ring-0 border-none p-0 cursor-pointer"
              >
                {fieldsList.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                {/* Added margin left to prevent label cutoff */}
                <BarChart
                  data={revenueByTimeSlotData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    stroke="#9ca3af"
                    fontSize={12}
                    tickFormatter={(v) => `৳${v}`}
                  />
                  <YAxis
                    type="category"
                    dataKey="slot"
                    stroke="#9ca3af"
                    fontSize={12}
                    width={100} // Increased width for the labels
                    tick={{ fill: "#6b7280" }} // Cleaner color for readability
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar dataKey="revenue" radius={[0, 4, 4, 0]} barSize={20}>
                    {revenueByTimeSlotData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.type === "peak"
                            ? "#10b981"
                            : entry.type === "mid"
                              ? "#3b82f6"
                              : "#9ca3af"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-gray-600">Peak Hours</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-gray-600">Mid Hours</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400" />
                <span className="text-gray-600">Off-Peak</span>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue by Day of Week & Payment Methods */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-gray-900 font-bold">
                  Weekly Revenue Pattern
                </h4>
                <p className="text-xs text-gray-500">
                  Revenue distribution by day
                </p>
              </div>
              <div className="bg-green-50 text-green-700 px-2 py-1 rounded text-[10px] font-bold">
                {weeksAnalyzed} {weeksAnalyzed === 1 ? "WEEK" : "WEEK"} AVG
              </div>
            </div>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={weeklyPatternChart}
                margin={{ left: 10, right: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  tickFormatter={(val) =>
                    `৳${val > 999 ? (val / 1000).toFixed(1) + "k" : val}`
                  }
                  width={45}
                />
                <Tooltip
                  cursor={{ fill: "#f9fafb" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value: number) => [
                    `$${value.toLocaleString()}`,
                    "Revenue",
                  ]}
                />
                <Bar
                  dataKey="revenue"
                  fill="#8b5cf6"
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                >
                  {/* Dynamic coloring: highlight the highest revenue day */}
                  {weeklyPatternChart.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.revenue > 40000 ? "#7c3aed" : "#a78bfa"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="text-gray-900 mb-4">Payment Methods Distribution</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={paymentMethodsChart}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {paymentMethodsChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {paymentMethodsChart.map((method, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: method.color }}
                    />
                    <span className="text-gray-700">{method.method}</span>
                  </div>
                  <div>
                    <p>Total Booking: {method.bookings}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">
                      {method.value.toFixed(1)}%
                    </span>
                    <span className="text-gray-900 font-medium">
                      ৳{method.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Discount Performance */}
        <div>
          <h4 className="text-gray-900 mb-4">Discount Code Performance</h4>
          {discountPerformanceTable.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                    <th className="pb-3 font-medium">Code</th>
                    <th className="pb-3 font-medium">Uses</th>
                    <th className="pb-3 font-medium">Revenue</th>
                    <th className="pb-3 font-medium">Discount Given</th>
                    <th className="pb-3 font-medium">ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {discountPerformanceTable.map((disc, idx) => (
                    <tr key={idx} className="text-sm border-b border-gray-100">
                      <td className="py-3">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                          {disc.code}
                        </span>
                      </td>
                      <td className="py-3 text-gray-700">{disc.uses}</td>
                      <td className="py-3 text-gray-900 font-medium">
                        ৳{disc.revenue.toLocaleString()}
                      </td>
                      <td className="py-3 text-gray-700">
                        ৳{disc.discount.toLocaleString()}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            disc.roi >= 5
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {disc.roi.toFixed(1)}x
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No discount code data available for the selected period.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (tab === "bookings") {
    // Mock data for bookings tab (no API endpoints available yet)
    const bookingVolumeTrendsData =
      bookingVolumeTrends.length > 0
        ? bookingVolumeTrends.map((item) => ({
            date: item.booking_date,
            bookings: item.total_bookings,
            cancellations: item.cancelled_bookings,
          }))
        : [
            { month: "Jan", bookings: 400, cancellations: 30, noShows: 12 },
            { month: "Feb", bookings: 380, cancellations: 28, noShows: 11 },
            { month: "Mar", bookings: 450, cancellations: 35, noShows: 14 },
            { month: "Apr", bookings: 500, cancellations: 40, noShows: 15 },
            { month: "May", bookings: 480, cancellations: 32, noShows: 13 },
            { month: "Jun", bookings: 520, cancellations: 38, noShows: 16 },
          ];

    const timeSlotHeatMapData = [
      {
        day: "Mon",
        "6AM": 2,
        "9AM": 3,
        "12PM": 2,
        "3PM": 5,
        "6PM": 8,
        "9PM": 3,
      },
      {
        day: "Tue",
        "6AM": 2,
        "9AM": 4,
        "12PM": 3,
        "3PM": 6,
        "6PM": 9,
        "9PM": 2,
      },
      {
        day: "Wed",
        "6AM": 1,
        "9AM": 3,
        "12PM": 2,
        "3PM": 5,
        "6PM": 7,
        "9PM": 2,
      },
      {
        day: "Thu",
        "6AM": 3,
        "9AM": 4,
        "12PM": 3,
        "3PM": 7,
        "6PM": 9,
        "9PM": 4,
      },
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
      {
        day: "Sun",
        "6AM": 3,
        "9AM": 5,
        "12PM": 4,
        "3PM": 8,
        "6PM": 9,
        "9PM": 4,
      },
    ];

    const stats = React.useMemo(() => {
      if (!bookingVolumeTrendsData || bookingVolumeTrendsData.length === 0) {
        return { avgBookings: 0, avgCancelRate: 0 };
      }

      const totalBookings = bookingVolumeTrendsData.reduce(
        (sum, item) => sum + (item.bookings || 0),
        0,
      );
      const totalCancellations = bookingVolumeTrendsData.reduce(
        (sum, item) => sum + (item.cancellations || 0),
        0,
      );

      const avgBookings = Math.round(
        totalBookings / bookingVolumeTrendsData.length,
      );

      // Calculate rate: (Total Cancellations / Total Bookings) * 100
      const avgCancelRate =
        totalBookings > 0
          ? ((totalCancellations / totalBookings) * 100).toFixed(1)
          : 0;

      return { avgBookings, avgCancelRate };
    }, [bookingVolumeTrendsData]);
    

    const fieldUtilizationData =
      revenueByField.length > 0
        ? revenueByField.map((item) => ({
            field: item.field_name,
            utilization: Math.min(
              Math.round((item.total_bookings / 200) * 100),
              100,
            ),
            capacity: 200,
            actual: item.total_bookings,
          }))
        : [
            { field: "Field A", utilization: 78, capacity: 200, actual: 156 },
            { field: "Field B", utilization: 71, capacity: 200, actual: 142 },
            { field: "Field C", utilization: 49, capacity: 200, actual: 98 },
            { field: "Field D", utilization: 31, capacity: 200, actual: 62 },
          ];

    return (
      <div className="space-y-6">
        <h4 className="text-gray-900 mb-4 font-medium">
          Booking Volume Trends
        </h4>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={bookingVolumeTrendsData}>
              <defs>
                {/* Booking Gradient - Blue */}
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                {/* Cancellations Gradient - Orange */}
                <linearGradient
                  id="colorCancellations"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f3f4f6"
              />

              <XAxis
                dataKey="date" // Ensure this matches your data key for the date
                fontSize={11}
                tickLine={false}
                axisLine={false}
                stroke="#9ca3af"
                dy={10}
                tickFormatter={(str) => {
                  const date = new Date(str);
                  if (isNaN(date.getTime())) return str; // Fallback if string isn't a date
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                  });
                }}
              />

              <YAxis
                fontSize={11}
                tickLine={false}
                axisLine={false}
                stroke="#9ca3af"
                dx={-10}
              />

              <Tooltip
                labelFormatter={(value) => {
                  const date = new Date(value);
                  return isNaN(date.getTime())
                    ? value
                    : date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      });
                }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
              />

              <Legend
                verticalAlign="top"
                align="right"
                height={36}
                iconType="circle"
              />

              <Area
                type="monotone"
                dataKey="bookings"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorBookings)"
                name="Bookings"
              />
              <Area
                type="monotone"
                dataKey="cancellations"
                stroke="#f97316"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCancellations)"
                name="Cancellations"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Grid */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
            <p className="text-xs text-blue-600 mb-1 font-medium">
              Avg. Bookings/Day
            </p>
            <p className="text-2xl text-blue-900 font-bold">
              {stats.avgBookings}
            </p>
          </div>
          <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-100">
            <p className="text-xs text-orange-600 mb-1 font-medium">
              Avg. Cancellation Rate
            </p>
            <p className="text-2xl text-orange-900 font-bold">
              {stats.avgCancelRate}%
            </p>
          </div>
        </div>

        {/* Time Slot Heat Map */}
        <div>
          <h4 className="text-gray-900 mb-4">Popular Time Slots (Heat Map)</h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-sm text-gray-500 font-medium p-2">
                    Day
                  </th>
                  {["6AM", "9AM", "12PM", "3PM", "6PM", "9PM"].map((time) => (
                    <th
                      key={time}
                      className="text-center text-sm text-gray-500 font-medium p-2"
                    >
                      {time}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlotHeatMapData.map((row, idx) => (
                  <tr key={idx}>
                    <td className="text-sm text-gray-700 font-medium p-2">
                      {row.day}
                    </td>
                    {["6AM", "9AM", "12PM", "3PM", "6PM", "9PM"].map((time) => {
                      const value = row[time as keyof typeof row] as number;
                      const intensity = value / 10;
                      return (
                        <td key={time} className="p-2">
                          <div
                            className="w-full h-12 rounded flex items-center justify-center text-sm font-medium"
                            style={{
                              backgroundColor: `rgba(139, 92, 246, ${intensity})`,
                              color: intensity > 0.5 ? "white" : "#6b7280",
                            }}
                          >
                            {value}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Field Utilization */}
        <div>
          <h4 className="text-gray-900 mb-4">Field Utilization Rates</h4>
          <div className="space-y-4">
            {fieldUtilizationData.map((field, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 font-medium">
                    {field.field}
                  </span>
                  <span className="text-sm text-gray-500">
                    {field.actual}/{field.capacity} bookings (
                    {field.utilization}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${field.utilization}%`,
                      background:
                        field.utilization >= 70
                          ? "linear-gradient(to right, #10b981, #059669)"
                          : field.utilization >= 50
                            ? "linear-gradient(to right, #3b82f6, #2563eb)"
                            : "linear-gradient(to right, #f97316, #ea580c)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (tab === "customers") {
    // Mock data for customers tab (no API endpoints available yet)
    const customerSegmentsData = [
      { segment: "New", count: 142, percentage: 41, revenue: 35500 },
      { segment: "Returning", count: 200, percentage: 59, revenue: 89500 },
    ];

    const bookingFrequencyData = [
      { frequency: "1 time", customers: 85, color: "#3b82f6" },
      { frequency: "2-5 times", customers: 142, color: "#8b5cf6" },
      { frequency: "6-10 times", customers: 78, color: "#ec4899" },
      { frequency: "10+ times", customers: 37, color: "#f97316" },
    ];

    const customerRetentionData = [
      { month: "Jul", retained: 72, churned: 28 },
      { month: "Aug", retained: 75, churned: 25 },
      { month: "Sep", retained: 78, churned: 22 },
      { month: "Oct", retained: 80, churned: 20 },
      { month: "Nov", retained: 82, churned: 18 },
      { month: "Dec", retained: 85, churned: 15 },
    ];

    return (
      <div className="space-y-6">
        {/* Customer Segments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-gray-900 mb-4">New vs Returning Customers</h4>
            <div className="space-y-4">
              {customerSegmentsData.map((segment, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-medium">
                      {segment.segment} Customers
                    </span>
                    <span className="text-2xl text-gray-900 font-semibold">
                      {segment.count}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${segment.percentage}%`,
                        background:
                          idx === 0
                            ? "linear-gradient(to right, #3b82f6, #8b5cf6)"
                            : "linear-gradient(to right, #ec4899, #f97316)",
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {segment.percentage}% of total
                    </span>
                    <span className="text-gray-700 font-medium">
                      ৳{segment.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Operations Tab
  const revenueByFieldChart =
    revenueByField.length > 0
      ? revenueByField.map((item) => ({
          field: item.field_name,
          revenue: item.total_revenue,
          bookings: item.total_bookings,
          avgValue:
            item.total_bookings > 0
              ? Math.round(item.total_revenue / item.total_bookings)
              : 0,
        }))
      : [
          { field: "Field A", revenue: 45000, bookings: 156, avgValue: 288 },
          { field: "Field B", revenue: 38000, bookings: 142, avgValue: 268 },
          { field: "Field C", revenue: 28000, bookings: 98, avgValue: 286 },
          { field: "Field D", revenue: 14000, bookings: 62, avgValue: 226 },
        ];

  const fieldUtilizationChart =
    revenueByField.length > 0
      ? revenueByField.map((item) => ({
          field: item.field_name,
          utilization: Math.min(
            Math.round((item.total_bookings / 200) * 100),
            100,
          ),
          capacity: 200,
          actual: item.total_bookings,
        }))
      : [
          { field: "Field A", utilization: 78, capacity: 200, actual: 156 },
          { field: "Field B", utilization: 71, capacity: 200, actual: 142 },
          { field: "Field C", utilization: 49, capacity: 200, actual: 98 },
          { field: "Field D", utilization: 31, capacity: 200, actual: 62 },
        ];

  return (
    <div className="space-y-6">
      {/* Field Performance Comparison */}
      <div>
        <h4 className="text-gray-900 mb-4">Field Performance Comparison</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                <th className="pb-3 font-medium">Field</th>
                <th className="pb-3 font-medium">Revenue</th>
                <th className="pb-3 font-medium">Bookings</th>
                <th className="pb-3 font-medium">Avg. Value</th>
                <th className="pb-3 font-medium">Utilization</th>
                <th className="pb-3 font-medium">Performance</th>
              </tr>
            </thead>
            <tbody>
              {revenueByFieldChart.map((field, idx) => {
                const util = fieldUtilizationChart.find(
                  (f) => f.field === field.field,
                );
                return (
                  <tr key={idx} className="text-sm border-b border-gray-100">
                    <td className="py-3 text-gray-900 font-medium">
                      {field.field}
                    </td>
                    <td className="py-3 text-gray-900">
                      ৳{field.revenue.toLocaleString()}
                    </td>
                    <td className="py-3 text-gray-700">{field.bookings}</td>
                    <td className="py-3 text-gray-700">৳{field.avgValue}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          (util?.utilization || 0) >= 70
                            ? "bg-green-100 text-green-700"
                            : (util?.utilization || 0) >= 50
                              ? "bg-blue-100 text-blue-700"
                              : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {util?.utilization}%
                      </span>
                    </td>
                    <td className="py-3">
                      {idx === 0 && (
                        <span className="text-green-600 text-xs">
                          ⭐ Top Performer
                        </span>
                      )}
                      {idx === revenueByFieldChart.length - 1 && (
                        <span className="text-orange-600 text-xs">
                          📊 Needs Attention
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">↑ 12%</span>
          </div>
          <p className="text-xs text-blue-600 mb-1">Avg. Booking Value</p>
          <p className="text-2xl text-blue-900 font-semibold">৳273</p>
        </div>
      </div>

      {/* Peak Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-100">
          <h4 className="text-purple-900 font-medium mb-4">
            🎯 Peak Performance Insights
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5" />
              <p className="text-purple-900">
                <span className="font-medium">Saturday 6-9 PM</span> generates
                highest revenue at ৳10,250/week
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5" />
              <p className="text-purple-900">
                <span className="font-medium">Field A</span> contributes 36% of
                total revenue
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5" />
              <p className="text-purple-900">
                Weekend bookings are{" "}
                <span className="font-medium">42% higher</span> than weekdays
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 border border-orange-100">
          <h4 className="text-orange-900 font-medium mb-4">
            ⚠️ Improvement Opportunities
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5" />
              <p className="text-orange-900">
                <span className="font-medium">Field D utilization</span> at 31%
                - consider promotions
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5" />
              <p className="text-orange-900">
                Off-peak hours (6-9 AM) have{" "}
                <span className="font-medium">68% capacity</span> available
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5" />
              <p className="text-orange-900">
                Wednesday bookings{" "}
                <span className="font-medium">18% below</span> weekly average
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
