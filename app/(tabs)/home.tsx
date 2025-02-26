import {
  Alert,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import ScreenWarpper from "@/components/ScreenWrapper";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import SearchBar from "@/components/SearchBar";
import UserOptionsBar from "@/components/UserOptionsBar";
import { useAuth } from "@/contexts/AuthContext";
import { getRooms, numberRoomReturn, Room } from "@/services/roomService";
import RoomCard from "@/components/RoomCard";
import Loading from "@/components/Loading";
import { useRouter } from "expo-router";

const home = () => {
  const {
    user,
    rooms,
    addRooms,
    page,
    goToNextPage,
    clearPage,
    loadingMoreRooms,
    toggleLoadingMoreRooms,
  } = useAuth();
  const [isKeyboardShow, setIsKeyboardShow] = useState(false);
  const inputRef = useRef(null);
  const [loadingFull, setLoadingFull] = useState(false);
  const router = useRouter();

  const gettingRooms = async (loadingMoreRooms: boolean) => {
    if (!loadingMoreRooms) {
      return;
    } else {
      setLoadingFull(true);
      goToNextPage();
    }

    let userLocation = user?.nowLocation ?? null;

    let res = await getRooms({
      page: page,
      location: userLocation,
    });
    if (res.success) {
      console.log(`Total rooms: ${res.data?.length}`);
      if (res.data?.length ?? 0 > 0) {
        addRooms(res.data || []);
      }
      if (res.data?.length ?? 0 < numberRoomReturn) {
        toggleLoadingMoreRooms();
      }
    } else {
      Alert.alert("Trang chủ", res.message);
    }

    setLoadingFull(false);
  };

  useEffect(() => {
    console.log(`Your location: ${user?.nowLocation}`);

    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardShow(true);
    });

    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardShow(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  if (loadingFull) {
    return (
      <ScreenWarpper
        statusBarColor={theme.colors.lightGray2}
        nightMode={false}
        color={theme.colors.lightGray2}
        autoDismissKeyboard={isKeyboardShow}
      >
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Loading size="large" />
        </View>
      </ScreenWarpper>
    );
  }

  return (
    <ScreenWarpper
      statusBarColor="black"
      nightMode={true}
      color="black"
      autoDismissKeyboard={isKeyboardShow}
    >
      <FlatList
        onEndReachedThreshold={0}
        onEndReached={() => {
          gettingRooms(loadingMoreRooms);
        }}
        data={rooms}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <View>
            <View style={styles.headerContainer}>
              <SearchBar inputRef={inputRef} isKeyboardShow={isKeyboardShow} />
              <UserOptionsBar />
            </View>
            <View
              style={{
                backgroundColor: theme.colors.lightGray2,
                paddingHorizontal: wp(4),
                paddingTop: hp(2),
              }}
            >
              <Text style={styles.sectionTitle}>
                Các Khách Sạn Xung Quanh Bạn
              </Text>
            </View>
          </View>
        }
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => <RoomCard room={item} router={router} />}
      />
    </ScreenWarpper>
  );
};

export default home;

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: hp(2),
    paddingBottom: hp(2),
    paddingHorizontal: wp(4),
    backgroundColor: "black",
    gap: hp(2),
  },
  sectionTitle: {
    fontSize: hp(2.2),
    fontWeight: theme.fonts.extraBold,
    color: "black",
    marginBottom: hp(2),
  },
});
