import { APIResponse } from "./userService";
import { fetch } from "expo/fetch";

// Interface for address components
export interface AddressComponents {
  amenity?: string;
  city?: string; // Thành phố
  country?: string;
  country_code?: string;
  house_number?: string;
  postcode?: string;
  quarter?: string;
  road?: string;
  suburb?: string; // Quận
}

// Interface for the Nominatim Reverse API response
export interface NominatimAPIResponse {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  place_rank: number;
  category: string;
  type: string;
  importance: number;
  addresstype: string;
  display_name: string;
  name: string;
  address: AddressComponents;
  boundingbox: string[];
}

const SERVICE_NAME = "Location Service";

export const getAddressFromCoordinates = async (
  latitude: number,
  longitude: number
): Promise<APIResponse<NominatimAPIResponse>> => {
  const taskName = "getting address";
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "ShareBook",
      },
    });

    // console.log(JSON.stringify(url));
    // console.log(JSON.stringify(response));

    if (!response.ok) {
      throw new Error("Failed to fetch address");
    }

    const data: NominatimAPIResponse = await response.json();

    return {
      success: true,
      message: `${taskName} successfully`,
      data: data,
    };
  } catch (error) {
    console.warn(
      `${SERVICE_NAME} || Error while ${taskName} | Error: ${error}`
    );
    return {
      success: false,
      message: `Error while ${taskName}`,
      data: null,
    };
  }
};
