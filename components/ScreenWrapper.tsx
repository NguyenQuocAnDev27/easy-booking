import React from "react";
import { Keyboard, StatusBar, TouchableWithoutFeedback } from "react-native";
import { View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { useFocusEffect } from "expo-router";
import BottomNavigator from "./BottomNavigator";
import { NavigatorProvider } from "@/contexts/NavigatorContext";

interface ScreenWrapperProps {
  children: React.ReactNode;
  color?: string;
  autoDismissKeyboard?: boolean;
  statusBarColor?: string;
  textBarColor?: string;
  nightMode?: boolean;
  showBottomNav?: boolean;
}

const StatusBarHeight = Constants.statusBarHeight;

const ScreenWarpper: React.FC<ScreenWrapperProps> = ({
  children,
  color = "white",
  autoDismissKeyboard = true,
  statusBarColor = "white",
  textBarColor = "black",
  nightMode = false,
  showBottomNav = true,
}) => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 5 : 30;

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle(nightMode ? "light-content" : "dark-content");
      if (Platform.OS === "android") {
        StatusBar.setBackgroundColor(statusBarColor);
      }
    }, [statusBarColor, nightMode])
  );

  if (Platform.OS === "android") {
    return (
      <View
        style={{ flex: 1, paddingTop: StatusBarHeight, backgroundColor: color }}
      >
        <StatusBar
          barStyle={nightMode ? "light-content" : "dark-content"}
          hidden={false}
          networkActivityIndicatorVisible={true}
          backgroundColor={statusBarColor}
        />
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          disabled={!autoDismissKeyboard}
        >
          <View style={{ flex: 1 }}>{children}</View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingTop, backgroundColor: color }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>{children}</View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default ScreenWarpper;
