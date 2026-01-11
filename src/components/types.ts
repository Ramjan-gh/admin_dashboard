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
    no_of_players: number;
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