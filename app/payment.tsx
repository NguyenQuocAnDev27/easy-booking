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
import { Router, useLocalSearchParams, useRouter } from "expo-router";
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
import { AppUser } from "@/hooks/authSlice";
import PaymentHeader from "@/components/PaymentHeader";
import PaymentInfo from "@/components/PaymentInfo";
import QRCodeSection from "@/components/QRCodeSection";

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
      router.push("/(tabs)/home");
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
        <LoadingPaymentIndicator />
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
        <PaymentHeader router={router} />

        {/* Ticket */}
        <PaymentInfo user={user} bookingTicket={bookingTicket} />

        {/* qr code */}
        <QRCodeSection uri={imageUri} onPress={onConfirmPayment} />

        <View style={{ height: hp(10) }}></View>
      </ScrollView>
    </ScreenWarpper>
  );
};

const LoadingPaymentIndicator = () => {
  return (
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
