import { supabase } from "./supabaseService";
import { APIResponse } from "./userService";

const SERVICE_NAME = "Booking Service";

export interface BodyCreateBooking {
  user_id: string;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  status: string;
}

export interface BookingTicket {
  id: string;
  user_id: string;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  status: string;
  created_at: string;
}

export const createBooking = async (
  body: BodyCreateBooking
): Promise<APIResponse> => {
  const taskName = "creating booking";
  try {
    // 🔄️ Getting
    let { data, error } = await supabase
      .from("bookings")
      .upsert(body)
      .select()
      .single();

    // ❌ Error
    if (error) {
      console.warn(`${SERVICE_NAME} || Error while ${taskName}`, error);
      return {
        success: false,
        message: `Error while ${taskName}`,
        data: null,
      };
    }

    // ✅ Success
    console.log(`${SERVICE_NAME} || ${taskName} successfully`);
    return {
      success: true,
      message: `${taskName} successfully`,
      data: data as BookingTicket,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error while ${taskName}`,
      data: null,
    };
  }
};
