import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  change: string;
  Icon: LucideIcon;
  gradient: string;
}

export const StatCard = ({
  label,
  value,
  change,
  Icon,
  gradient,
}: StatCardProps) => (
  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-lg bg-gradient-to-br ${gradient}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span
        className={`text-sm ${change.startsWith("+") ? "text-green-600" : "text-red-600"}`}
      >
        {change}
      </span>
    </div>
    <p className="text-gray-500 text-sm mb-1">{label}</p>
    <p className="text-gray-900 font-bold text-xl">{value}</p>
  </div>
);
