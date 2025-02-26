import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "@/assets/icons";
import { theme } from "@/constants/theme";
import { hp } from "@/helpers/common";

const Grid = ({ data }: { data: any[] }) => {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {data?.map((item, index) => (
          <View
            key={index}
            style={[
              styles.gridItem,
              item?.amenity?.name.length > 15 && { width: "100%" },
            ]}
          >
            <View style={styles.itemContainer}>
              <Icon name="sparkles" color={theme.colors.primary} size={22} />
              <Text style={styles.itemText}>
                {item?.amenity?.name || "Không rõ"}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "50%",
  },
  itemContainer: {
    flexDirection: "row",
    gap: 5,
    backgroundColor: theme.colors.lightGray2,
    margin: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.radius.md,
  },
  itemText: {
    color: theme.colors.darkGray,
    fontSize: hp(1.8),
  },
});

export default Grid;
