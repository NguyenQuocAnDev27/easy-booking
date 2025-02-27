import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import ScreenWarpper from "@/components/ScreenWrapper";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import { useFocusEffect, useRouter } from "expo-router";
import Header from "@/components/Header";
import RoomCard from "@/components/RoomCard";
import { useAuth } from "@/contexts/AuthContext";
import {
  FavoriteRoom,
  getFavoriteRooms,
  numberRoomReturn,
  removeFavoriteRoom,
} from "@/services/roomService";
import Loading from "@/components/Loading";

let page = 0;

const Favorite = () => {
  const { user, updateRooms, rooms: roomsHome } = useAuth();
  const router = useRouter();
  const [loadingMore, setLoadingMore] = useState<boolean>(true);
  const [rooms, setRooms] = useState<FavoriteRoom[]>([]);

  useFocusEffect(() => {
    page = 0;
  });

  const gettingFavoriteRooms = async () => {
    if (!loadingMore) return;
    if (user?.detail?.id === undefined) return;

    page += 1;

    let res = await getFavoriteRooms(user?.detail?.id, page);
    if (res.success) {
      setRooms((prev) => [...res.data, ...prev]);
      if (res.data?.length ?? 0 < numberRoomReturn) {
        setLoadingMore(false);
      }
    } else {
      Alert.alert("Trang yêu thích", res.message);
    }
  };

  const onLikeRoom = async (roomId: string, isFavorite: boolean) => {
    const updatedRooms = rooms.filter((_) => _.room.id !== roomId);

    const updatedRoomsHomme = roomsHome.map((room) =>
      room.id === roomId ? { ...room, isFavorite: false } : room
    );

    setRooms(updatedRooms);
    updateRooms(updatedRoomsHomme);

    await removeFavoriteRoom(user?.detail?.id ?? "", roomId);
  };

  return (
    <ScreenWarpper autoDismissKeyboard={false}>
      <View style={styles.container}>
        <Header title="Danh sách yêu thích" showBackButton={false} />

        {rooms.length == 0 && (
          <View style={{ paddingVertical: hp(2), alignItems: "center" }}>
            <Text
              style={{
                color: theme.colors.darkGray,
              }}
            >
              Bạn chưa thêm phòng nào cả
            </Text>
          </View>
        )}
        <FlatList
          onEndReachedThreshold={0}
          onEndReached={() => {
            gettingFavoriteRooms();
          }}
          data={rooms}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <RoomCard
              room={{
                ...item.room,
                isFavorite: true,
              }}
              router={router}
              color="white"
              onLikeAsync={onLikeRoom}
            />
          )}
          ListFooterComponent={
            loadingMore ? (
              <Loading size="small" />
            ) : (
              <>
                {rooms.length > 2 && (
                  <View style={{ width: "100%", alignItems: "center" }}>
                    <Text style={{ color: theme.colors.darkGray }}>
                      Đã hết danh sách
                    </Text>
                  </View>
                )}
              </>
            )
          }
        />
      </View>
    </ScreenWarpper>
  );
};

export default Favorite;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: hp(2),
    paddingHorizontal: wp(4),
  },
});
