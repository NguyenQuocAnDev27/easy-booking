import { supabase } from "./supabaseService";
import { APIResponse } from "./userService";

const SERVICE_NAME = "Payment Service";

export interface Bank {
  id: string;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: string;
  lookupSupported: string;
  short_name: string;
  support: string;
  isTransfer: string;
  swift_code: string;
}

const API_VIETQR_BANKS = "https://api.vietqr.io/v2/banks";

export const getBanks = async (): Promise<APIResponse> => {
  const taskName = "getting bank list";
  try {
    // 🔄️
    let res = await fetch(API_VIETQR_BANKS);

    // ❌ Error handling
    if (!res.ok) {
      console.warn(
        `${SERVICE_NAME} || Error while ${taskName}`,
        res.status,
        res.statusText
      );
      return {
        success: false,
        message: `Error while ${taskName} - ${res.statusText}`,
        data: null,
      };
    }

    // 🔄️ Parse response JSON
    const preData = await res.json();

    if (!preData || !preData.data) {
      return {
        success: false,
        message: `Invalid response structure from API`,
        data: null,
      };
    }

    // Mapping data
    const data: Bank[] = preData.data.map((item: any) => ({
      id: item.id,
      name: item.name,
      code: item.code,
      bin: item.bin,
      shortName: item.shortName,
      logo: item.logo,
      transferSupported: item.transferSupported,
      lookupSupported: item.lookupSupported,
      short_name: item.short_name,
      support: item.support,
      isTransfer: item.isTransfer,
      swift_code: item.swift_code,
    }));

    console.log(`${SERVICE_NAME} || ${taskName} successfully`);

    return {
      success: true,
      message: `${taskName} successfully`,
      data: data,
    };
  } catch (error) {
    console.error(
      `${SERVICE_NAME} || Unexpected error while ${taskName}`,
      error
    );
    return {
      success: false,
      message: `Unexpected error while ${taskName}`,
      data: null,
    };
  }
};

export const createQRCode = async ({
  acqId,
  accountNo,
  amount = 2000,
  message = "test",
}: {
  acqId: string;
  accountNo: string;
  amount?: number;
  message?: string;
}): Promise<APIResponse> => {
  const taskName = "creating qr code";
  try {
    // 🔄️
    const URL_VIET_QR = `https://img.vietqr.io/image/${acqId}-${accountNo}-compact.png?amount=${amount}&addInfo=${message}`;
    // let res = await fetch(URL_VIET_QR);

    // ❌ Error handling
    // if (!res.ok) {
    //   console.warn(
    //     `${SERVICE_NAME} || Error while ${taskName}`,
    //     res.status,
    //     res.statusText
    //   );
    //   return {
    //     success: false,
    //     message: `Error while ${taskName} - ${res.statusText}`,
    //     data: null,
    //   };
    // }

    return {
      success: true,
      message: `${taskName} successfully`,
      data: URL_VIET_QR,
    };
  } catch (error) {
    console.error(
      `${SERVICE_NAME} || Unexpected error while ${taskName}`,
      error
    );
    return {
      success: false,
      message: `Unexpected error while ${taskName}`,
      data: null,
    };
  }
};

export interface PaymentBody {
  booking_id: string;
  payment_method: string;
  transaction_status: string;
  transaction_id: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  payment_method: string;
  payment_status: string;
  transaction_id: string;
  created_at: string;
}

export const createPayment = async (body: PaymentBody) => {
  const taskName = "creating payment";
  try {
    // 🔄️ Getting
    let { data, error } = await supabase
      .from("payments")
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
      data: data as Payment,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error while ${taskName}`,
      data: null,
    };
  }
};
