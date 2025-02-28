import {
  Alert,
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import ScreenWarpper from "@/components/ScreenWrapper";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "@/components/Header";
import { formatVND, hp, wp } from "@/helpers/common";
import Loading from "@/components/Loading";
import { getRoomById, RoomDetail } from "@/services/roomService";
import { useAuth } from "@/contexts/AuthContext";
import Icon from "@/assets/icons";
import { theme } from "@/constants/theme";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { BodyCreateBooking, createBooking } from "@/services/bookingService";
import { STATUS_BOOKING_TICKET } from "@/constants";

const booking = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const roomId = params?.roomId ?? null;
  const { user } = useAuth();
  const [roomDetail, setRoomDetail] = useState<RoomDetail | null>(null);
  const [loadingFull, setLoadingFull] = useState<boolean>(false);
  const [capacity, setCapacity] = useState<number>(1);
  const [isSelectNight, setIsSelectNight] = useState<boolean>(true);
  const [timeStay, setTimeStay] = useState<number>(1);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios" ? true : false);
    setDate(currentDate);
  };

  const gettingRoomDetail = async (roomId: string) => {
    setLoadingFull(true);
    let res = await getRoomById(roomId);

    if (res.success) {
      setRoomDetail(res.data);
      setLoadingFull(false);
    } else {
      Alert.alert("Đặt phòng", "Phòng không tồn tại!");
      setLoadingFull(false);
      router.push("/(tabs)/home");
      return;
    }
  };

  useEffect(() => {
    if (Object.keys(params).length <= 1) {
      Alert.alert("Đặt phòng", "Phòng không tồn tại!");
      router.push("/(tabs)/home");
      return;
    }

    if (roomId === null) {
      Alert.alert("Đặt phòng", "Phòng không tồn tại!");
      router.push("/(tabs)/home");
      return;
    }

    gettingRoomDetail(roomId as string);
  }, []);

  const handleFAB = async () => {
    //
    const totalPrice = () => {
      if (isSelectNight) return (roomDetail?.price_per_night || 0) * capacity;
      return (roomDetail?.price_per_night || 0) * 2 * capacity * timeStay;
    };

    const prepare_data: BodyCreateBooking = {
      user_id: user?.detail?.id ?? "",
      room_id: roomDetail?.id ?? "",
      check_in_date: `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
      check_out_date: `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
      total_price: totalPrice(),
      status: STATUS_BOOKING_TICKET.IN_PROCESS,
    };

    let res = await createBooking(prepare_data);
    if (res.success) {
      router.push({
        pathname: "/payment",
        params: { bookingId: res.data.id },
      });
    } else {
      Alert.alert("Đặt phòng", res.message);
    }
  };

  if (loadingFull) {
    return (
      <ScreenWarpper autoDismissKeyboard={false}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Loading size="large" />
        </View>
      </ScreenWarpper>
    );
  }

  return (
    <ScreenWarpper autoDismissKeyboard={false}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, gap: hp(2) }}>
            <Header title="Đặt phòng" />

            {/* User */}
            <View
              style={{
                width: "100%",
                borderWidth: 0.6,
                borderColor: theme.colors.gray,
                borderRadius: theme.radius.lg,
                padding: 10,
                gap: 5,
              }}
            >
              <Text
                style={{
                  fontSize: hp(2.2),
                  fontWeight: theme.fonts.bold,
                  color: theme.colors.darkGray,
                }}
              >
                Thông tin người dùng
              </Text>

              <View
                style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
              >
                <Icon name="user" color={theme.colors.darkGray} size={20} />
                <Text style={{ color: theme.colors.darkGray }}>
                  {user?.detail?.name}
                </Text>
              </View>
              <View
                style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
              >
                <Icon name="call" color={theme.colors.darkGray} size={20} />
                <Text style={{ color: theme.colors.darkGray }}>
                  {user?.detail?.phone}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  gap: 5,
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Icon name="location" color={theme.colors.darkGray} size={20} />
                <Text
                  style={{
                    color: theme.colors.darkGray,
                    flex: 1,
                    flexWrap: "wrap",
                  }}
                >
                  {user?.detail?.address}
                </Text>
              </View>
            </View>

            {/* Hotel */}
            <View
              style={{
                width: "100%",
                borderWidth: 0.6,
                borderColor: theme.colors.gray,
                borderRadius: theme.radius.lg,
                padding: 10,
                gap: 5,
              }}
            >
              <Text
                style={{
                  fontSize: hp(2.2),
                  fontWeight: theme.fonts.bold,
                  color: theme.colors.darkGray,
                }}
              >
                Thông tin khách sạn
              </Text>

              <View
                style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
              >
                <Icon name="hotel" color={theme.colors.darkGray} size={20} />
                <Text style={{ color: theme.colors.darkGray }}>
                  {roomDetail?.hotel?.name}
                </Text>
              </View>
              <View
                style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
              >
                <Icon name="call" color={theme.colors.darkGray} size={20} />
                <Text style={{ color: theme.colors.darkGray }}>
                  {roomDetail?.hotel?.contact_phone}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  gap: 5,
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Icon name="location" color={theme.colors.darkGray} size={20} />
                <Text
                  style={{
                    color: theme.colors.darkGray,
                    flex: 1,
                    flexWrap: "wrap",
                  }}
                >
                  {roomDetail?.hotel?.address}, {roomDetail?.hotel?.location}
                </Text>
              </View>
            </View>

            {/* Room */}
            <View
              style={{
                width: "100%",
                borderWidth: 0.6,
                borderColor: theme.colors.gray,
                borderRadius: theme.radius.lg,
                padding: 10,
                gap: 5,
              }}
            >
              <Text
                style={{
                  fontSize: hp(2.2),
                  fontWeight: theme.fonts.bold,
                  color: theme.colors.darkGray,
                }}
              >
                Thông tin phòng
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
                >
                  <Icon
                    name="diamond"
                    color={theme.colors.darkGray}
                    size={20}
                  />
                  <Text style={{ color: theme.colors.darkGray }}>
                    {roomDetail?.room_type}
                  </Text>
                </View>
                <View
                  style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
                >
                  <Icon
                    name="dollarCircle"
                    color={theme.colors.darkGray}
                    size={20}
                  />
                  <Text style={{ color: theme.colors.darkGray }}>
                    {formatVND(roomDetail?.price_per_night || 0)}/đêm
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
                >
                  <Icon
                    name="multiUser"
                    color={theme.colors.darkGray}
                    size={20}
                  />
                  <Text style={{ color: theme.colors.darkGray }}>
                    {roomDetail?.capacity} người
                  </Text>
                </View>
                <View
                  style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
                >
                  <Icon name="bed" color={theme.colors.darkGray} size={20} />
                  <Text style={{ color: theme.colors.darkGray }}>
                    {roomDetail?.beds} giường
                  </Text>
                </View>
                <View
                  style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
                >
                  <Icon name="bath" color={theme.colors.darkGray} size={20} />
                  <Text style={{ color: theme.colors.darkGray }}>
                    {roomDetail?.baths} nhà tắm
                  </Text>
                </View>
              </View>
            </View>

            {/* Custom Booking */}
            <View
              style={{
                width: "100%",
                borderWidth: 0.6,
                borderColor: theme.colors.primary,
                borderRadius: theme.radius.lg,
                padding: 10,
                gap: 10,
              }}
            >
              <Text
                style={{
                  fontSize: hp(2.2),
                  fontWeight: theme.fonts.bold,
                  color: theme.colors.primaryDark,
                }}
              >
                Thông tin đặt phòng
              </Text>

              {/* Days or nights */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text>Ở theo</Text>
                <View style={{ flexDirection: "row", gap: 20 }}>
                  <TouchableOpacity
                    onPress={() => {
                      setIsSelectNight((prev) => !prev);
                      setTimeStay(1);
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: isSelectNight
                          ? theme.colors.primaryDark
                          : theme.colors.primaryLight,
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        borderRadius: theme.radius.md,
                      }}
                    >
                      <Text
                        style={{
                          color: isSelectNight ? theme.colors.white : "black",
                        }}
                      >
                        {"Đêm (6h)"}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setIsSelectNight((prev) => !prev);
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: !isSelectNight
                          ? theme.colors.primaryDark
                          : theme.colors.primaryLight,
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        borderRadius: theme.radius.md,
                      }}
                    >
                      <Text
                        style={{
                          color: !isSelectNight ? theme.colors.white : "black",
                        }}
                      >
                        {"Ngày (12h)"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Time Stay */}
              {!isSelectNight && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text>Số {isSelectNight ? "đêm" : "ngày"}</Text>

                  <View style={{ flexDirection: "row", gap: 10 }}>
                    <TouchableOpacity
                      onPress={() => {
                        if (timeStay > 1) {
                          setTimeStay((prev) => prev - 1);
                        }
                      }}
                    >
                      <View
                        style={{
                          padding: 5,
                          backgroundColor: theme.colors.lightGray2,
                          borderRadius: theme.radius.xxl * 99,
                        }}
                      >
                        <Icon
                          name="minusCircle"
                          size={20}
                          color={theme.colors.primary}
                        />
                      </View>
                    </TouchableOpacity>
                    <View
                      style={{
                        padding: 5,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: hp(2),
                          color: theme.colors.primaryDark,
                        }}
                      >
                        {timeStay}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        setTimeStay((prev) => prev + 1);
                      }}
                    >
                      <View
                        style={{
                          padding: 5,
                          backgroundColor: theme.colors.lightGray2,
                          borderRadius: theme.radius.xxl * 99,
                        }}
                      >
                        <Icon
                          name="plusCircle"
                          size={20}
                          color={theme.colors.primary}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* number of people stay */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text>Số người</Text>

                <View style={{ flexDirection: "row", gap: 10 }}>
                  <TouchableOpacity
                    onPress={() => {
                      if (capacity > 1) {
                        setCapacity((prev) => prev - 1);
                      }
                    }}
                  >
                    <View
                      style={{
                        padding: 5,
                        backgroundColor: theme.colors.lightGray2,
                        borderRadius: theme.radius.xxl * 99,
                      }}
                    >
                      <Icon
                        name="minusCircle"
                        size={20}
                        color={theme.colors.primary}
                      />
                    </View>
                  </TouchableOpacity>
                  <View
                    style={{
                      padding: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: hp(2),
                        color: theme.colors.primaryDark,
                      }}
                    >
                      {capacity}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      if (
                        roomDetail?.capacity === undefined ||
                        capacity >= roomDetail?.capacity
                      )
                        return;
                      setCapacity((prev) => prev + 1);
                    }}
                  >
                    <View
                      style={{
                        padding: 5,
                        backgroundColor: theme.colors.lightGray2,
                        borderRadius: theme.radius.xxl * 99,
                      }}
                    >
                      <Icon
                        name="plusCircle"
                        size={20}
                        color={theme.colors.primary}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{}}>
                  Ngày nhận phòng: {date.toLocaleDateString()}
                </Text>

                <TouchableOpacity onPress={() => setShow(true)}>
                  <View
                    style={{
                      padding: 5,
                      borderRadius: theme.radius.lg,
                      backgroundColor: theme.colors.primaryDark,
                      width: 40,
                      height: 40,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon name="calendar" color="white" />
                  </View>
                </TouchableOpacity>

                {show && (
                  <DateTimePicker
                    value={date}
                    mode={"date"}
                    display="default"
                    minimumDate={new Date()}
                    onChange={onChange}
                  />
                )}
              </View>
            </View>

            <View style={{ height: hp(15) }}></View>
          </View>
        </ScrollView>

        {/* FAB Payment */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: wp(100),
          }}
        >
          <LinearGradient
            colors={[theme.colors.lightGray3, "transparent"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={{
              width: wp(100),
              height: hp(2),
            }}
          />
          <View
            style={{
              paddingHorizontal: wp(6),
              paddingVertical: hp(2),
              width: wp(100),
              backgroundColor: "white",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* text left */}
            <View style={{ gap: 5 }}>
              <Text
                style={{
                  color: theme.colors.text,
                  fontSize: hp(2.2),
                  fontWeight: theme.fonts.extraBold,
                }}
              >
                Thành tiền
              </Text>
              <Text
                style={{
                  color: theme.colors.primary,
                  fontSize: hp(2.2),
                  fontWeight: theme.fonts.medium,
                }}
              >
                {isSelectNight
                  ? formatVND((roomDetail?.price_per_night || 0) * capacity)
                  : formatVND(
                      (roomDetail?.price_per_night || 0) *
                        2 *
                        capacity *
                        timeStay
                    )}
              </Text>
            </View>

            {/* button right */}
            <TouchableOpacity
              style={{
                height: "100%",
                backgroundColor: theme.colors.primary,
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: theme.radius.md,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={handleFAB}
            >
              <View>
                <Text
                  style={{
                    color: "white",
                    fontSize: hp(2.6),
                    fontWeight: theme.fonts.bold,
                  }}
                >
                  Thanh toán
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenWarpper>
  );
};

export default booking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: hp(2),
    paddingHorizontal: wp(4),
  },
});
