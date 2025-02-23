import { theme } from "@/constants/theme";
import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";

interface LoadingProps {
  size?: "large" | "small" | number;
  color?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = "large",
  color = theme.colors.primary,
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignContent: "center",
  },
});
