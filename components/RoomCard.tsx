import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Room } from "@/services/roomService";
import { theme } from "@/constants/theme";
import { formatVND, hp, wp } from "@/helpers/common";
import Icon from "@/assets/icons";
import { Router } from "expo-router";

interface RoomCardProps {
  room: Room;
  isFavarite?: boolean;
  router?: Router;
}

const RoomCard: React.FC<RoomCardProps> = ({
  room,
  isFavarite = false,
  router,
}) => {
  const [colorTouch, setColorTouch] = useState("transparent");

  const openRoomDetail = () => {
    router?.push({
      pathname: "/roomDetail",
      params: {
        roomId: room.id,
      },
    });
  };
  return (
    <View
      style={{
        backgroundColor: theme.colors.lightGray2,
        paddingHorizontal: wp(4),
        paddingBottom: hp(2),
      }}
    >
      <TouchableOpacity
        style={{
          borderRadius: theme.radius.xxl * 1.1,
          borderCurve: "continuous",
          backgroundColor: colorTouch,
          marginBottom: 15,
        }}
        activeOpacity={0.2}
        onPressIn={() => setColorTouch(theme.colors.primaryLight)}
        onPressOut={() => setColorTouch("transparent")}
        onPress={openRoomDetail}
      >
        <View style={styles.cardContainer}>
          {/* Room Image */}
          <Image
            source={require("../assets/images/defaultRoom.jpg")}
            style={styles.roomImage}
            resizeMode="cover"
          />

          {/* Hotel Name & Price */}
          <View style={styles.rowBetween}>
            <Text style={styles.hotelName}>
              {room?.hotel?.name || "Không rõ"}
            </Text>
            <Text style={styles.priceText}>{`${formatVND(
              room?.price_per_night || 0
            )}/đêm`}</Text>
          </View>

          {/* Location */}
          <View style={styles.row}>
            <Icon name="location" color={theme.colors.darkGray} size={20} />
            <Text style={styles.darkGrayText}>
              {room?.hotel?.location || "Không rõ"}
            </Text>
          </View>

          <View style={[styles.row, { gap: wp(4) }]}>
            {/* Rating & Reviews */}
            <View style={styles.row}>
              <Icon name="diamond" color={theme.colors.darkGray} size={20} />
              <Text style={styles.darkGrayText}>
                {room?.room_type || "Không rõ"}
              </Text>
            </View>

            {/* Room Type */}
            <View style={styles.row}>
              <Icon name="star" color={theme.colors.darkGray} size={20} />
              <Text style={styles.darkGrayText}>
                {room?.hotel?.rating || 5}
              </Text>
              <Text style={styles.darkGrayText}>
                ({room?.hotel?.reviews?.length || 0})
              </Text>
            </View>
          </View>

          <View style={[styles.row, { gap: wp(4) }]}>
            {/* Bed */}
            <View style={styles.row}>
              <Icon name="bed" color={theme.colors.darkGray} size={20} />
              <Text style={styles.darkGrayText}>{room?.beds || 0} giường</Text>
            </View>

            {/* Bath */}
            <View style={styles.row}>
              <Icon name="bath" color={theme.colors.darkGray} size={20} />
              <Text style={styles.darkGrayText}>
                {room?.baths || 0} nhà tắm
              </Text>
            </View>

            {/* Capacity */}
            <View style={styles.row}>
              <Icon name="multiUser" color={theme.colors.darkGray} size={20} />
              <Text style={styles.darkGrayText}>
                {room?.capacity || "Không rõ"} người
              </Text>
            </View>
          </View>

          {/* Amenities */}
          {room?.hotel?.hotel_amenities && (
            <FlatList
              data={room?.hotel?.hotel_amenities || []}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.row}>
                  <Icon
                    name="sparkles"
                    color={theme.colors.primary}
                    size={20}
                  />
                  <Text style={styles.amenityText}>
                    {item?.amenity?.name || "Không rõ"}
                  </Text>
                </View>
              )}
              style={styles.amenityContainer}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default RoomCard;

const styles = StyleSheet.create({
  cardContainer: {
    gap: 10,
    borderRadius: theme.radius.xxl * 1.1,
    borderCurve: "continuous",
    padding: 10,
    paddingVertical: 12,
    backgroundColor: theme.colors.white,
    borderWidth: 0.5,
    borderColor: theme.colors.gray,
    shadowColor: "#000",
  },

  roomImage: {
    height: hp(15),
    width: "100%",
    borderRadius: theme.radius.sm,
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
    fontSize: hp(2),
    fontWeight: theme.fonts.bold,
  },

  priceText: {
    color: theme.colors.primary,
    fontWeight: theme.fonts.extraBold,
  },

  darkGrayText: {
    color: theme.colors.darkGray,
  },

  amenityContainer: {
    paddingLeft: wp(2),
    paddingVertical: hp(1),
    borderLeftWidth: 0.6,
    borderColor: theme.colors.darkGray,
    marginLeft: wp(2),
  },

  amenityText: {
    color: theme.colors.darkGray,
  },
});
