import React, { createContext, useContext, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/hooks/store";
import {
  AppUser,
  loginSession,
  updateUserInfo,
  updateLocation,
  setRoomsSlice,
  appendRoomsSlice,
  clearRoomsSlice,
  logout,
} from "@/hooks/authSlice";
import { Room } from "@/services/roomService"; // Import Room type

interface AuthContextProps {
  user: AppUser | null;
  rooms: Room[]; // ✅ Added rooms to Context
  loginUser: (session: AppUser["session"]) => void;
  updateUser: (user: AppUser["detail"]) => void;
  updateNowLocation: (location: string) => void;
  updateRooms: (rooms: Room[]) => void;
  addRooms: (rooms: Room[]) => void; // ✅ Appends new rooms
  clearRooms: () => void; // ✅ Clears all rooms
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const { user, rooms } = useSelector((state: RootState) => state.auth);

  // Login the user by storing both session and user details
  const loginUser = (session: AppUser["session"]) => {
    dispatch(loginSession({ user: { session, detail: null } }));
  };

  // Update user info separately after login
  const updateUser = (user: AppUser["detail"]) => {
    if (user) {
      dispatch(updateUserInfo({ user }));
    }
  };

  // Update location in the user's data
  const updateNowLocation = (location: string) => {
    if (user) {
      dispatch(updateLocation({ location }));
    }
  };

  // ✅ Function to replace rooms
  const updateRooms = (rooms: Room[]) => {
    dispatch(setRoomsSlice({ rooms }));
  };

  // ✅ Function to append more rooms
  const addRooms = (rooms: Room[]) => {
    dispatch(appendRoomsSlice({ rooms }));
  };

  // ✅ Function to clear all rooms
  const clearRooms = () => {
    dispatch(clearRoomsSlice());
  };

  // Logout the user
  const logoutUser = () => {
    dispatch(logout());
  };

  return (
    <AuthContext.Provider value={{ user, rooms, loginUser, updateUser, updateNowLocation, updateRooms, addRooms, clearRooms, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
