import { APIResponse } from "./userService";

const API_ArgiConnect = "https://provinces.open-api.vn/api";

export interface Province {
  name: string;
  code: string;
  districts: {
    name: string;
    code: string;
  }[];
}

const SERVICE_NAME = "Province Service";

export const getProvinces = async (): Promise<APIResponse<Province[]>> => {
  const taskName = "getting provinces";

  try {
    // 🔄️
    const res = await fetch(`${API_ArgiConnect}/?depth=2`);

    // ❌ Error Handling
    if (!res.ok) {
      console.warn(`${SERVICE_NAME} - Error while ${taskName} | ${res.status}`);
      return {
        success: false,
        message: `Error while ${taskName}`,
        data: null,
      };
    }

    // 🔄️
    const preData = await res.json();

    const data: Province[] = preData.map((item: any) => ({
      name: item.name,
      code: item.code,
      districts: item.districts.map((district: any) => ({
        name: district.name,
        code: district.code,
      })),
    }));

    // ✅ Success
    return {
      success: true,
      message: `${taskName} successfully`,
      data: data,
    };
  } catch (error) {
    // ❌ Error Handling
    console.warn(`${SERVICE_NAME} - Error while ${taskName} | ${error}`);

    return {
      success: false,
      message: `Failed while ${taskName}`,
      data: null,
    };
  }
};
