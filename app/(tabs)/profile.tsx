import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useState } from "react";
import ScreenWarpper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import { hp, maskGmail, maskPhoneNumber, wp } from "@/helpers/common";
import Avatar from "@/components/Avatar";
import { useAuth } from "@/contexts/AuthContext";
import { theme } from "@/constants/theme";
import { useFocusEffect, useRouter } from "expo-router";
import Icon from "@/assets/icons";
import { SupaUser } from "@/services/userService";

const profile = () => {
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<SupaUser | null>(null);
  const router = useRouter();
  console.log('user: ', user);
  useFocusEffect(
    useCallback(() => {
      setUser(currentUser?.detail || null);
    }, [currentUser])
  );
  return (
    <ScreenWarpper>
      <View style={{ flex: 1, paddingHorizontal: wp(4) }}>
        <Header title="Trang Cá Nhân" />
        <View>
          <View style={{ gap: 15 }}>
            <View style={styles.avatarContainer}>
              <Avatar
                uri={user?.image}
                size={hp(12)}
                rounded={theme.radius.xxl * 1.4}
              />
              <Pressable
                style={styles.editIcon}
                onPress={() => router.push("/editProfile")}
              >
                <Icon name="edit" strokeWidth={2.5} size={20} />
              </Pressable>
            </View>

            <View style={{ alignItems: "center", gap: 4 }}>
              <Text style={styles.userName}>
                {user?.name || "Chưa cập nhật tên"}
              </Text>
              <Text>{user?.address || ""}</Text>
            </View>

            <View style={{ gap: 10 }}>
              <View style={styles.info}>
                <Icon name="mail" size={20} color={theme.colors.textLight} />
                <Text style={styles.infoText}>
                  {maskGmail(user?.email || "")}
                </Text>
              </View>
              {user?.phone && (
                <View style={styles.info}>
                  <Icon name="call" size={20} color={theme.colors.textLight} />
                  <Text style={styles.infoText}>
                    {maskPhoneNumber(user?.phone)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </ScreenWarpper>
  );
};

export default profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  headerContainer: {
    // marginHorizontal: wp(4),
    marginBottom: 20,
  },
  avatarContainer: {
    height: hp(12),
    width: hp(12),
    alignSelf: "center",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: -12,
    padding: 7,
    borderRadius: 50,
    backgroundColor: "white",
    shadowColor: theme.colors.textLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  userName: {
    fontSize: hp(3),
    fontWeight: theme.fonts.medium,
    color: theme.colors.textDark,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoText: {
    fontSize: hp(1.5),
    fontWeight: theme.fonts.medium,
    color: theme.colors.textLight,
  },
  logoutBtn: {
    position: "absolute",
    right: 0,
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.mistyRose,
  },
  listStyle: {
    paddingHorizontal: wp(4),
    paddingBottom: 30,
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: "center",
    color: theme.colors.text,
  },
});
