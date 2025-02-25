import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Icon from "@/assets/icons";
import Input from "./Input";

interface SearchBarProps {
  isKeyboardShow: boolean;
  inputRef?: React.Ref<TextInput>;
}

const SearchBar: React.FC<SearchBarProps> = ({
  isKeyboardShow = false,
  inputRef = null,
}) => {
  useEffect(() => {
    const keyboardListener = Keyboard.addListener("keyboardDidHide", () => {
      if (inputRef && "current" in inputRef && inputRef.current) {
        inputRef.current.focus();
      }
    });

    return () => keyboardListener.remove();
  }, []);

  return (
    <View
      style={{
        width: "100%",
        backgroundColor: "white",
        padding: hp(1.2),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: wp(100),
      }}
    >
      <TouchableOpacity
        style={{
          padding: 5,
        }}
      >
        <Icon name="search" size={24} />
      </TouchableOpacity>
      <Pressable>
        <View style={{ width: wp(60) }}>
          <Input
            placeholder={
              isKeyboardShow ? "Bạn muốn đi đâu?" : "Chọn nơi bạn đến 🏝️"
            }
            isBorder={false}
            isPadding={false}
            fontSize={hp(2.2)}
            height={isKeyboardShow ? hp(7.2) : hp(5)}
            isBold={true}
          />

          {!isKeyboardShow && (
            <View>
              <Text
                style={{
                  color: theme.colors.darkGray,
                  fontSize: hp(1.6),
                }}
              >
                Ngày • Số người • Phòng
              </Text>
            </View>
          )}
        </View>
      </Pressable>
      <TouchableOpacity
        style={{
          borderWidth: 1.6,
          padding: 10,
          borderRadius: wp(100),
          borderColor: theme.colors.gray,
        }}
      >
        <Icon name="filterHoz" strokeWidth={2} size={18} />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({});
