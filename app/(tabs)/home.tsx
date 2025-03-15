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
import {
  createFavoriteRoom,
  getRooms,
  numberRoomReturn,
  removeFavoriteRoom,
  Room,
} from "@/services/roomService";
import RoomCard from "@/components/RoomCard";
import Loading from "@/components/Loading";
import { useRouter } from "expo-router";
import useAsyncStorage, { KEYS_STORAGE } from "@/hooks/useAsyncStorage";
import { Province } from "@/services/provinceService";
import { Image as ExpoImage } from "expo-image";
import GIFs from "@/assets/animations";

const home = () => {
  const {
    user,
    rooms,
    updateRooms,
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
  const [loadingCriteria, setLoadingCriteria] = useState(true);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const router = useRouter();
  const [isEmptyRooms, setIsEmptyRooms] = useState(false);
  const [provinces, setProvinces] = useAsyncStorage<Province[]>(
    KEYS_STORAGE.PROVINCES,
    []
  );

  const gettingsCriteria = () => {
    setLoadingCriteria(true);
    setTimeout(() => {
      setLoadingCriteria(false);
    }, 500);
  };

  const gettingRooms = async (loadingMoreRooms: boolean) => {
    if (!loadingMoreRooms) {
      return;
    } else {
      setLoadingRooms(true);
      goToNextPage();
    }

    let userLocation = user?.nowLocation ?? null;
    let user_id = user?.detail?.id ?? "";

    let res = await getRooms({
      user_id: user_id,
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
      setIsEmptyRooms(true);
    }

    setLoadingRooms(false);
  };

  useEffect(() => {
    gettingsCriteria();
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
        statusBarColor={theme.colors.primary}
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

  const onLikeRoom = async (roomId: string, isFavorite: boolean) => {
    const updatedRooms = rooms.map((room) =>
      room.id === roomId ? { ...room, isFavorite: !isFavorite } : room
    );

    updateRooms(updatedRooms);

    if (isFavorite) {
      await removeFavoriteRoom(user?.detail?.id ?? "", roomId);
    } else {
      await createFavoriteRoom(user?.detail?.id ?? "", roomId);
    }
  };

  return (
    <ScreenWarpper
      statusBarColor={theme.colors.primaryDark}
      nightMode={true}
      color={theme.colors.white}
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
              <UserOptionsBar loading={loadingCriteria} />
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

            {loadingRooms && <LoadingIndicator />}
            {isEmptyRooms && <EmptyRoomMessages />}
          </View>
        }
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <RoomCard
            room={item}
            router={router}
            onLikeAsync={async (roomId, isFavorite) =>
              onLikeRoom(roomId, isFavorite)
            }
          />
        )}
      />
    </ScreenWarpper>
  );
};

const EmptyRoomMessages = () => {
  return (
    <View
      style={{
        width: "100%",
        height: hp(40),
        backgroundColor: theme.colors.lightGray2,
      }}
    >
      <Text
        style={{
          textAlign: "center",
          padding: 20,
          fontSize: hp(1.6),
        }}
      >
        Hiện không còn khách sạn nào còn phòng
      </Text>
    </View>
  );
};

const LoadingIndicator = () => {
  const loadingWidth = 118;
  const loadingHeight = 119;
  const newLoadingWidth = 40;
  const newLoadingHeight = newLoadingWidth / (loadingWidth / loadingHeight);

  return (
    <View
      style={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.white,
        padding: hp(2),
      }}
    >
      <ExpoImage
        source={GIFs.loading_grid}
        style={{
          width: newLoadingWidth,
          height: newLoadingHeight,
        }}
        contentFit="cover"
        transition={1000}
      />
    </View>
  );
};

export default home;

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: hp(2),
    paddingBottom: hp(2),
    paddingHorizontal: wp(4),
    backgroundColor: theme.colors.primaryDark,
    gap: hp(2),
  },
  sectionTitle: {
    fontSize: hp(2.2),
    fontWeight: theme.fonts.extraBold,
    color: "black",
    marginBottom: hp(2),
  },
});
