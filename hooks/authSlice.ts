import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@supabase/supabase-js";
import { SupaUser } from "@/services/userService";
import { Room } from "@/services/roomService"; // Import Room type

export interface AppUser {
  session: User;
  detail: SupaUser | null;
  nowLocation?: string | null;
}

interface AuthState {
  user: AppUser | null;
  rooms: Room[]; // ✅ Added rooms array
}

const initialState: AuthState = {
  user: null,
  rooms: [], // ✅ Initialize rooms as an empty array
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSession: (state, action: PayloadAction<{ user: AppUser }>) => {
      state.user = action.payload.user;
    },
    updateUserInfo: (state, action: PayloadAction<{ user: SupaUser }>) => {
      if (state.user) {
        state.user.detail = action.payload.user;
      }
    },
    updateLocation: (state, action: PayloadAction<{ location: string }>) => {
      if (state.user) {
        state.user.nowLocation = action.payload.location ?? null;
      }
    },
    setRoomsSlice: (state, action: PayloadAction<{ rooms: Room[] }>) => {
      state.rooms = action.payload.rooms; // ✅ Replaces all rooms
    },
    appendRoomsSlice: (state, action: PayloadAction<{ rooms: Room[] }>) => {
      state.rooms = [...state.rooms, ...action.payload.rooms]; // ✅ Appends new rooms to existing ones
    },
    clearRoomsSlice: (state) => {
      state.rooms = []; // ✅ Clears all rooms
    },
    logout: (state) => {
      state.user = null;
      state.rooms = []; // ✅ Clear rooms on logout
    },
  },
});

export const { loginSession, updateUserInfo, updateLocation, setRoomsSlice, appendRoomsSlice, clearRoomsSlice, logout } = authSlice.actions;
export default authSlice.reducer;
