import { Alert, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import ScreenWarpper from "@/components/ScreenWrapper";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import BookingCalendar from "@/components/BookingCalendar";
import Icon from "@/assets/icons";

const checkRoom = () => {
  const [checkIn, setCheckIn] = useState<Date | null>(
    new Date(new Date().setDate(new Date().getDate() - 7))
  );
  const [checkOut, setCheckOut] = useState<Date | null>(new Date());
  const [isCheckIn, setIsCheckIn] = useState<boolean>(false);

  return (
    <ScreenWarpper autoDismissKeyboard={false}>
      <View style={styles.container}>
        {/* Booking Info */}
        <View
          style={{
            padding: wp(4),
            borderWidth: 1,
            borderRadius: theme.radius.md,
            borderColor: theme.colors.primary,
            gap: 10,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: theme.fonts.bold,
              fontSize: hp(2.2),
              paddingBottom: 10,
            }}
          >
            Thông tin đặt phòng
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 5,
                alignItems: "center",
                flex: 1,
              }}
            >
              <Icon name="key" color={theme.colors.primaryDark} />
              <Text>Phòng 101</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 5,
                alignItems: "center",
                flex: 1,
              }}
            >
              <Icon name="hotel" color={theme.colors.primaryDark} />
              <Text>Khách sạn Saalbach</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 5,
                alignItems: "center",
                flex: 1,
              }}
            >
              <Icon name="diamond" color={theme.colors.primaryDark} />
              <Text>Phổ thông</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 5,
                alignItems: "center",
                flex: 1,
              }}
            >
              <Icon name="circleCheck" color={theme.colors.primaryDark} />
              <Text>Đã nhận phòng</Text>
            </View>
          </View>
        </View>

        {/* Reminder */}
        {isCheckIn ? (
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
              Nhắc Nhở Nhận Phòng
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
                  textAlign: "center",
                }}
              >
                Nhận phòng tại khách sạn Saalbach
              </Text>
            </View>
          </View>
        ) : (
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
                Còn cách 2 tiếng 39 phút
              </Text>
            </View>
          </View>
        )}

        {/* Day Booking */}
        <BookingCalendar checkInDate={checkIn} checkOutDate={checkOut} />
      </View>
    </ScreenWarpper>
  );
};

export default checkRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: hp(2),
    paddingHorizontal: wp(4),
    gap: 20,
  },
});
