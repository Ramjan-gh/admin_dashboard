import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { UserVsGuestItem } from "./utils/analytics-api";

interface UserVsGuestPieChartProps {
  userVsGuestData: UserVsGuestItem[];
}

export const UserVsGuestPieChart = ({ userVsGuestData }: UserVsGuestPieChartProps) => {
  // 1. Aggregate the totals from all dates
  const totals = userVsGuestData.reduce(
    (acc, item) => {
      acc.registered += item.registered_user_bookings;
      acc.guest += item.guest_bookings;
      return acc;
    },
    { registered: 0, guest: 0 },
  );

  // 2. Format data for Recharts
  const data = [
    { name: "Registered Users", value: totals.registered },
    { name: "Guest Customers", value: totals.guest },
  ];

  // 3. Define colors (using your existing blue/purple theme)
  const COLORS = ["#3b82f6", "#8b5cf6"];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h4 className="text-gray-900 font-semibold mb-4 text-lg">
        User vs Guest Customers
      </h4>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Optional: Summary stats below the chart */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-600 font-medium">Total Registered</p>
          <p className="text-2xl font-bold text-gray-900">
            {totals.registered}
          </p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-600 font-medium">Total Guests</p>
          <p className="text-2xl font-bold text-gray-900">{totals.guest}</p>
        </div>
      </div>
    </div>
  );
};

export default UserVsGuestPieChart;
