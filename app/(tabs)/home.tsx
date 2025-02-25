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

let page = 0;

// Task tối: sửa useState loadingMore vào useAuth vì khi chuyển tab thì nó sẽ reload true ban đầu -> load lại -> sai
// cả page cũng vậy

const home = () => {
  const { user, rooms, addRooms } = useAuth();
  const [isKeyboardShow, setIsKeyboardShow] = useState(false);
  const [loadingMore, setLoadingMore] = useState(true);
  const inputRef = useRef(null);

  console.log(`Your location: ${user?.nowLocation}`);

  const gettingRooms = async () => {
    if (!loadingMore) {
      return;
    }

    page += 1;
    let nowLocation = user?.nowLocation ?? null;

    let res = await getRooms({
      page: page,
      location: nowLocation,
    });
    if (res.success) {
      if (res.data?.length ?? 0 > 0) {
        addRooms(res.data || []);
      }
      if (res.data?.length ?? 0 < numberRoomReturn) {
        setLoadingMore(false);
      }
    } else {
      Alert.alert("Trang chủ", res.message);
    }
  };

  useEffect(() => {
    // gettingRooms();

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
          gettingRooms();
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
        renderItem={({ item }) => <RoomCard room={item} />}
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
