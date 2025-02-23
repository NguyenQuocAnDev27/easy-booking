import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useRef } from "react";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import { useRouter } from "expo-router";
import ScreenWarpper from "@/components/ScreenWrapper";
import BackButton from "@/components/BackButton";
import Input from "@/components/Input";
import Icon from "@/assets/icons";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";

const login = () => {
  const router = useRouter();
  const mailRef = useRef("");
  const passwordRef = useRef("");
  const { loginUser } = useAuth();

  return (
    <ScreenWarpper>
      <View style={styles.container}>
        {/* Welcome Text */}
        <View>
          <Text style={styles.welcomeText}>Chào bạn,</Text>
          <Text style={styles.welcomeText}>đã trở lại! 🤗</Text>
        </View>

        {/* form */}
        <View style={styles.form}>
          <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
            Vui lòng điền đầy đủ các thông tin
          </Text>
          {/* email field */}
          <Input
            icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
            placeholder="Email"
            onChangeText={(text) => (mailRef.current = text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {/* password field */}
          <Input
            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
            placeholder="Mật khẩu"
            secureTextEntry={true}
            onChangeText={(text) => (passwordRef.current = text)}
          />
          {/* button */}
          <Button text="Đăng nhập" onPress={() => {}} />
          {/* footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Chưa có tài khoản!</Text>
            <Pressable onPress={() => router.push("/signUp")}>
              <Text
                style={[
                  styles.footerText,
                  {
                    color: theme.colors.primaryDark,
                    fontWeight: theme.fonts.semibold,
                  },
                ]}
              >
                Đăng ký
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWarpper>
  );
};

export default login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: wp(5),
  },
  welcomeText: {
    fontSize: hp(4),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  },
  form: {
    gap: 25,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: theme.colors.text,
    fontSize: hp(1.6),
  },
});
