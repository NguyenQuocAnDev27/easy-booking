import { STATUS_CHECK_IN_OUT } from "@/constants";
import { supabase } from "./supabaseService";
import { APIResponse } from "./userService";

const SERVICE_NAME = "Check In Out Service";

export interface CheckInOutInfo {
  id?: string;
  booking_id: string;
  user_id: string;
  room_id: string;
  check_in_time: string;
  check_out_time: string;
  employee_id: string;
  status: string;
}

export const createOrUpdateCheckInOut = async (
  body: CheckInOutInfo
): Promise<APIResponse> => {
  const taskName = "creating check in out info";
  try {
    // 🔄️ Getting
    let { data, error } = await supabase
      .from("check_in_out")
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
      data: data as CheckInOutInfo,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error while ${taskName}`,
      data: null,
    };
  }
};

export const getCheckInOut = async (userId: string): Promise<APIResponse> => {
  const taskName = "getting check in out info";
  try {
    // 🔄️ Getting
    let { data, error } = await supabase
      .from("check_in_out")
      .select("*")
      .eq("user_id", userId)
      .not("status", 'eq', STATUS_CHECK_IN_OUT.CHECK_OUT)
      .maybeSingle();

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
      data: data as CheckInOutInfo,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error while ${taskName}`,
      data: null,
    };
  }
};
