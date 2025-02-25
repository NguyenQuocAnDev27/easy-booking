import { hp, wp } from "@/helpers/common";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useSharedValue, withTiming } from "react-native-reanimated";

// Define the Tab interface
interface Tab {
  position: number;
  name: string;
  moveTo: "/home" | "/favorite" | "/checkRoom" | "/profile";
  icon: any;
}

interface NavigatorContextProps {
  currentPosition: number;
  setCurrentPosition: (position: number) => void;
  x: any;
  tabs: Tab[];
  wS: number;
  hS: number;
}

const NavigatorContext = createContext<NavigatorContextProps | undefined>(undefined);

export const useNavigator = () => {
  const context = useContext(NavigatorContext);
  if (!context) {
    throw new Error("useNavigator must be used within a NavigatorProvider");
  }
  return context;
};

interface NavigatorProviderProps {
  children: ReactNode;
}

export const NavigatorProvider: React.FC<NavigatorProviderProps> = ({
  children,
}) => {
  const tabs: Tab[] = [
    { position: 0, name: "Home", moveTo: "/home", icon: "home" },
    { position: 1, name: "Favorite", moveTo: "/favorite", icon: "heart" },
    { position: 2, name: "Check Room", moveTo: "/checkRoom", icon: "calendar" },
    { position: 3, name: "Profile", moveTo: "/profile", icon: "user" },
  ];

  const [currentPosition, setCurrentPosition] = useState(0);

  const wItem = wp(100 / tabs.length);

  // Define the width and height ratio for the icon selector symbol
  const sizeIcon = 3.5; // percent
  const wS = hp(sizeIcon);
  const hS = hp((sizeIcon * 70) / 248);

  const x = useSharedValue(currentPosition * wItem + (wItem - wS) / 2);

  // Update x.value when currentPosition changes
  useEffect(() => {
    x.value = withTiming(currentPosition * wItem + (wItem - wS) / 2, {
      duration: 200,
    });
  }, [currentPosition, wItem, sizeIcon]);

  return (
    <NavigatorContext.Provider
      value={{ currentPosition, setCurrentPosition, x, tabs, wS, hS }}
    >
      {children}
    </NavigatorContext.Provider>
  );
};
