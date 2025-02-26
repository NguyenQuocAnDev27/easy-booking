import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@supabase/supabase-js";
import { SupaUser } from "@/services/userService";
import { Room } from "@/services/roomService";

export interface AppUser {
  session: User;
  detail: SupaUser | null;
  nowLocation?: string | null;
}

interface AuthState {
  user: AppUser | null;
  rooms: Room[];
  page: number;
  loadingMoreRooms: boolean;
}

const initialState: AuthState = {
  user: null,
  rooms: [],
  page: 0,
  loadingMoreRooms: true
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
      state.rooms = action.payload.rooms;
    },
    appendRoomsSlice: (state, action: PayloadAction<{ rooms: Room[] }>) => {
      state.rooms = [...state.rooms, ...action.payload.rooms];
    },
    clearRoomsSlice: (state) => {
      state.rooms = [];
    },
    logout: (state) => {
      state.user = null;
      state.rooms = [];
    },
    doGoToNextPage: (state) => {
      state.page = state.page + 1;
    },
    doClearPage: (state) => {
      state.page = 0;
    },
    doToggleLoadingMoreRooms: (state) => {
      state.loadingMoreRooms = !state.loadingMoreRooms
    }
  },
});

export const {
  loginSession,
  updateUserInfo,
  updateLocation,
  setRoomsSlice,
  appendRoomsSlice,
  clearRoomsSlice,
  logout,
  doGoToNextPage,
  doClearPage,
  doToggleLoadingMoreRooms
} = authSlice.actions;
export default authSlice.reducer;
