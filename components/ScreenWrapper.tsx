import React from "react";
import { Keyboard, StatusBar, TouchableWithoutFeedback } from "react-native";
import { View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Constants from "expo-constants";

interface ScreenWrapperProps {
  children: React.ReactNode;
  color?: string;
  autoDismissKeyboard?: boolean;
}

const StatusBarHeight = Constants.statusBarHeight;

const ScreenWarpper: React.FC<ScreenWrapperProps> = ({
  children,
  color = "white",
  autoDismissKeyboard = true,
}) => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 5 : 30;

  if (Platform.OS === "android") {
    return (
      <View
        style={{ flex: 1, paddingTop: StatusBarHeight, backgroundColor: color }}
      >
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          networkActivityIndicatorVisible={true}
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
