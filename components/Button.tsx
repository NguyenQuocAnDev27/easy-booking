import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { theme } from "@/constants/theme";
import { hp } from "@/helpers/common";
import GIFs from "@/assets/animations";
import { Image as ExpoImage } from "expo-image";

interface ButtonProps {
  text: string;
  onPress: () => void;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  text = "Click click",
  onPress = () => {},
  loading = false,
}) => {
  const loadingWidth = 400;
  const loadingHeight = 400;

  const newLoadingWidth = 120;
  const newLoadingHeight = newLoadingWidth / (loadingWidth / loadingHeight);

  if (loading) {
    return (
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ExpoImage
          source={GIFs.loading}
          style={{ width: newLoadingWidth, height: newLoadingHeight }}
          contentFit="cover"
          transition={1000}
        />
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.buttonContent}>
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    width: "100%",
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: theme.radius.xxl * 2,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContent: {
    flexDirection: "row",
  },
  buttonText: {
    color: "white",
    fontSize: hp(2.6),
    fontWeight: theme.fonts.bold,
  },
});
