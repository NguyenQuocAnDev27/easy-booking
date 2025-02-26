import { supabase } from "./supabaseService";
import { APIResponse } from "./userService";

export interface Amenity {
  id: string;
  name: string;
}

export interface HotelAmenity {
  id: string;
  amenity: Amenity;
}

export interface Hotel {
  id: string;
  name: string;
  rating: number;
  location: string;
  hotel_amenities: HotelAmenity[];
  reviews: Review[];
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
  hotel?: Hotel;
  beds?: number;
  baths?: number;
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
  try {
    let query = supabase
      .from("rooms")
      .select(
        `
        *,
        hotel:hotels (
          id,
          name,
          location,
          rating,
          hotel_amenities:hotel_amenities (
            id,
            amenity:amenities (
              id,
              name
            )
          ),
          reviews:reviews (
            id,
            rating
          )
        )
      `
      )
      .order("created_at", { ascending: false });

    if (location) {
      console.log("Sorting by exact location first...");
      query = query.order("created_at", { ascending: false });
    }

    query = query.range(
      (page - 1) * numberRoomReturn,
      page * numberRoomReturn - 1
    );

    const { data, error } = await query;

    if (error) {
      console.warn(`${SERVICE_NAME} || Error fetching rooms`, error);
      return {
        success: false,
        message: "Error fetching rooms",
        data: null,
      };
    }

    console.log(`${SERVICE_NAME} || Fetched ${data.length} rooms`);

    const processedRooms = data.map((room) => ({
      ...room,
      hotel: {
        ...room.hotel,
        hotel_amenities: room.hotel?.hotel_amenities ?? [],
        reviews: room.hotel?.reviews ?? [],
      },
    }));

    let matchRooms = processedRooms.filter(
      (room) => room.hotel?.location === location
    );
    let restRooms = processedRooms.filter(
      (room) => room.hotel?.location !== location
    );

    if (matchRooms.length === 0) {
      console.log("No exact matches found, showing all rooms.");
      matchRooms = restRooms;
      restRooms = [];
    }

    return {
      success: true,
      message: `${taskName} successfully`,
      data: [...matchRooms, ...restRooms] as Room[],
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

export interface HotelDetail {
  id: string;
  name: string;
  rating: number;
  location: string;
  description: string;
  address: string;
  contact_phone: string;
  hotel_amenities: HotelAmenity[];
  reviews: Review[];
}

export interface RoomDetail {
  id: string;
  hotel_id: string;
  room_number: number;
  room_type: string;
  price_per_night: number;
  is_available: boolean;
  capacity: number;
  created_at: string;
  hotel?: HotelDetail;
  beds?: number;
  baths?: number;
}

export const getRoomById = async (
  roomId: string
): Promise<APIResponse<RoomDetail>> => {
  const taskName = "getting room's detail";
  try {
    let query = supabase
      .from("rooms")
      .select(
        `
        *,
        hotel:hotels (
          id,
          name,
          location,
          rating,
          description,
          address,
          contact_phone,
          hotel_amenities:hotel_amenities (
            id,
            amenity:amenities (
              id,
              name
            )
          ),
          reviews:reviews (
            id,
            rating
          )
        )
      `
      )
      .eq("id", roomId)
      .single();

    const { data, error } = await query;

    if (error) {
      console.warn(`${SERVICE_NAME} || Error fetching rooms`, error);
      return {
        success: false,
        message: "Error fetching rooms",
        data: null,
      };
    }

    console.log(`${SERVICE_NAME} || Fetched room ${roomId}`);

    return {
      success: true,
      message: `${taskName} successfully`,
      data: data as RoomDetail,
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
