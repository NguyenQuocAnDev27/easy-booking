import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import useCountdown from "@/hooks/useCountdown";

const CheckOutTimer = ({ checkOut = null }: { checkOut?: Date | null }) => {
  const checkOutTime = checkOut ? checkOut : null;
  const countdown = useCountdown(checkOutTime);

  if (countdown.hours >= 3) {
    return <></>;
  }

  return (
    <View
      style={{
        padding: wp(4),
        gap: wp(4),
        borderWidth: 1,
        borderColor: theme.colors.primary,
        borderRadius: theme.radius.md,
        borderCurve: "continuous",
      }}
    >
      <Text
        style={{
          fontSize: hp(2.2),
          fontWeight: theme.fonts.bold,
          textAlign: "center",
        }}
      >
        Nhắc Nhở Trả Phòng
      </Text>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: hp(2.6),
            color: theme.colors.primaryDark,
            fontWeight: theme.fonts.extraBold,
          }}
        >
          {countdown.hours === 0 && countdown.minutes === 0
            ? "Đã đến giờ trả phòng tại quầy!"
            : countdown.hours === 0
            ? `Còn ${countdown.minutes} phút`
            : `Còn ${countdown.hours} tiếng ${countdown.minutes} phút`}
        </Text>
      </View>
    </View>
  );
};

export default CheckOutTimer;

const styles = StyleSheet.create({});
