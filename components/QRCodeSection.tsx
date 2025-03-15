import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Icon from "@/assets/icons";

const QRCodeSection = ({
  uri,
  onPress,
}: {
  uri: string | null;
  onPress: () => void;
}) => {
  return (
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
      <QRCode uri={uri} />

      {/* confirm scan complete */}
      <ConfirmPaymentButton onPress={onPress} />
    </View>
  );
};

const QRCode = ({ uri }: { uri: string | null }) => {
  return (
    <View style={{ paddingTop: 20 }}>
      <Image
        source={{ uri: uri || undefined }}
        style={{
          width: 250,
          height: 250,
          resizeMode: "contain",
        }}
      />
    </View>
  );
};

const ConfirmPaymentButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
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
  );
};

export default QRCodeSection;

const styles = StyleSheet.create({});
