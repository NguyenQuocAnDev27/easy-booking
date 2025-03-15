import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { AppUser } from "@/hooks/authSlice";
import { BookingTicket } from "@/services/bookingService";
import { capitalizeText, formatVND, hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Icon from "@/assets/icons";

const PaymentInfo = ({
  user,
  bookingTicket,
}: {
  user: AppUser | null;
  bookingTicket: BookingTicket | null;
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Xác Nhận Thông Tin</Text>
      </View>

      <View style={styles.bookingDetailsContainer}>
        {/* Hotel Logo */}
        <View style={styles.hotelLogoContainer}>
          <Icon name="hotel" size={40} color={theme.colors.primaryDark} />
        </View>

        {/* Hotel & Booking Info */}
        <View style={styles.hotelInfoContainer}>
          <View>
            <Text style={styles.hotelName}>Saalbach</Text>
            <View style={styles.roomTypeContainer}>
              <Icon name="diamond" size={18} color={theme.colors.lightGray4} />
              <Text style={styles.roomTypeText}>Phổ thông</Text>
            </View>
          </View>

          <View style={styles.guestInfoContainer}>
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Icon name="multiUser" color={theme.colors.dark} />
              <Text style={styles.guestInfoText}>1 người</Text>
            </View>
            <Text style={styles.guestInfoText}>1 đêm</Text>
          </View>
        </View>
      </View>

      {/* Check-in & Check-out */}
      <View style={styles.dateContainer}>
        <View style={[styles.dateBox, { marginRight: 10 }]}>
          <Text style={styles.dateText}>28/02/2025</Text>
          <Text style={styles.dateLabel}>Nhận Phòng</Text>
        </View>

        <View style={[styles.dateBox, { marginLeft: 10 }]}>
          <Text style={styles.dateText}>29/02/2025</Text>
          <Text style={styles.dateLabel}>Trả Phòng</Text>
        </View>
      </View>

      {/* Guest Information */}
      <View style={styles.dateContainer}>
        <View style={[styles.dateBox, { marginRight: 10 }]}>
          <Text style={styles.dateText}>
            {capitalizeText(user?.detail?.name ?? "")}
          </Text>
          <Text style={styles.dateLabel}>Người Đặt</Text>
        </View>

        <View style={[styles.dateBox, { marginLeft: 10 }]}>
          <Text style={styles.dateText}>{user?.detail?.phone}</Text>
          <Text style={styles.dateLabel}>SĐT Liên Lạc</Text>
        </View>
      </View>

      {/* Price Info */}
      <View style={styles.priceContainer}>
        <View style={styles.priceDetails}>
          <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
            <Icon name="dollarCircle" color={theme.colors.primary} size={30} />
            <Text style={styles.totalPriceText}>Thành Tiền</Text>
          </View>
          <Text style={styles.totalPriceValue}>
            {formatVND(bookingTicket?.total_price || 0)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PaymentInfo;

const styles = StyleSheet.create({
  container: {
    padding: wp(4),
    marginHorizontal: wp(1),
    gap: 20,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    marginTop: hp(2),
    backgroundColor: theme.colors.white,
  },
  titleContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: hp(2),
    fontWeight: theme.fonts.extraBold,
    color: theme.colors.primaryDark,
  },
  bookingDetailsContainer: {
    flexDirection: "row",
    gap: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderStyle: "dashed",
    borderColor: theme.colors.lightGray3,
  },
  hotelLogoContainer: {
    backgroundColor: theme.colors.lightGray2,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.xxl,
    borderCurve: "continuous",
  },
  hotelInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  hotelName: {
    fontSize: hp(3),
    color: theme.colors.dark,
    fontWeight: theme.fonts.medium,
  },
  roomTypeContainer: {
    flexDirection: "row",
    gap: 5,
  },
  roomTypeText: {
    color: theme.colors.lightGray4,
    fontWeight: theme.fonts.medium,
  },
  guestInfoContainer: {
    gap: 5,
    alignItems: "flex-end",
  },
  guestInfoText: {
    fontSize: hp(2),
    fontWeight: theme.fonts.medium,
  },
  dateContainer: {
    flexDirection: "row",
    width: "100%",
  },
  dateBox: {
    padding: 15,
    backgroundColor: theme.colors.lightGray2,
    borderRadius: theme.radius.xl,
    gap: 5,
    flex: 1,
  },
  dateText: {
    fontSize: hp(2.4),
    fontWeight: theme.fonts.medium,
  },
  dateLabel: {
    fontSize: hp(2),
    color: theme.colors.darkGray,
  },
  priceContainer: {
    width: "100%",
    paddingVertical: hp(2),
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderColor: theme.colors.lightGray3,
  },
  priceDetails: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(2),
  },
  totalPriceText: {
    fontSize: hp(2),
    color: theme.colors.darkGray,
  },
  totalPriceValue: {
    fontSize: hp(2.6),
    fontWeight: theme.fonts.bold,
  },
});
