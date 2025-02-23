import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";
import ScreenWarpper from "@/components/ScreenWrapper";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Button from "@/components/Button";
import { useRouter } from "expo-router";

const welcome = () => {
  const router = useRouter();
  return (
    <ScreenWarpper autoDismissKeyboard={false}>
      <View style={styles.container}>
        <View>
          <Text style={styles.appName}>Easy Booking</Text>
        </View>
        <Image
          style={styles.welcomeImage}
          source={require("../assets/images/welcome.png")}
          resizeMode="contain"
        />
        <View style={{ gap: 20 }}>
          <Text style={styles.title}>Kỳ Nghỉ Bắt Đầu Từ Đây</Text>
          <Text style={styles.punchLine}>
            Khám phá hàng nghìn khách sạn tuyệt vời, dễ dàng đặt phòng và tận
            hưởng kỳ nghỉ mơ ước của bạn chỉ trong vài bước đơn giản
          </Text>
        </View>
        <View
          style={{
            gap: 10,
            width: "100%",
          }}
        >
          <Button text="Bắt Đầu Nào!" onPress={() => router.push("/signUp")} />
        </View>
        <View style={styles.footer}>
          <Text style={{ fontSize: hp(1.6) }}>Đã có tài khoản?</Text>
          <View
            style={{
              paddingHorizontal: 5,
            }}
          >
            <Pressable onPress={() => router.push("/login")}>
              <Text
                style={{
                  fontSize: hp(1.8),
                  color: theme.colors.primary,
                  fontWeight: theme.fonts.bold,
                }}
              >
                Đăng nhập
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWarpper>
  );
};

export default welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: wp(4),
  },
  welcomeImage: {
    height: hp(30),
    width: wp(100),
  },
  appName: {
    color: theme.colors.primary,
    fontSize: hp(3.2),
    textAlign: "center",
    fontWeight: theme.fonts.extraBold,
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(4),
    textAlign: "center",
    fontWeight: theme.fonts.extraBold,
  },
  punchLine: {
    textAlign: "center",
    paddingHorizontal: wp(10),
    fontSize: hp(1.7),
    color: theme.colors.textLight,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
