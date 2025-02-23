import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@supabase/supabase-js";
import { SupaUser } from "@/services/userService";

export interface AppUser {
  session: User;
  detail: SupaUser | null;
}

interface AuthState {
  user: AppUser | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Action to store both session and user details
    loginSession: (state, action: PayloadAction<{ user: AppUser }>) => {
      state.user = action.payload.user;
    },
    // Action to update only user details (not the session)
    updateUserInfo: (state, action: PayloadAction<{ user: SupaUser }>) => {
      if (state.user) {
        state.user.detail = action.payload.user;
      }
    },
    // Action to log out the user and reset the state
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { loginSession, updateUserInfo, logout } = authSlice.actions;
export default authSlice.reducer;
