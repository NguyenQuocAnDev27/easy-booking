import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWarpper from "@/components/ScreenWrapper";
import { useLocalSearchParams } from "expo-router";

const payment = () => {
  const params = useLocalSearchParams();
  const bookingId = params.bookingId;

  return (
    <ScreenWarpper>
      <View>
        <Text>payment</Text>
      </View>
    </ScreenWarpper>
  );
};

export default payment;

const styles = StyleSheet.create({});
