import { useMemo } from "react";
import { PieChart as PieChartIcon } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#8b5cf6",
  "#06b6d4",
  "#f59e0b",
  "#ec4899",
  "#10b981",
  "#6366f1",
];

export function RevenueDistributionPie({ data }: { data: any[] }) {
  const { pieData, totalRevenue } = useMemo(() => {
    const map = new Map<string, number>();
    let total = 0;

    data.forEach((item) => {
      const val = Number(item.total_revenue) || 0;
      const current = map.get(item.field_name) || 0;
      map.set(item.field_name, current + val);
      total += val;
    });

    const formattedData = Array.from(map.entries()).map(([name, value]) => ({
      name,
      value,
    }));

    return { pieData: formattedData, totalRevenue: total };
  }, [data]);

  // This function formats the text inside the Legend at the bottom
  const renderLegendText = (value: string, entry: any) => {
    const { payload } = entry;
    // Calculate percentage based on total
    const percentage =
      totalRevenue > 0 ? ((payload.value / totalRevenue) * 100).toFixed(1) : 0;

    return (
      <span className="text-sm font-medium text-gray-700 ml-1">
        {value}{" "}
        <span className="text-gray-400 font-normal">({percentage}%)</span>
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col h-full">
      <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
        <PieChartIcon className="w-5 h-5 text-purple-500" />
        Revenue Share
      </h3>

      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={90}
              paddingAngle={0}
              dataKey="value"
              label={false} // Removed labels from the chart itself
            >
              {pieData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `৳${value.toLocaleString()}`}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={10}
              formatter={renderLegendText} // Custom formatter for the legend text
              wrapperStyle={{ paddingTop: "20px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
