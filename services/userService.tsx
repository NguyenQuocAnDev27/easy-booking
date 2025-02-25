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



export const updateUser = async (user: SupaUser): Promise<APIResponse> => {
  try {
    // 🔄️ updating data
    const { error } = await supabase
      .from("users")
      .update({
        name: user.name,
        image: user.image,
        role: 'user',
        address: user.address,
        phoneNumber: user.phoneNumber,
        expoPushToken: user.expoPushToken
      })
      .eq("id", user.id);

    // ❌ Error
    if (error) {
      console.warn(`Error updating user data for ${user.id}`, error.message);
      return {
        success: false,
        message: "Error updating user data",
        data: null,
      };
    }

    // ✅ Success
    return {
      success: true,
      message: "User data updating successfully",
      data: user,
    };
  } catch (error) {
    // ❌ Error
    console.warn(`Error updating user data for ${user.id}`, error);
    return {
      success: false,
      message: "Error updating user data",
      data: null,
    };
  }
};