import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { router, useRouter } from "expo-router";
import ScreenWarpper from "@/components/ScreenWrapper";
import { getRoomById, RoomDetail } from "@/services/roomService";
import { theme } from "@/constants/theme";
import { formatVND, hp, wp } from "@/helpers/common";
import Icon from "@/assets/icons";
import Grid from "@/components/Grid";
import { LinearGradient } from "expo-linear-gradient";
import Loading from "@/components/Loading";

const roomDetail = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const roomId = params?.roomId ?? null;
  const [roomDetail, setRoomDetail] = useState<RoomDetail | null>(null);
  const [loadingFull, setLoadingFull] = useState<boolean>(false);

  const gettingRoomDetail = async (roomId: string) => {
    setLoadingFull(true);
    let res = await getRoomById(roomId);

    if (res.success) {
      setRoomDetail(res.data);
      setLoadingFull(false);
    } else {
      Alert.alert("Thông tin về phòng", "Phòng không tồn tại!");
      setLoadingFull(false);
      router.push("/(tabs)/home");
      return;
    }
  };

  useEffect(() => {
    if (Object.keys(params).length <= 1) {
      Alert.alert("Thông tin về phòng", "Phòng không tồn tại!");
      router.push("/(tabs)/home");
      return;
    }

    if (roomId === null) {
      Alert.alert("Thông tin về phòng", "Phòng không tồn tại!");
      router.push("/(tabs)/home");
      return;
    }

    gettingRoomDetail(roomId as string);
  }, []);

  if (loadingFull) {
    return (
      <ScreenWarpper autoDismissKeyboard={false}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Loading size="large" />
        </View>
      </ScreenWarpper>
    );
  }

  return (
    <ScreenWarpper autoDismissKeyboard={false}>
      <View style={{ flex: 1, backgroundColor: theme.colors.lightGray2 }}>
        <ScrollView>
          <>
            <RoomHeader room={roomDetail} />
            <DetailSection room={roomDetail} />
            <View style={{ height: hp(15) }}></View>
          </>
        </ScrollView>

        {/* booking */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: wp(100),
          }}
        >
          <LinearGradient
            colors={[theme.colors.lightGray3, "transparent"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={{
              width: wp(100),
              height: hp(2),
            }}
          />
          <View
            style={{
              paddingHorizontal: wp(6),
              paddingVertical: hp(2),
              width: wp(100),
              backgroundColor: "white",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* text left */}
            <View style={{ gap: 5 }}>
              <Text
                style={{
                  color: theme.colors.text,
                  fontSize: hp(2.2),
                  fontWeight: theme.fonts.extraBold,
                }}
              >
                Giá phòng
              </Text>
              <Text
                style={{
                  color: theme.colors.primary,
                  fontSize: hp(2.2),
                  fontWeight: theme.fonts.medium,
                }}
              >
                {formatVND(roomDetail?.price_per_night || 0)}/đêm
              </Text>
            </View>

            {/* button right */}
            <TouchableOpacity
              style={{
                height: "100%",
                backgroundColor: theme.colors.primary,
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: theme.radius.md,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() =>
                router.push({
                  pathname: "/booking",
                  params: { roomId: roomDetail?.id },
                })
              }
            >
              <View>
                <Text
                  style={{
                    color: "white",
                    fontSize: hp(2.6),
                    fontWeight: theme.fonts.bold,
                  }}
                >
                  Đặt phòng
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenWarpper>
  );
};

const RoomHeader = ({ room }: { room: RoomDetail | null }) => {
  return (
    <View style={{ backgroundColor: "white" }}>
      <View>
        {/* RoomDetail Image */}
        <View style={{ width: wp(100) }}>
          <Image
            source={require("../assets/images/defaultRoom.jpg")}
            style={styles.roomImage}
            resizeMode="cover"
          />
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: wp(100),
              paddingHorizontal: wp(4),
              paddingVertical: hp(2),
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity onPress={() => router.back()}>
              <View
                style={{
                  backgroundColor: "rgba(0,0,0,0.3)",
                  borderRadius: theme.radius.xxl * 99,
                  padding: 8,
                }}
              >
                <Icon name="arrowLeft" size={22} color="white" />
              </View>
            </TouchableOpacity>

            <View
              style={{
                flexDirection: "row",
                gap: 15,
              }}
            >
              <TouchableOpacity>
                <View
                  style={{
                    backgroundColor: "rgba(0,0,0,0.3)",
                    borderRadius: theme.radius.xxl * 99,
                    padding: 8,
                  }}
                >
                  <Icon name="heart" size={22} color="white" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity>
                <View
                  style={{
                    backgroundColor: "rgba(0,0,0,0.3)",
                    borderRadius: theme.radius.xxl * 99,
                    padding: 8,
                  }}
                >
                  <Icon name="share" size={22} color="white" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              paddingHorizontal: wp(4),
              paddingVertical: hp(2),
            }}
          >
            <View
              style={{
                backgroundColor: "rgba(248, 248, 248, 0.5)",
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: theme.radius.md,
              }}
            >
              <Text
                style={{
                  color: "white",
                }}
              >
                1/23
              </Text>
            </View>
          </View>
        </View>

        {/* title */}
        <View style={{ padding: wp(4), gap: hp(2) }}>
          {/* Hotel Name & Price */}
          <View>
            <Text style={styles.hotelName}>
              {room?.hotel?.name || "Không rõ"}
            </Text>
          </View>

          {/* Location */}
          <View style={styles.row}>
            <Icon name="location" color={theme.colors.darkGray} size={22} />
            <Text style={styles.darkGrayText}>
              {room?.hotel?.location || "Không rõ"}
            </Text>
          </View>

          <View style={[styles.row, { gap: wp(10) }]}>
            {/* Rating & Reviews */}
            <View style={styles.row}>
              <Icon name="diamond" color={theme.colors.darkGray} size={22} />
              <Text style={styles.darkGrayText}>
                {room?.room_type || "Không rõ"}
              </Text>
            </View>

            {/* RoomDetail Type */}
            <View style={styles.row}>
              <Icon name="star" color={theme.colors.darkGray} size={22} />
              <Text style={styles.darkGrayText}>
                {room?.hotel?.rating || 5}
              </Text>
              <Text style={styles.darkGrayText}>
                ({room?.hotel?.reviews?.length || 0})
              </Text>
            </View>
          </View>

          <View style={[styles.row, { gap: wp(10) }]}>
            {/* Capacity */}
            <View style={styles.row}>
              <Icon name="multiUser" color={theme.colors.text} size={22} />
              <Text style={{ color: theme.colors.text }}>
                {room?.capacity || "Không rõ"} người
              </Text>
            </View>

            {/* Bed */}
            <View style={styles.row}>
              <Icon name="bed" color={theme.colors.text} size={22} />
              <Text style={{ color: theme.colors.text }}>
                {room?.beds || 0} giường
              </Text>
            </View>

            {/* Bath */}
            <View style={styles.row}>
              <Icon name="bath" color={theme.colors.text} size={22} />
              <Text style={{ color: theme.colors.text }}>
                {room?.baths || 0} nhà tắm
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const DetailSection = ({ room }: { room: RoomDetail | null }) => {
  return (
    <View style={{ flex: 1, padding: wp(4) }}>
      <View
        style={{
          width: "100%",
          backgroundColor: "white",
          paddingHorizontal: wp(4),
          paddingVertical: hp(2),
          borderRadius: theme.radius.md,
          gap: 15,
        }}
      >
        <View style={{ gap: 10 }}>
          <Text style={{ fontSize: hp(2.2), fontWeight: theme.fonts.bold }}>
            Tiện Nghi Nổi Bật
          </Text>

          {/* Amenities */}
          <Grid data={room?.hotel?.hotel_amenities || []} />

          {/* {room?.hotel?.hotel_amenities && (
            <FlatList
              data={room?.hotel?.hotel_amenities || []}
              keyExtractor={(item) => item.id}
              numColumns={2}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.row,
                    {
                      backgroundColor: theme.colors.lightGray2,
                      margin: 5,
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      borderRadius: theme.radius.md,
                    },
                  ]}
                >
                  <Icon
                    name="sparkles"
                    color={theme.colors.primary}
                    size={22}
                  />
                  <Text style={[styles.amenityText, { fontSize: hp(1.8) }]}>
                    {item?.amenity?.name || "Không rõ"}
                  </Text>
                </View>
              )}
              style={styles.amenityContainer}
            />
          )} */}
        </View>

        <View style={{ gap: 10 }}>
          <Text style={{ fontSize: hp(2.2), fontWeight: theme.fonts.bold }}>
            Mô tả
          </Text>

          <View>
            <Text style={[styles.darkGrayText]}>
              {room?.hotel?.description}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default roomDetail;

const styles = StyleSheet.create({
  conatiner: {
    gap: 10,
  },

  roomImage: {
    height: hp(30),
    width: "100%",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    gap: 5,
  },

  hotelName: {
    fontSize: hp(3.2),
    fontWeight: theme.fonts.bold,
  },

  priceText: {
    color: theme.colors.primary,
    fontWeight: theme.fonts.extraBold,
  },

  darkGrayText: {
    fontSize: hp(1.8),
    color: theme.colors.darkGray,
  },

  amenityContainer: {
    borderColor: theme.colors.darkGray,
  },

  amenityText: {
    color: theme.colors.darkGray,
  },
});
