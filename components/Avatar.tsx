import React from "react";
import { StyleProp, StyleSheet } from "react-native";
import { Image, ImageStyle } from "expo-image";
import { theme } from "@/constants/theme";
import { getImageSource } from "@/helpers/common";

interface AvatarProps {
  uri: string | undefined | null;
  size?: number;
  rounded?: number;
  style?: StyleProp<ImageStyle>;
}

const Avatar: React.FC<AvatarProps> = ({
  uri,
  size = 50,
  rounded = 25,
  style,
}) => {
  // console.log(`Image selected: ${uri}`)
  return (
    <Image
      source={getImageSource(uri)}
      transition={100}
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: rounded },
        style,
      ]}
    />
  );
};

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    borderCurve: "continuous",
    borderColor: theme.colors.darkLight,
    borderWidth: 1,
  },
});
