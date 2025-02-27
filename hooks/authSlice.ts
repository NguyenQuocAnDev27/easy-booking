import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@supabase/supabase-js";
import { SupaUser } from "@/services/userService";
import { FavoriteRoom, Room } from "@/services/roomService";

export interface AppUser {
  session: User;
  detail: SupaUser | null;
  nowLocation?: string | null;
}

interface AuthState {
  user: AppUser | null;
  page: number;
  rooms: Room[];
  loadingMoreRooms: boolean;
  favoriteRooms: FavoriteRoom[];
  pageFavorite: number;
  loadingMoreFavoriteRooms: boolean;
}

const initialState: AuthState = {
  user: null,
  page: 0,
  rooms: [],
  loadingMoreRooms: true,
  pageFavorite: 0,
  favoriteRooms: [],
  loadingMoreFavoriteRooms: true,
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
      state.rooms = [...action.payload.rooms, ...state.rooms];
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
      state.loadingMoreRooms = !state.loadingMoreRooms;
    },
    doSetFavoriteRooms: (
      state,
      action: PayloadAction<{ favoriteRooms: FavoriteRoom[] }>
    ) => {
      state.favoriteRooms = action.payload.favoriteRooms;
    },
    doAppendFavoriteRoom: (
      state,
      action: PayloadAction<{ favoriteRooms: FavoriteRoom[] }>
    ) => {
      state.favoriteRooms = [
        ...action.payload.favoriteRooms,
        ...state.favoriteRooms,
      ];
    },
    doClearFavoriteRooms: (state) => {
      state.favoriteRooms = [];
    },
    doGoToNextFavoritePage: (state) => {
      state.pageFavorite = state.pageFavorite + 1;
    },
    doClearFavortiePage: (state) => {
      state.pageFavorite = 0;
    },
    doToggleLoadingMoreFavoriteRooms: (state) => {
      state.loadingMoreFavoriteRooms = !state.loadingMoreFavoriteRooms;
    },
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
  doToggleLoadingMoreRooms,
  doSetFavoriteRooms,
  doAppendFavoriteRoom,
  doClearFavoriteRooms,
  doGoToNextFavoritePage,
  doClearFavortiePage,
  doToggleLoadingMoreFavoriteRooms,
} = authSlice.actions;
export default authSlice.reducer;
