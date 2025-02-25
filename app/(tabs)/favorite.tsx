import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWarpper from "@/components/ScreenWrapper";
import { hp, wp } from "@/helpers/common";
import Icon from "@/assets/icons";
import Animated, {
  withTiming,
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { theme } from "@/constants/theme";
import { useRouter } from "expo-router";

const Favorite = () => {
  
  return (
    <ScreenWarpper>
      <View>

      </View>
    </ScreenWarpper>
  );
};

export default Favorite;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
