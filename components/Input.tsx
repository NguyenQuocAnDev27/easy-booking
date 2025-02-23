import { theme } from '@/constants/theme';
import { hp } from '@/helpers/common';
import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle, TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
  inputRef?: React.Ref<TextInput>;
}

const Input: React.FC<InputProps> = ({
  containerStyle,
  icon,
  inputRef,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle && containerStyle]}>
      {
        icon && icon
      }
      <TextInput
        ref={inputRef && inputRef}
        style={{flex: 1}}
        placeholderTextColor={theme.colors.textLight}
        {...props}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: hp(7.2),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.4,
    borderColor: theme.colors.text,
    borderRadius: theme.radius.sm,
    paddingHorizontal: 18,
    gap: 12,
  },
});