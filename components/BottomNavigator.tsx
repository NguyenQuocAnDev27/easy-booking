import React from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import Icon from "@/assets/icons";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { useNavigator } from "@/contexts/NavigatorContext";
import { LinearGradient } from "expo-linear-gradient";

const BottomNavigator = () => {
  const router = useRouter();
  const { currentPosition, setCurrentPosition, x, tabs, wS, hS } =
    useNavigator();

  const pItem = 100 / tabs.length;
  const wItem = wp(pItem);

  const onClick = (newPosition: number) => {
    setCurrentPosition(newPosition);
    if (newPosition !== currentPosition) {
      x.value = withTiming(newPosition * pItem + (pItem - wS) / 2, {
        duration: 100,
      });
      router.replace(tabs[newPosition].moveTo);
      Keyboard.dismiss();
    }
  };

  const animationStyle = useAnimatedStyle(() => ({
    left: x.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../assets/icons/selected_header.png")}
        style={[
          styles.animatedImage,
          { width: wS, height: hS },
          animationStyle,
        ]}
        resizeMode="cover"
      />
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.position}
          onPress={() => onClick(tab.position)}
        >
          <View style={[styles.tabItem, { width: wItem }]}>
            <Icon
              name={tab.icon}
              size={hp(3.5)}
              color={
                tab.position === currentPosition
                  ? theme.colors.primary
                  : theme.colors.text
              }
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default BottomNavigator;

const styles = StyleSheet.create({
  container: {
    width: wp(100),
    flexDirection: "row",
    position: "relative",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    paddingTop: hp(2),
    borderTopWidth: 2,
    borderColor: theme.colors.lightGray3,
  },
  animatedImage: {
    position: "absolute",
    top: hp(1),
  },
  tabItem: {
    paddingVertical: 10,
    alignItems: "center",
  },
});
