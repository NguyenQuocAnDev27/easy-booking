import { Alert, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Loading from "@/components/Loading";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/services/supabaseService";

const logout = () => {
  const { logoutUser, clearPage, clearRooms } = useAuth();

  const onLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.warn("Error logging out", error);
      Alert.alert("Error", "Error signing out!");
    }

    logoutUser();
    clearPage();
    clearRooms();
  };
  useEffect(() => {
    onLogout();
  }, []);
  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: wp(100),
        height: hp(100),
        gap: 20,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: 'white',
      }}
    >
      <Text
        style={{
          fontSize: hp(4),
          fontWeight: theme.fonts.extraBold,
          color: theme.colors.primary,
        }}
      >
        Easy Booking
      </Text>
      <Loading size="large" />
    </View>
  );
};

export default logout;

const styles = StyleSheet.create({});
