import { Alert, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import Loading from "@/components/Loading";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import * as Location from "expo-location";
import { getAddressFromCoordinates } from "@/services/locationService";

const waiting = () => {
  const router = useRouter();
  const { user, loginUser, logoutUser, updateUser, updateNowLocation } =
    useAuth();

  const updatingLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied");
      router.push("/home");
      return;
    }

    try {
      let location: Location.LocationObject | null =
        await Location.getCurrentPositionAsync({});

      if (location) {
        let res = await getAddressFromCoordinates(
          location.coords.latitude,
          location.coords.longitude
        );

        if (res.success && res.data) {
          updateNowLocation(
            `${res.data.address.suburb} - ${res.data.address.city}`
          );
        } else {
          updateNowLocation("");
        }
      } else {
        updateNowLocation("");
      }
    } catch (error) {
      console.error("Error fetching location: ", error);
      updateNowLocation("");
      Alert.alert("Error", "Unable to fetch your location. Please try again.");
    }
    router.push("/home");
  };

  useEffect(() => {
    updatingLocation();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "white", alignItems: 'center', justifyContent: 'center' }}>
      <Loading size="large" />
    </View>
  );
};

export default waiting;

const styles = StyleSheet.create({});
