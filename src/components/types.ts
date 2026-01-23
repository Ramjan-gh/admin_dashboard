import { BookingDetailsDrawer } from "./bookingsPageFolder/BookingDetailsDrawer";
import { BookingFilters } from "./bookingsPageFolder/BookingFilters";
import { BookingsTable } from "./bookingsPageFolder/BookingsTable";
import { LoginPage } from "./LoginPage";
import { BannerSettings } from "./settingsPageFolder/generalSettingsFolder/BannerSettings";
import { DiscountSettings } from "./settingsPageFolder/discountSettingsFolder/DiscountSettings";
import { GeneralSettings } from "./settingsPageFolder/generalSettingsFolder/GeneralSettings";
import { HolidaySettings } from "./settingsPageFolder/HolidaySettings";
import { Sidebar } from "./Sidebar";
import { SlotsPage } from "./SlotsPage";
import { AddShiftModal } from "./slotsPageFolder/AddShiftModal";
import { AddSlotModal } from "./slotsPageFolder/AddSlotModal";
import { FilterBar } from "./slotsPageFolder/FilterBar";

// BookingsPage.tsx types
export type Booking = {
  id: string;
  bookingCode: string;
  customer: string;
  phone: string;
  email: string;
  dateISO: string;
  dateDisplay: string;
  time: string;
  sport: string;
  payment: string;
  amount: number;
  status: string;
};

export type BookingDetails = {
  field: {
    icon_url: string;
    field_name: string;
    background_image_url: string;
  };
  slots: {
    slot_id: string;
    end_time: string;
    slot_price: number;
    start_time: string;
    booking_date: string;
    duration_minutes: number;
  }[];
  booking: {
    id: string;
    email: string;
    status: string;
    full_name: string;
    created_at: string;
    updated_at: string;
    paid_amount: number;
    booking_code: string;
    final_amount: number;
    phone_number: string;
    total_amount: number;
    special_notes: string;
    payment_method: string;
    payment_status: string;
    discount_amount: number;
    discount_code: string;
    number_of_players: number;
  };
  discount_code: string;
};

export type ApiItem = {
  result: {
    field: { field_name: string; icon_url: string };
    slots: { booking_date: string; start_time: string; end_time: string }[];
    booking: {
      id: string;
      booking_code: string;
      full_name: string;
      phone_number: string;
      email: string;
      payment_method: string;
      payment_status: string;
      total_amount: number;
      final_amount: number;
      status: string;
    };
  };
};


// SeetingsPage.tsx types

export interface Organization {
  name: string;
  description: string;
  logo_url: string;
  emails: string | string[];
  phone_numbers: string | string[];
  address_text: string;
  address_google_maps_url: string;
  facebook_url: string;
  instagram_url: string;
  tiktok_url: string;
  whatsapp_url: string;
}

export interface Holiday {
  id: string;
  date: string;
  notes: string;
  is_open: boolean;
}

export interface Discount {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  valid_from: string;    // ISO date string
  valid_until: string;   // ISO date string
  max_uses: number | null;
  current_uses: number;
  is_active: boolean;
  created_at: string;    // ISO date string
}

// UpdateShiftModal.tsx types 

export type UpdateShiftModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: any) => void;
  shift: { id: string; name: string } | null;
  loading: boolean;
};

// useSlots.ts types 
export type Field = { id: string; name: string; icon_url: string };
export type Slot = {
  shift_id: string;
  slot_id: string;
  field_id: string;
  start_time: string;
  end_time: string;
  price: number;
  type: string;
  status: "available" | "booked" | "maintenance";
  booking_code: string | null;
  full_name: string | null;
};
export type Shift = { shift_id: string; shift_name: string };

// BookingDetailsDrawer.tsx types
export interface DrawerProps {
  details: BookingDetails | null;
  loading: boolean;
  onClose: () => void;
}

// BookingFilters.tsx types 
export interface FilterProps {
  search: string;
  setSearch: (val: string) => void;
  bookingDate: string;
  setBookingDate: (val: string) => void;
  fieldFilter: string;
  setFieldFilter: (val: string) => void;
  paymentStatus: string;
  setPaymentStatus: (val: string) => void;
  onClear: () => void;
}

// BookingsTable.tsx types 
export interface TableProps {
  bookings: Booking[];
  loading: boolean;
  onView: (b: Booking) => void;
}

// BannerSettings.tsx types 
export interface Props {
  banners: any[];
  loading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: (banner: any) => void;
}



// DiscountSettings.tsx types 
// Add this helper interface
export interface ApiResponse {
  success: boolean;
  message: string;
  // include other optional fields if needed
  id?: string | null;
}

export interface DiscountSettingsProps {
  discounts: Discount[];
  newDiscount: {
    id?: string;
    p_code: string;
    p_discount_type: "percentage" | "fixed";
    p_discount_value: string;
    p_valid_from: string;
    p_valid_until: string;
    p_max_uses: number | null;
  };
  setNewDiscount: (val: any) => void;
  handleAddDiscount: () => void;
  handleDeleteDiscount: (id: string) => void;
  // Change void to Promise<ApiResponse | void>
  handleToggleDiscountStatus: (id: string, currentStatus: boolean) => Promise<ApiResponse | void>;
}

// GeneralSettings.tsx types 
export interface GeneralSettingsProps {
  orgData: Organization;
  setOrgData: React.Dispatch<React.SetStateAction<Organization | null>>;
  loading: boolean;
  setHasChanges: (val: boolean) => void;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpdateOrg: () => void;

  // Banner properties
  banners: any[];
  bannerLoading: boolean;
  handleBannerUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteBanner: (banner: any) => Promise<void> | void;
}

// HolidaySettings.tsx types 
export interface HolidaySettingsProps {
  holidays: Holiday[];
  newHoliday: {
    p_date: string;
    p_notes: string;
    p_is_open: boolean;
  };
  setNewHoliday: (val: any) => void;
  handleAddSchedule: () => void;
  handleDeleteSchedule: (id: string) => void;
}

// AddShiftModal.tsx types 
export interface AddShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (shiftData: any) => void;
  fieldId: string;
  loading: boolean;
}

// AddSlotModal.tsx types 
export interface AddSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (shiftId: string) => void;
  shiftName?: string;
  startTime: string;
  setStartTime: (t: string) => void;
  endTime: string;
  setEndTime: (t: string) => void;
  loading: boolean;
  shiftId: string | null;
}

// FilterBar.tsx types 
export interface FilterBarProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  fields: any[];
  selectedField: any;
  fieldDropdownOpen: boolean;
  setFieldDropdownOpen: (open: boolean) => void;
  onSelectField: (id: string) => void;
}

// SlotCard.tsx types
export interface SlotCardProps {
  slot: any;
  onDelete: (id: string) => void;
  onToggleMaintenance: () => void; // Prop passed from SlotsPage
  formatTime: (t: string) => string;
  getStatusColor: (status: string) => string;
}

// ImageUploadField.tsx types 
export interface ImageUploadProps {
  label: string;
  url: string;
  uploading: boolean;
  onUpload: (file: File) => void;
  type: "bg" | "icon";
}

// TurfCard.tsx types
export interface TurfCardProps {
  turf: any;
  index: number;
  onEdit: (turf: any) => void;
  onDelete: (id: string) => void;
}

// LoginPage.tsx types 
export interface LoginPageProps {
  onLoginSuccess: () => void;
}

// Sidebar.tsx types 
export interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onLogout: () => void;
}

// TopBar.tsx types
export interface TopBarProps {
  setSidebarOpen: (open: boolean) => void;
  onLogout: () => void;
}