import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { hp } from "@/helpers/common";

interface TabBarItemProps {
  focused: boolean;
  children: React.ReactNode;
}

const TabBarItem: React.FC<TabBarItemProps> = ({
  focused = false,
  children,
}) => {
  const x = hp(3.5);
  const y = (x * 70) / 248;
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 3,
        height: hp(6),
        marginVertical: hp(1),
      }}
    >
      {focused && (
        <View>
          <Image
            source={require("../assets/icons/selected_header.png")}
            style={{ width: x, height: y }}
            resizeMode="cover"
          />
        </View>
      )}
      <View>{children}</View>
    </View>
  );
};

export default TabBarItem;

const styles = StyleSheet.create({});
