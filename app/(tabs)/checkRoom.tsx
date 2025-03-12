import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import ScreenWarpper from "@/components/ScreenWrapper";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import BookingCalendar from "@/components/BookingCalendar";
import Icon from "@/assets/icons";
import { CheckInOutInfo, getCheckInOut } from "@/services/checkInOutService";
import { useAuth } from "@/contexts/AuthContext";
import { STATUS_CHECK_IN_OUT } from "@/constants";
import useCountdown, { TimeLeft } from "@/hooks/useCountdown";
import CheckOutTimer from "@/components/CheckOutTimer";
import Loading from "@/components/Loading";
import { FlatList } from "react-native";

const checkRoom = () => {
  const { user } = useAuth();
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [isCheckIn, setIsCheckIn] = useState<boolean>(false);
  const [checkInOutInfo, setCheckInOutInfo] = useState<CheckInOutInfo | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const flatListRef = useRef(null);

  const gettingCheckInOutInfo = async () => {
    setLoading(true);
    let res = await getCheckInOut(user?.detail?.id || "");
    if (res.success) {
      setCheckInOutInfo(res.data);
    } else {
      Alert.alert("Lỗi", res.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    gettingCheckInOutInfo();
  }, []);

  useEffect(() => {
    if (checkInOutInfo) {
      setCheckIn(
        checkInOutInfo?.check_in_time
          ? new Date(checkInOutInfo.check_in_time)
          : null
      );
      setCheckOut(
        checkInOutInfo?.check_out_time
          ? new Date(checkInOutInfo.check_out_time)
          : null
      );
    }
    if (checkInOutInfo?.status) {
      if (checkInOutInfo?.status === STATUS_CHECK_IN_OUT.NOT_CHECK_IN) {
        setIsCheckIn(false);
      } else {
        setIsCheckIn(true);
      }
    }
  }, [checkInOutInfo]);

  return (
    <ScreenWarpper autoDismissKeyboard={false}>
      <View style={styles.container}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={["Booking Message", "Day Booking"]}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={
            <BookingInfo
              loading={loading}
              checkInOutInfo={checkInOutInfo}
              isCheckIn={isCheckIn}
            />
          }
          renderItem={({ item }) => {
            if (item === "Booking Message") {
              return (
                <View style={[styles.item, { marginTop: 20 }]}>
                  {checkInOutInfo && (
                    <>
                      {!isCheckIn ? (
                        <BookingMessage />
                      ) : (
                        <CheckOutTimer checkOut={checkOut} />
                      )}
                    </>
                  )}
                </View>
              );
            }

            if (item === "Day Booking") {
              return (
                <View style={[styles.item, {marginBottom: 20}]}>
                  <BookingCalendar
                    checkInDate={checkIn}
                    checkOutDate={checkOut}
                  />
                </View>
              );
            }

            return null;
          }}
        />
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
  item: {
    marginVertical: 10,
  },
});

const BookingInfo = ({
  loading,
  checkInOutInfo,
  isCheckIn,
}: {
  loading: boolean;
  checkInOutInfo: CheckInOutInfo | null;
  isCheckIn: boolean;
}) => {
  return (
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
      {loading ? (
        <View
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loading />
        </View>
      ) : (
        <>
          {checkInOutInfo ? (
            <>
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
                  <Text>
                    {checkInOutInfo?.room_id
                      ? `Phòng ${checkInOutInfo?.room_id}`
                      : "Chưa nhận phòng"}
                  </Text>
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
                  <Text>{isCheckIn ? "Đã nhận phòng" : "Chưa nhận phòng"}</Text>
                </View>
              </View>
            </>
          ) : (
            <View>
              <Text
                style={{
                  textAlign: "center",
                  color: theme.colors.darkGray,
                }}
              >
                Bạn chưa đặt phòng nào
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const BookingMessage = () => {
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
  );
};
