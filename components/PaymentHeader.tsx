import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Router } from "expo-router";
import { theme } from "@/constants/theme";
import Icon from "@/assets/icons";
import { hp } from "@/helpers/common";

const PaymentHeader = ({ router }: { router: Router }) => {
  return (
    <View style={styles.container}>
      <View style={styles.backButtonContainer}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Icon
            name="arrowLeft"
            strokeWidth={2}
            size={24}
            color={theme.colors.white}
          />
        </Pressable>
      </View>
      <Text style={styles.title}>{"Thanh toán"}</Text>
    </View>
  );
};

export default PaymentHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    gap: 10,
  },
  backButtonContainer: {
    position: "absolute",
    left: 0,
  },
  backButton: {
    alignSelf: "flex-start",
    padding: 5,
    borderWidth: 1.6,
    borderColor: theme.colors.white,
    borderRadius: theme.radius.sm * 99,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  title: {
    fontSize: hp(2.7),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.white,
  },
});
