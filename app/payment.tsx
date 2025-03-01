import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWarpper from "@/components/ScreenWrapper";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Bank,
  createPayment,
  createQRCode,
  getBanks,
  PaymentBody,
} from "@/services/paymentService";
import {
  BodyCreateBooking,
  BookingTicket,
  createBooking,
  getBooking,
} from "@/services/bookingService";
import { capitalizeText, formatVND, hp, wp } from "@/helpers/common";
import Icon from "@/assets/icons";
import { theme } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/Loading";
import { STATUS_BOOKING_TICKET, STATUS_CHECK_IN_OUT } from "@/constants";
import {
  CheckInOutInfo,
  createOrUpdateCheckInOut,
} from "@/services/checkInOutService";

const payment = () => {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const bookingId = params?.bookingId ?? "";
  const [banks, setBanks] = useState<Bank[]>([]);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [bookingTicket, setBookingTicket] = useState<BookingTicket | null>(
    null
  );
  const [loadingPayment, setLoadingPayment] = useState<boolean>(false);

  const gettingBanks = async () => {
    let res = await getBanks();
    if (res.success) {
      setBanks(res.data);
    } else {
      Alert.alert("Thanh toán", res.message);
    }
  };

  const gettingBookingTicket = async () => {
    let res = await getBooking(bookingId as string);
    if (res.success) {
      setBookingTicket(res.data);

      if (res.data.room.hotel.acqId && res.data.room.hotel.accountNo) {
        await creatingQRCode(
          res.data.room.hotel.acqId,
          res.data.room.hotel.accountNo
        );
      }
    } else {
      Alert.alert("Thanh toán", res.message);
    }
  };

  const creatingQRCode = async (acqId: string, accountNo: string) => {
    let res = await createQRCode({ acqId, accountNo });

    if (res.success) {
      setImageUri(res.data);
    } else {
      Alert.alert("Thanh toán", res.message);
    }
  };

  const onConfirmPayment = async () => {
    setLoadingPayment(true);

    let bodyPayment: PaymentBody = {
      booking_id: bookingTicket?.id || "",
      payment_method: "QRCode",
      transaction_status: "SUCCESS",
      transaction_id: "TEST",
    };

    let bodyBooking: BodyCreateBooking = {
      id: bookingTicket?.id || "",
      user_id: bookingTicket?.user_id || "",
      room_id: bookingTicket?.room_id || "",
      check_in_date: bookingTicket?.check_in_date || "",
      check_out_date: bookingTicket?.check_out_date || "",
      total_price: bookingTicket?.total_price || 0,
      status: STATUS_BOOKING_TICKET.COMPLETED,
    };

    let bodyCheckInOut: CheckInOutInfo = {
      booking_id: bookingTicket?.id || "",
      user_id: bookingTicket?.user_id || "",
      room_id: "",
      check_in_time: bookingTicket?.check_in_date || "",
      check_out_time: bookingTicket?.check_out_date || "",
      employee_id: "Admin[01]",
      status: STATUS_CHECK_IN_OUT.NOT_CHECK_IN,
    };

    let res = await createPayment(bodyPayment);
    let res2 = await createBooking(bodyBooking);
    let res3 = await createOrUpdateCheckInOut(bodyCheckInOut);

    if (res.success || res2.success || res3.success) {
      Alert.alert("Thanh toán", "Thanh toán hoàn tất");
      router.push("/(tabs)/checkRoom");
    } else {
      console.error("Thanh toán - Payment", res.message);
      console.error("Thanh toán - Booking", res2.message);
      console.error("Thanh toán - Check In Out", res3.message);
      Alert.alert("Thanh toán", "Thanh toán thất bại");
    }

    setLoadingPayment(false);
  };

  useEffect(() => {
    // gettingBanks();
    gettingBookingTicket();
  }, []);

  if (loadingPayment) {
    return (
      <ScreenWarpper
        autoDismissKeyboard={false}
        statusBarColor={theme.colors.primary}
        nightMode={true}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: theme.colors.white,
              fontSize: hp(2.2),
              fontWeight: theme.fonts.semibold,
              marginBottom: hp(2),
            }}
          >
            Đang Tiến Hành Xác Thực
          </Text>
          <Loading size="large" color={theme.colors.white} />
        </View>
      </ScreenWarpper>
    );
  }

  return (
    <ScreenWarpper
      autoDismissKeyboard={false}
      statusBarColor={theme.colors.primary}
      nightMode={true}
    >
      <ScrollView style={[styles.container]}>
        {/* Header */}
        <View
          style={[
            {
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
              gap: 10,
            },
            { marginBottom: 10 },
          ]}
        >
          <View
            style={{
              position: "absolute",
              left: 0,
            }}
          >
            <Pressable
              onPress={() => router.back()}
              style={{
                alignSelf: "flex-start",
                padding: 5,
                borderWidth: 1.6,
                borderColor: theme.colors.white,
                borderRadius: theme.radius.sm * 99,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
              }}
            >
              <Icon
                name="arrowLeft"
                strokeWidth={2}
                size={24}
                color={theme.colors.white}
              />
            </Pressable>
          </View>
          <Text
            style={{
              fontSize: hp(2.7),
              fontWeight: theme.fonts.semibold,
              color: theme.colors.white,
            }}
          >
            {"Thanh toán"}
          </Text>
        </View>

        {/* Ticket */}
        <View
          style={{
            padding: wp(4),
            marginHorizontal: wp(1),
            gap: 20,
            borderWidth: 1,
            borderColor: theme.colors.primary,
            borderRadius: theme.radius.md,
            marginTop: hp(2),
            backgroundColor: theme.colors.white,
          }}
        >
          <View
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: hp(2),
                fontWeight: theme.fonts.extraBold,
                color: theme.colors.primaryDark,
              }}
            >
              Thông tin đặt phòng
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: 20,
              paddingBottom: 20,
              borderBottomWidth: 1,
              borderStyle: "dashed",
              borderColor: theme.colors.lightGray3,
            }}
          >
            {/* logo hotel */}
            <View
              style={{
                backgroundColor: theme.colors.lightGray2,
                width: 60,
                height: 60,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: theme.radius.xxl,
                borderCurve: "continuous",
              }}
            >
              <Icon name="hotel" size={40} color={theme.colors.primaryDark} />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                flex: 1,
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: hp(3),
                    color: theme.colors.dark,
                    fontWeight: theme.fonts.medium,
                  }}
                >
                  Saalbach
                </Text>
                <View style={{ flexDirection: "row", gap: 5 }}>
                  <Icon
                    name="diamond"
                    size={18}
                    color={theme.colors.lightGray4}
                  />
                  <Text
                    style={{
                      color: theme.colors.lightGray4,
                      fontWeight: theme.fonts.medium,
                    }}
                  >
                    Phổ thông
                  </Text>
                </View>
              </View>

              <View style={{ gap: 5, alignItems: "flex-end" }}>
                <View style={{ flexDirection: "row", gap: 5 }}>
                  <Icon name="multiUser" color={theme.colors.dark} />
                  <Text
                    style={{
                      fontSize: hp(2),
                      fontWeight: theme.fonts.medium,
                    }}
                  >
                    1 người
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: hp(2),
                    fontWeight: theme.fonts.medium,
                  }}
                >
                  1 đêm
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              gap: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                width: "100%",
              }}
            >
              <View
                style={{
                  padding: 15,
                  backgroundColor: theme.colors.lightGray2,
                  borderRadius: theme.radius.xl,
                  gap: 5,
                  flex: 1,
                  marginRight: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: hp(2.4),
                    fontWeight: theme.fonts.medium,
                  }}
                >
                  28/02/2025
                </Text>
                <Text style={{ fontSize: hp(2), color: theme.colors.darkGray }}>
                  Nhận Phòng
                </Text>
              </View>

              <View
                style={{
                  padding: 15,
                  backgroundColor: theme.colors.lightGray2,
                  borderRadius: theme.radius.xl,
                  gap: 5,
                  flex: 1,
                  marginLeft: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: hp(2.4),
                    fontWeight: theme.fonts.medium,
                  }}
                >
                  29/02/2025
                </Text>
                <Text style={{ fontSize: hp(2), color: theme.colors.darkGray }}>
                  Trả Phòng
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  padding: 15,
                  backgroundColor: theme.colors.lightGray2,
                  borderRadius: theme.radius.xl,
                  gap: 5,
                  flex: 1,
                  marginRight: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: hp(2.4),
                    fontWeight: theme.fonts.medium,
                  }}
                >
                  {capitalizeText(user?.detail?.name ?? "")}
                </Text>
                <Text style={{ fontSize: hp(2), color: theme.colors.darkGray }}>
                  Người Đặt
                </Text>
              </View>

              <View
                style={{
                  padding: 15,
                  backgroundColor: theme.colors.lightGray2,
                  borderRadius: theme.radius.xl,
                  gap: 5,
                  flex: 1,
                  marginLeft: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: hp(2.4),
                    fontWeight: theme.fonts.medium,
                  }}
                >
                  {user?.detail?.phone}
                </Text>
                <Text style={{ fontSize: hp(2), color: theme.colors.darkGray }}>
                  SĐT Liên Lạc
                </Text>
              </View>
            </View>

            <View>
              <View
                style={{
                  width: "100%",
                  paddingVertical: hp(2),
                  alignItems: "center",
                  justifyContent: "center",
                  borderTopWidth: 1,
                  borderStyle: "dashed",
                  borderColor: theme.colors.lightGray3,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: wp(2),
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 5,
                      alignItems: "center",
                    }}
                  >
                    <Icon
                      name="dollarCircle"
                      color={theme.colors.primary}
                      size={30}
                    />
                    <Text
                      style={{
                        fontSize: hp(2),
                        color: theme.colors.darkGray,
                      }}
                    >
                      Thành Tiền
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: hp(2.6),
                      fontWeight: theme.fonts.extraBold,
                    }}
                  >
                    {formatVND(bookingTicket?.total_price || 0)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* qr code */}
        <View
          style={{
            padding: wp(4),
            marginHorizontal: wp(1),
            gap: 20,
            borderWidth: 1,
            borderColor: theme.colors.primary,
            borderRadius: theme.radius.md,
            marginTop: hp(2),
            backgroundColor: theme.colors.white,
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Text
              style={{
                fontSize: hp(2),
                fontWeight: theme.fonts.extraBold,
                color: theme.colors.primaryDark,
              }}
            >
              Quét Mã Dưới Đây
            </Text>
            <Icon name="squareArrowDown" color={theme.colors.primaryDark} />
          </View>

          {/* qrcode */}
          <View style={{ paddingTop: 20 }}>
            <Image
              source={{ uri: imageUri || undefined }}
              style={{
                width: 250,
                height: 250,
                resizeMode: "contain",
              }}
            />
          </View>
          {/* confirm scan complete */}
          <TouchableOpacity
            onPress={onConfirmPayment}
            style={{
              marginVertical: hp(2),
            }}
          >
            <View
              style={{
                width: "100%",
                paddingVertical: hp(2),
                paddingHorizontal: wp(10),
                backgroundColor: theme.colors.primaryDark,
                borderRadius: theme.radius.xxl * 99,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: hp(2.4),
                  fontWeight: theme.fonts.bold,
                  color: theme.colors.white,
                }}
              >
                Xác Nhận Đã Thanh Toán
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ height: hp(10) }}></View>
      </ScrollView>
    </ScreenWarpper>
  );
};

export default payment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: hp(2),
    paddingHorizontal: wp(4),
    backgroundColor: theme.colors.primary,
  },
});
