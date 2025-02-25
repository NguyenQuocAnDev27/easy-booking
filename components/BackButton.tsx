import Icon from "@/assets/icons";
import { theme } from "@/constants/theme";
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

interface BackButtonProps {
  size?: number;
  onPress?: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({
  size = 26,
  onPress = () => {},
}) => {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Icon
        name="arrowLeft"
        strokeWidth={2}
        size={size}
        color={theme.colors.text}
      />
    </Pressable>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    padding: 5,
    borderWidth: 1.6,
    borderColor: "rgba(0,0,0,0.07)",
    borderRadius: theme.radius.sm * 99,
    backgroundColor: "white",
  },
});
