// TurfBook Analytics API Service
// Base URL for Supabase RPC endpoints
const BASE_URL = 'https://himsgwtkvewhxvmjapqa.supabase.co/rest/v1/rpc';

// Import Supabase credentials


// Helper function to get headers
const getHeaders = () => ({
  'Content-Type': 'application/json',
  apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
});

// Helper function to format dates for API (YYYY-MM-DD format)
export const formatDateForAPI = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper function to get date ranges based on view mode
export const getDateRange = (viewMode: 'day' | 'month' | 'year', selectedDate: string, selectedMonth: string, selectedYear: string) => {
  let startDate: string;
  let endDate: string;

  if (viewMode === 'day') {
    startDate = selectedDate;
    endDate = selectedDate;
  } else if (viewMode === 'month') {
    // Parse month as YYYY-MM
    const [year, month] = selectedMonth.split('-');
    const firstDay = new Date(parseInt(year), parseInt(month) - 1, 1);
    const lastDay = new Date(parseInt(year), parseInt(month), 0);
    startDate = formatDateForAPI(firstDay);
    endDate = formatDateForAPI(lastDay);
  } else {
    // Year view
    startDate = `${selectedYear}-01-01`;
    endDate = `${selectedYear}-12-31`;
  }

  return { startDate, endDate };
};

// Type definitions for API responses
export interface RevenueTrendItem {
  field_id: string;
  field_name: string;
  period_date: string;
  period_label: string;
  slot_start_time: string | null;
  slot_end_time: string | null;
  total_bookings: number;
  total_slots_booked: number;
  total_revenue: number;
  popularity_rank: number;
}

export interface RevenueByFieldItem {
  field_id: string;
  field_name: string;
  total_bookings: number;
  total_revenue: number;
}

export interface WeeklyRevenuePatternItem {
  day_of_week: number;
  day_name: string;
  total_bookings: number;
  total_revenue: number;
  avg_revenue_per_booking: number;
}

export interface RevenueByTimeSlotItem {
  slot_id: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  total_bookings: number;
  total_revenue: number;
  avg_revenue_per_booking: number;
}

export interface PaymentMethodItem {
  payment_method: string;
  total_bookings: number;
  total_amount: number;
  percentage: number;
}

export interface DiscountCodePerformanceItem {
  discount_code_id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  total_uses: number;
  total_revenue: number;
  total_discount_given: number;
  revenue_without_discount: number;
  roi_percentage: number;
}


export interface PaymentChartData {
  method: string;
  value: number;
  color: string;
  amount: number;
  bookings: number; 
}

export interface BookingVolumeData {
  booking_date: string;
  total_bookings: number;
  cancelled_bookings: number;
}

export interface TimeSlotHeatMapItem {
  day_of_week: number;
  day_name: string;
  start_time: string;
  end_time: string;
  booking_count: number;
  total_revenue: number;
  utilization_rate: number;
}

export interface FieldUtilizationItem {
  field_id: string;
  field_name: string;
  slots_per_day: number;
  days_in_range: number;
  total_possible_bookings: number;
  actual_bookings: number;
  utilization_rate: number;
  total_revenue: number;
  avg_revenue_per_booking: number;
}

// API Functions

/**
 * Get revenue trend data
 * Returns revenue trends grouped by fields over a time period
 */
// export const getRevenueTrend = async (startDate: string, endDate: string): Promise<RevenueTrendItem[]> => {
//   try {
//     const url = `${BASE_URL}/get_revenue_trend?start_date=${startDate}&end_date=${endDate}`;
//     const response = await fetch(url, { headers: getHeaders() });
    
//     if (!response.ok) {
//       throw new Error(`API Error: ${response.status}`);
//     }
    
//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching revenue trend:', error);
//     return [];
//   }
// };

/**
 * Get revenue breakdown by field
 * Returns total bookings and revenue for each field
 */
// export const getRevenueByField = async (startDate: string, endDate: string): Promise<RevenueByFieldItem[]> => {
//   try {
//     const url = `${BASE_URL}/get_revenue_by_field?start_date=${startDate}&end_date=${endDate}`;
//     const response = await fetch(url, { headers: getHeaders() });
    
//     if (!response.ok) {
//       throw new Error(`API Error: ${response.status}`);
//     }
    
//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching revenue by field:', error);
//     return [];
//   }
// };

/**
 * Get weekly revenue pattern
 * Returns revenue patterns by day of week over the last N weeks
 */
// export const getWeeklyRevenuePattern = async (weeksToAnalyze: number = 4): Promise<WeeklyRevenuePatternItem[]> => {
//   try {
//     const url = `${BASE_URL}/get_weekly_revenue_pattern?weeks_to_analyze=${weeksToAnalyze}`;
//     const response = await fetch(url, { headers: getHeaders() });
    
//     if (!response.ok) throw new Error(`API Error: ${response.status}`);
    
//     const data = await response.json();
//     // Sort by day_of_week (0-6) to ensure the chart starts at Monday or Sunday correctly
//     return data.sort((a: WeeklyRevenuePatternItem, b: WeeklyRevenuePatternItem) => a.day_of_week - b.day_of_week);
//   } catch (error) {
//     console.error('Error fetching weekly revenue pattern:', error);
//     return [];
//   }
// };

/**
 * Get revenue by time slot for a specific field
 * Returns revenue breakdown by time slots
 */
// export const getRevenueByTimeSlot = async (
//   fieldId: string,
//   startDate: string,
//   endDate: string
// ): Promise<RevenueByTimeSlotItem[]> => {
//   try {
//     const url = `${BASE_URL}/get_revenue_by_time_slot?p_field_id=${fieldId}&start_date=${startDate}&end_date=${endDate}`;
//     const response = await fetch(url, { headers: getHeaders() });
    
//     if (!response.ok) {
//       throw new Error(`API Error: ${response.status}`);
//     }
    
//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching revenue by time slot:', error);
//     return [];
//   }
// };

/**
 * Get payment methods distribution
 * Returns breakdown of payment methods used
 */
// export const getPaymentMethodsDistribution = async (
//   startDate: string,
//   endDate: string
// ): Promise<PaymentMethodItem[]> => {
//   try {
//     const url = `${BASE_URL}/get_payment_methods_distribution?start_date=${startDate}&end_date=${endDate}`;
//     const response = await fetch(url, { headers: getHeaders() });
    
//     if (!response.ok) {
//       throw new Error(`API Error: ${response.status}`);
//     }
    
//     return await response.json();
//     const payments = await response.json();
//     console.log('Payment Methods Distribution:', payments);
//     return payments;
//   } catch (error) {
//     console.error('Error fetching payment methods distribution:', error);
//     return [];
//   }
// };
/**
 * Get discount code performance
 * Returns performance metrics for discount codes
 */
// export const getDiscountCodePerformance = async (
//   startDate: string,
//   endDate: string
// ): Promise<DiscountCodePerformanceItem[]> => {
//   try {
//     const url = `${BASE_URL}/get_discount_code_performance?start_date=${startDate}&end_date=${endDate}`;
//     const response = await fetch(url, { headers: getHeaders() });
    
//     if (!response.ok) {
//       throw new Error(`API Error: ${response.status}`);
//     }
    
//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching discount code performance:', error);
//     return [];
//   }
// };