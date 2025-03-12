import { Alert, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import Loading from "@/components/Loading";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import * as Location from "expo-location";
import { getAddressFromCoordinates } from "@/services/locationService";
import { getProvinces, Province } from "@/services/provinceService";
import useAsyncStorage, { KEYS_STORAGE } from "@/hooks/useAsyncStorage";
import { Image as ExpoImage } from "expo-image";
import GIFs from "@/assets/animations";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";

const waiting = () => {
  const router = useRouter();
  const {
    user,
    loginUser,
    logoutUser,
    updateUser,
    updateNowLocation,
    clearPage,
    clearRooms,
  } = useAuth();
  const [provinces, setProvinces] = useAsyncStorage<Province[]>(
    KEYS_STORAGE.PROVINCES,
    []
  );
  const loadingWidth = 237;
  const loadingHeight = 237;

  const newLoadingWidth = 140;
  const newLoadingHeight = newLoadingWidth / (loadingWidth / loadingHeight);

  const updatingLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied");
      router.push("/home");
      return;
    }

    console.log("Permission to access location was granted");

    try {
      let location: Location.LocationObject | null =
        await Location.getCurrentPositionAsync({});

      if (location) {
        let res = await getAddressFromCoordinates(
          location.coords.latitude,
          location.coords.longitude
        );

        if (res.success && res.data) {
          console.log("Updated user's location");
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

  const gettingCity = async () => {
    let res = await getProvinces();
    if (res.success) {
      setProvinces(res.data || []);
    } else {
      Alert.alert("Loading", res.message);
    }
  };

  useEffect(() => {
    updatingLocation();
    gettingCity();
    clearPage();
    clearRooms();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      <View
        style={{
          borderRadius: theme.radius.xxl * 10,
          borderWidth: 7,
          borderColor: theme.colors.primary,
        }}
      >
        <ExpoImage
          source={GIFs.loading_world}
          style={{ width: newLoadingWidth, height: newLoadingHeight }}
          contentFit="cover"
          transition={1000}
        />
      </View>
      <View style={{ gap: 10 }}>
        <Text style={styles.appName}>Easy Booking</Text>
        <Text style={styles.punchLine}>
          Khám phá hàng nghìn khách sạn tuyệt vời, dễ dàng đặt phòng và tận
          hưởng kỳ nghỉ mơ ước của bạn chỉ trong vài bước đơn giản
        </Text>
      </View>
    </View>
  );
};

export default waiting;

const styles = StyleSheet.create({
  appName: {
    color: theme.colors.primary,
    fontSize: hp(3.2),
    textAlign: "center",
    fontWeight: theme.fonts.extraBold,
  },
  punchLine: {
    textAlign: "center",
    paddingHorizontal: wp(10),
    fontSize: hp(1.7),
    color: theme.colors.textLight,
  },
});
