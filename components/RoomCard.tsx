import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Room } from "@/services/roomService";
import { theme } from "@/constants/theme";
import { formatVND, hp, wp } from "@/helpers/common";
import Icon from "@/assets/icons";

interface RoomCardProps {
  room: Room;
  isFavarite?: boolean;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, isFavarite = false }) => {
  return (
    <View
      style={{
        backgroundColor: theme.colors.lightGray2,
        paddingHorizontal: wp(4),
        paddingBottom: hp(2),
      }}
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
          <Text style={styles.hotelName}>{room.hotel.name}</Text>
          <Text style={styles.priceText}>{`${formatVND(
            room.price_per_night
          )}/đêm`}</Text>
        </View>

        {/* Location */}
        <View style={styles.row}>
          <Icon name="location" color={theme.colors.darkGray} size={20} />
          <Text style={styles.darkGrayText}>{room.hotel.location}</Text>
        </View>

        {/* Rating & Reviews */}
        <View style={styles.row}>
          <Icon name="star" color={theme.colors.darkGray} size={20} />
          <Text style={styles.darkGrayText}>{room.hotel.rating}</Text>
          <Text style={styles.darkGrayText}>({room.hotel.reviews.length})</Text>
        </View>

        {/* Capacity */}
        <View style={styles.row}>
          <Icon name="multiUser" color={theme.colors.darkGray} size={20} />
          <Text style={styles.darkGrayText}>{room.capacity} người/phòng</Text>
        </View>

        {/* Amenities */}
        <FlatList
          data={room.hotel.hotel_amenity}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Text style={styles.amenityText}>✨ {item.amenity.name}</Text>
          )}
          style={styles.amenityContainer}
        />
      </View>
    </View>
  );
};

export default RoomCard;

const styles = StyleSheet.create({
  cardContainer: {
    gap: 10,
    marginBottom: 15,
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
