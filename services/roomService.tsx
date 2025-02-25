import { supabase } from "./supabaseService";
import { APIResponse } from "./userService";

export interface Amenity {
  id: string;
  name: string;
}

export interface HotelAmenity {
  id: string;
  hotel_id: string;
  amenity_id: string;
  amenity: Amenity;
}

export interface Hotel {
  id: string;
  name: string;
  rating: number;
  location: string;
  hotel_amenity: HotelAmenity[];
  reviews: Review[]
}

export interface Review {
  id: string;
  hotel_id: string;
  rating: number;
}

export interface Room {
  id: string;
  hotel_id: string;
  room_number: number;
  room_type: string;
  price_per_night: number;
  is_available: boolean;
  capacity: number;
  created_at: string;
  hotel: Hotel;
}


const SERVICE_NAME = "Room Service";

export const numberRoomReturn = 5;

export interface apiGetRoomBody {
  page: number;
  location?: string | null;
}

export const getRooms = async ({
  page = 1,
  location = null,
}: apiGetRoomBody): Promise<APIResponse<Room[]>> => {
  const taskName = "getting rooms";
  console.log(`Have location ? | ${location}`);
  try {
    let query = supabase
      .from("rooms")
      .select(
        `*, 
        hotel:hotels(id, name, location, rating, 
          reviews: reviews(id, hotel_id, rating),
          hotel_amenity:hotel_amenities(id, hotel_id, amenity_id, 
            amenity:amenities(id, name)))`
      )
      .order("created_at", { ascending: false })
      .range((page - 1) * numberRoomReturn, page * numberRoomReturn - 1);

    if (location) {
      query = query.ilike("hotel.location", `%${location}%`);
    }

    const { data, error } = await query;

    // ❌ Handle error
    if (error) {
      console.warn(
        `${SERVICE_NAME} || Error while ${taskName} | Error: ${error.message}`
      );
      return {
        success: false,
        message: `Error while ${taskName}`,
        data: null,
      };
    }

    // ✅ Success - Return retrieved rooms
    console.log(`${SERVICE_NAME} || ${taskName} of page ${page}`)
    return {
      success: true,
      message: `${taskName} successfully`,
      data: data as Room[],
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
