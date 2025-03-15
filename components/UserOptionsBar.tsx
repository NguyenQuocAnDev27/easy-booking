import {
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import GIFs from "@/assets/animations";
import { Image as ExpoImage } from "expo-image";

const UserOptionsBar = ({ loading = false }: { loading: boolean }) => {
  const options: { id: string; name: string; uri: string }[] = [
    {
      id: "Option_0",
      name: "Núi",
      uri: require("../assets/images/Mountain.png"),
    },
    {
      id: "Option_1",
      name: "Biển",
      uri: require("../assets/images/Beach.png"),
    },
    {
      id: "Option_",
      name: "Sang Trọng",
      uri: require("../assets/images/Design.png"),
    },
    {
      id: "Option_3",
      name: "Đảo",
      uri: require("../assets/images/Island.png"),
    },
  ];

  const loadingWidth = 170;
  const loadingHeight = 66;

  const newLoadingWidth = 80;
  const newLoadingHeight = newLoadingWidth / (loadingWidth / loadingHeight);

  return (
    <View
      style={{
        width: "100%",
        backgroundColor: "white",
        borderCurve: "continuous",
        borderRadius: theme.radius.lg,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          padding: hp(2),
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: hp(2.2), fontWeight: theme.fonts.extraBold }}>
          Tiêu chí
        </Text>
        <Pressable>
          <Text
            style={{
              color: theme.colors.primary,
              fontWeight: theme.fonts.bold,
              fontSize: hp(2.2),
            }}
          >
            Xem tất cả
          </Text>
        </Pressable>
      </View>
      {loading ? (
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            padding: hp(2),
          }}
        >
          <ExpoImage
            source={GIFs.loading_flow}
            style={{ width: newLoadingWidth, height: newLoadingHeight }}
            contentFit="cover"
            transition={1000}
          />
        </View>
      ) : (
        <ScrollView
          style={{ width: "100%", paddingHorizontal: 5, paddingBottom: 10 }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          {options.map((option) => (
            <OptionItem
              key={option.id}
              title={option.name}
              uri={option.uri as ImageSourcePropType}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

interface OptionItemProps {
  title: string;
  uri: ImageSourcePropType;
}

const OptionItem: React.FC<OptionItemProps> = ({ title = "", uri }) => {
  return (
    <View style={{ gap: 10, marginHorizontal: 5 }}>
      <Image
        source={uri}
        style={{ width: wp(30), height: hp(20), borderRadius: theme.radius.md }}
      />
      <Text
        style={{
          fontSize: hp(1.8),
          textAlign: "center",
          fontWeight: theme.fonts.medium,
          color: theme.colors.darkGray,
        }}
      >
        {title}
      </Text>
    </View>
  );
};

export default UserOptionsBar;

const styles = StyleSheet.create({});
