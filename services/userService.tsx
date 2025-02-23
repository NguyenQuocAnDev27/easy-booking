import { supabase } from "./supabaseService";

export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface SupaUser {
  id?: string;
  name?: string;
  email?: string;
  phone?: string | null;
  image?: string | null;
  address?: string | null;
  phoneNumber?: string | null;
  createdAt?: string;
  expoPushToken?: string | null;
}

const SERVICE_NAME = "USER SERVICE";

export const getUserData = async (userId: string): Promise<APIResponse> => {
  const taskName = "getting user info";
  try {
    // 🔄️ getting data
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    // ❌ Error
    if (error) {
      console.warn(`${SERVICE_NAME} || Error while ${taskName} of userId ${userId} | Error: ${error.message}`);
      return {
        success: false,
        message: `Error while ${taskName}`,
        data: null,
      };
    }

    // ✅ Success
    return {
      success: true,
      message: `${taskName} successfully`,
      data: data as SupaUser,
    };
  } catch (error) {
    // ❌ Error
    console.warn(`${SERVICE_NAME} || Error while ${taskName} of userId ${userId} | Error: ${error}`);
    return {
      success: false,
      message: `Error while ${taskName}`,
      data: null,
    };
  }
};
