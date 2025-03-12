import {
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import ScreenWarpper from "@/components/ScreenWrapper";
import BackButton from "@/components/BackButton";
import { useRouter } from "expo-router";
import Input from "@/components/Input";
import Icon from "@/assets/icons";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/services/supabaseService";
import { SignUpWithPasswordCredentials } from "@supabase/supabase-js";

const signUp = () => {
  const router = useRouter();
  const mailRef = useRef("");
  const passwordRef = useRef("");
  const nameRef = useRef("");
  const [loadingButton, setLoadingButton] = useState(false);

  const onSignUp = async () => {
    if (
      mailRef.current.length === 0 ||
      passwordRef.current.length === 0 ||
      nameRef.current.length === 0
    ) {
      Alert.alert("Đăng ký", "Vui lòng điền đầy đủ các thông tin");
      return;
    }

    setLoadingButton(true);
    Keyboard.dismiss();

    let prepareData: SignUpWithPasswordCredentials = {
      email: mailRef.current,
      password: passwordRef.current,
      options: {
        data: {
          name: nameRef.current,
        },
      },
    };

    // 🔄️
    let {
      data: { session },
      error,
    } = await supabase.auth.signUp(prepareData);

    console.log("session", session?.user?.id);
    setLoadingButton(false);

    // ❌ Error
    if (error) {
      console.log("error", error.message);
      Alert.alert("Đăng ký", error.message);
    }

    // ✅ Success
    router.push("/home");
  };

  return (
    <ScreenWarpper>
      <View style={styles.container}>
        {/* Welcome Text */}
        <View>
          <Text style={styles.welcomeText}>Hãy</Text>
          <Text style={styles.welcomeText}>Bắt Đầu Nào! 🔥</Text>
        </View>

        {/* form */}
        <View style={styles.form}>
          <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
            Vui lòng điền đầy đủ các thông tin
          </Text>
          {/* name field */}
          <Input
            icon={<Icon name="user" size={26} strokeWidth={1.6} />}
            placeholder="Họ tên"
            onChangeText={(text) => (nameRef.current = text)}
          />
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
            onChangeText={(text) => (passwordRef.current = text)}
          />
          {/* button */}
          <Button text="Đăng ký" onPress={onSignUp} loading={loadingButton} />
          {/* footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Đã có tài khoản!</Text>
            <Pressable onPress={() => router.push("/login")}>
              <Text
                style={[
                  styles.footerText,
                  {
                    color: theme.colors.primaryDark,
                    fontWeight: theme.fonts.semibold,
                  },
                ]}
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

export default signUp;

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
