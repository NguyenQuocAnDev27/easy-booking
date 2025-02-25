import { theme } from "@/constants/theme";
import { hp } from "@/helpers/common";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  TextInput,
  TextInputProps,
} from "react-native";

interface InputProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
  inputRef?: React.Ref<TextInput>;
  isBorder?: boolean;
  isPadding?: boolean;
  fontSize?: number;
  height?: number;
  isBold?: boolean;
}

const Input: React.FC<InputProps> = ({
  containerStyle,
  icon,
  inputRef,
  isBorder = true,
  isPadding = true,
  fontSize = hp(1.6),
  height = hp(7.2),
  isBold = false,
  ...props
}) => {
  const borderStyle = {
    borderWidth: 0.4,
    borderColor: theme.colors.text,
  };
  return (
    <View
      style={[
        styles.container,
        containerStyle && containerStyle,
        isBorder && borderStyle,
        isPadding && {
          paddingHorizontal: 18,
        },
        { height },
      ]}
    >
      {icon && icon}
      <TextInput
        ref={inputRef && inputRef}
        style={{
          flex: 1,
          fontSize,
          fontWeight: isBold ? theme.fonts.bold : theme.fonts.regular,
        }}
        placeholderTextColor={theme.colors.darkGray}
        {...props}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.sm,
    gap: 12,
  },
});
