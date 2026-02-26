import { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  AlertCircle,
  ArrowRight,
  RefreshCcw,
  Loader2,
  DollarSign,
  Activity,
  UserCheck,
  Target,
} from "lucide-react";
import { RevenueTrendChart } from "./RevenueTrendChart";
import { RevenueDistributionPie } from "./RevenueDistributionPie";
import { AnalyticsContent } from "./AnalyticsContent";

const calculateWeeksBetween = (start: string, end: string): number => {
  const d1 = new Date(start);
  const d2 = new Date(end);
  const diffInMs = Math.abs(d2.getTime() - d1.getTime());
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  return Math.max(1, Math.ceil(diffInDays / 7));
};

export function DashboardHome() {
  // 1. Core State
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 10); // 10 days ago
    return date.toISOString().split("T")[0];
  });

  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0]; // Today
  });
  const [fieldId, setFieldId] = useState<string>("");
  const [fieldsList, setFieldsList] = useState<any[]>([]);

  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyticsTab, setAnalyticsTab] = useState<
    "revenue" | "bookings" | "customers" | "operations"
  >("revenue");

  const [analyticsData, setAnalyticsData] = useState({
    revenueByField: [],
    revenueByTimeSlot: [],
    revenueByDayOfWeek: [],
    paymentMethods: [],
    discountPerformance: [],
    bookingVolumeTrends: [],
    timeSlotHeatMap: [],
    fieldUtilization: [],
    userVsGuest: [],
    customerSegments: [],
    customerRetention: [],
    bookingFrequency: [],
  });

  // 2. Data Fetching Logic
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const headers = {
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    };

    const baseUrl = "https://himsgwtkvewhxvmjapqa.supabase.co/rest/v1/rpc";

    try {
      const weeksToAnalyze = calculateWeeksBetween(startDate, endDate);
      console.log(`Fetching pattern for ${weeksToAnalyze} weeks`);
      // Step A: Always get the latest list of fields
      const fieldsRes = await fetch(`${baseUrl}/get_fields`, { headers });
      const availableFields = fieldsRes.ok ? await fieldsRes.json() : [];
      setFieldsList(availableFields);

      // Step B: Determine which Field ID to use for the detailed queries
      // If we don't have a fieldId yet, default to the first one in the list
      const activeFieldId =
        fieldId || (availableFields.length > 0 ? availableFields[0].id : null);

      if (!fieldId && activeFieldId) {
        setFieldId(activeFieldId);
      }

      // Step C: Fetch all analytics data in parallel
      const [
        trendRes,
        fields,
        weekly,
        slots,
        payments,
        discounts,
        bookingVolume,
        timeSlotHeatMap,
        fieldUtilization,
        userVsGuest,
      ] = await Promise.all([
        fetch(
          `${baseUrl}/get_revenue_trend?start_date=${startDate}&end_date=${endDate}`,
          { headers },
        ).then((res) => (res.ok ? res.json() : [])),

        fetch(
          `${baseUrl}/get_revenue_by_field?start_date=${startDate}&end_date=${endDate}`,
          { headers },
        ).then((res) => (res.ok ? res.json() : [])),

        fetch(
          `${baseUrl}/get_weekly_revenue_pattern?weeks_to_analyze=${weeksToAnalyze}`,
          {
            headers,
          },
        ).then((res) => (res.ok ? res.json() : [])),

        fetch(
          `${baseUrl}/get_revenue_by_time_slot?p_field_id=${activeFieldId}&start_date=${startDate}&end_date=${endDate}`,
          { headers },
        ).then(async (res) => {
          if (!res.ok) {
            const err = await res.json();
            console.error("❌ Time Slot API Error:", err);
            return [];
          }
          return res.json();
        }),

        fetch(
          `${baseUrl}/get_payment_methods_distribution?start_date=${startDate}&end_date=${endDate}`,
          { headers },
        ).then((res) => (res.ok ? res.json() : [])),

        fetch(
          `${baseUrl}/get_discount_code_performance?start_date=${startDate}&end_date=${endDate}`,
          { headers },
        ).then((res) => (res.ok ? res.json() : [])),
        fetch(
          `${baseUrl}/get_booking_volume_trends?start_date=${startDate}&end_date=${endDate}`,
          { headers },
        ).then((res) => (res.ok ? res.json() : [])),
        fetch(
          `${baseUrl}/get_popular_time_slots_heatmap?p_field_id=${activeFieldId}&start_date=${startDate}&end_date=${endDate}`,
          { headers },
        ).then(async (res) => {
          if (!res.ok) {
            const err = await res.json();
            console.error("❌ Popular Time Slots API Error:", err);
            return [];
          }
          return res.json();
        }),
        fetch(
          `${baseUrl}/get_field_utilization_rates?start_date=${startDate}&end_date=${endDate}`,
          { headers },
        ).then((res) => (res.ok ? res.json() : [])),
        fetch(
          `${baseUrl}/get_user_vs_guest_booking_trends?start_date=${startDate}&end_date=${endDate}`,
          { headers },
        ).then((res) => (res.ok ? res.json() : [])),
      ]);

      // Debugging Log
      console.log("user vs guest:", userVsGuest);


      // Update States
      setApiData(trendRes);
      setAnalyticsData((prev) => ({
        ...prev,
        revenueByField: fields,
        revenueByDayOfWeek: weekly,
        revenueByTimeSlot: slots,
        paymentMethods: payments,
        discountPerformance: discounts,
        bookingVolumeTrends: bookingVolume,
        timeSlotHeatMap: timeSlotHeatMap,
        fieldUtilization: fieldUtilization,
        userVsGuest: userVsGuest,
      }));
    } catch (err: any) {
      console.error("Full Data Sync Error:", err);
      setError(
        "Data sync partially failed. Check if database functions exist.",
      );
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, fieldId]);

  // 3. Effect Hooks
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto bg-gray-50/50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Revenue Analysis</h1>
          <p className="text-gray-500 text-sm">
            Real-time stats from {startDate} to {endDate}
          </p>
        </div>

        {/* Date Range Picker */}
        <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Calendar className="w-4 h-4 text-gray-400 ml-2 hidden sm:block" />

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-sm border-none focus:ring-0 w-full sm:w-auto"
            />
            <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-sm border-none focus:ring-0 w-full sm:w-auto"
            />
          </div>

          <button
            onClick={fetchData}
            className="p-2 hover:bg-purple-50 rounded-lg text-purple-600 transition-colors self-center sm:self-auto"
          >
            <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {error ? (
        <div className="p-10 text-center bg-red-50 rounded-2xl border border-red-100 text-red-600">
          <AlertCircle className="mx-auto mb-2" /> {error}
        </div>
      ) : (
        <>
          {/* Top Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RevenueTrendChart
              data={apiData}
              startDate={startDate}
              endDate={endDate}
              loading={loading}
            />
            <div className="lg:col-span-1">
              {!loading && <RevenueDistributionPie data={apiData} />}
            </div>
          </div>

          {/* Detailed Analytics Tabs Container */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 px-6">
              <div className="flex space-x-8">
                {[
                  { id: "revenue", label: "Revenue", icon: DollarSign },
                  { id: "bookings", label: "Bookings", icon: Activity },
                  { id: "customers", label: "Customers", icon: UserCheck },
                  { id: "operations", label: "Operations", icon: Target },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setAnalyticsTab(t.id as any)}
                    className={`py-4 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
                      analyticsTab === t.id
                        ? "border-purple-600 text-purple-600"
                        : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <t.icon size={16} />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-2">
                  <Loader2 className="animate-spin text-purple-600 w-8 h-8" />
                </div>
              ) : (
                <AnalyticsContent
                  weeksAnalyzed={calculateWeeksBetween(startDate, endDate)}
                  tab={analyticsTab}
                  revenueByField={analyticsData.revenueByField}
                  revenueByTimeSlot={analyticsData.revenueByTimeSlot}
                  revenueByDayOfWeek={analyticsData.revenueByDayOfWeek}
                  paymentMethods={analyticsData.paymentMethods}
                  discountPerformance={analyticsData.discountPerformance}
                  bookingVolumeTrends={analyticsData.bookingVolumeTrends}
                  timeSlotHeatMap={analyticsData.timeSlotHeatMap}
                  fieldUtilization={analyticsData.fieldUtilization}
                  userVsGuest={analyticsData.userVsGuest}
                  customerSegments={analyticsData.customerSegments}
                  customerRetention={analyticsData.customerRetention}
                  bookingFrequency={analyticsData.bookingFrequency}
                  fieldsList={fieldsList}
                  currentFieldId={fieldId}
                  onFieldChange={(id: string) => setFieldId(id)}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
