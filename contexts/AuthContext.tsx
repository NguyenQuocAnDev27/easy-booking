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
  doGoToNextPage,
  doClearPage,
  doToggleLoadingMoreRooms,
} from "@/hooks/authSlice";
import { Room } from "@/services/roomService";

interface AuthContextProps {
  user: AppUser | null;
  rooms: Room[];
  page: number;
  loadingMoreRooms: boolean;
  loginUser: (session: AppUser["session"]) => void;
  updateUser: (user: AppUser["detail"]) => void;
  updateNowLocation: (location: string) => void;
  updateRooms: (rooms: Room[]) => void;
  addRooms: (rooms: Room[]) => void;
  clearRooms: () => void;
  logoutUser: () => void;
  goToNextPage: () => void;
  clearPage: () => void;
  toggleLoadingMoreRooms: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const { user, rooms, page, loadingMoreRooms } = useSelector((state: RootState) => state.auth);

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

  //  Function to replace rooms
  const updateRooms = (rooms: Room[]) => {
    dispatch(setRoomsSlice({ rooms }));
  };

  //  Function to append more rooms
  const addRooms = (rooms: Room[]) => {
    dispatch(appendRoomsSlice({ rooms }));
  };

  //  Function to clear all rooms
  const clearRooms = () => {
    dispatch(clearRoomsSlice());
  };

  // Logout the user
  const logoutUser = () => {
    dispatch(logout());
  };

  const goToNextPage = () => {
    dispatch(doGoToNextPage());
  };

  const clearPage = () => {
    dispatch(doClearPage());
  };

  const toggleLoadingMoreRooms = () => {
    dispatch(doToggleLoadingMoreRooms());
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        rooms,
        page,
        loadingMoreRooms,
        loginUser,
        updateUser,
        updateNowLocation,
        updateRooms,
        addRooms,
        clearRooms,
        logoutUser,
        goToNextPage,
        clearPage,
        toggleLoadingMoreRooms,
      }}
    >
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
