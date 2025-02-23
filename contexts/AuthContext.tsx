import React, { createContext, useContext, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/hooks/store";
import {
  AppUser,
  loginSession,
  updateUserInfo,
  logout,
} from "@/hooks/authSlice";

interface AuthContextProps {
  user: AppUser | null;
  loginUser: (session: AppUser["session"]) => void;
  updateUser: (user: AppUser["detail"]) => void;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

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

  // Logout the user
  const logoutUser = () => {
    dispatch(logout());
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, updateUser, logoutUser }}>
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
