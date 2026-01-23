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
} from "recharts";
import { Zap, Clock, CreditCard, Target } from "lucide-react";

interface AnalyticsContentProps {
  tab: "revenue" | "bookings" | "customers" | "operations";
  revenueByField: Array<{
    field: string;
    revenue: number;
    bookings: number;
    avgValue: number;
  }>;
  revenueByTimeSlot: Array<{
    slot: string;
    revenue: number;
    bookings: number;
    type: string;
  }>;
  revenueByDayOfWeek: Array<{ day: string; revenue: number; bookings: number }>;
  paymentMethods: Array<{
    method: string;
    value: number;
    color: string;
    amount: number;
  }>;
  bookingVolumeTrends: Array<{
    month: string;
    bookings: number;
    cancellations: number;
    noShows: number;
  }>;
  timeSlotHeatMap: Array<any>;
  fieldUtilization: Array<{
    field: string;
    utilization: number;
    capacity: number;
    actual: number;
  }>;
  customerSegments: Array<{
    segment: string;
    count: number;
    percentage: number;
    revenue: number;
  }>;
  customerRetention: Array<{
    month: string;
    retained: number;
    churned: number;
  }>;
  bookingFrequency: Array<{
    frequency: string;
    customers: number;
    color: string;
  }>;
  discountPerformance: Array<{
    code: string;
    uses: number;
    revenue: number;
    discount: number;
    roi: number;
  }>;
}

export function AnalyticsContent({
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
}: AnalyticsContentProps) {
  if (tab === "revenue") {
    return (
      <div className="space-y-6">
        {/* Revenue by Field */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-gray-900 mb-4">Revenue by Field</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueByField}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="field" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
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
              {revenueByField.map((field, idx) => (
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
          <div>
            <h4 className="text-gray-900 mb-4">Revenue by Time Slot</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueByTimeSlot} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#9ca3af" />
                <YAxis
                  type="category"
                  dataKey="slot"
                  stroke="#9ca3af"
                  width={80}
                />
                <Tooltip />
                <Bar dataKey="revenue" radius={[0, 8, 8, 0]}>
                  {revenueByTimeSlot.map((entry, index) => (
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-gray-900 mb-4">Weekly Revenue Pattern</h4>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={revenueByDayOfWeek}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="revenue" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#ec4899"
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="text-gray-900 mb-4">Payment Methods Distribution</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={paymentMethods}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {paymentMethods.map((method, index) => (
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
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">{method.value}%</span>
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
                {discountPerformance.map((disc, idx) => (
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
        </div>
      </div>
    );
  }

  if (tab === "bookings") {
    return (
      <div className="space-y-6">
        {/* Booking Volume Trends */}
        <div>
          <h4 className="text-gray-900 mb-4">Booking Volume Trends</h4>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={bookingVolumeTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="bookings"
                fill="#3b82f6"
                name="Bookings"
                radius={[8, 8, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="cancellations"
                stroke="#f97316"
                name="Cancellations"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="noShows"
                stroke="#ef4444"
                name="No-Shows"
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-xs text-blue-600 mb-1">Avg. Bookings/Month</p>
              <p className="text-2xl text-blue-900 font-semibold">429</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-xs text-orange-600 mb-1">
                Avg. Cancellation Rate
              </p>
              <p className="text-2xl text-orange-900 font-semibold">7.2%</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-xs text-red-600 mb-1">Avg. No-Show Rate</p>
              <p className="text-2xl text-red-900 font-semibold">3.1%</p>
            </div>
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
                {timeSlotHeatMap.map((row, idx) => (
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
            {fieldUtilization.map((field, idx) => (
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
    return (
      <div className="space-y-6">
        {/* Customer Segments */}
        <div className="grid grid-cols-1 gap-6">
          <div>
            <h4 className="text-gray-900 mb-4">New vs Returning Customers</h4>
            <div className="space-y-4">
              {customerSegments.map((segment, idx) => (
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
              {revenueByField.map((field, idx) => {
                const util = fieldUtilization.find(
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
                      {idx === revenueByField.length - 1 && (
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
