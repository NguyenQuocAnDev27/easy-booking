import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Router, useFocusEffect } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import ScreenWarpper from "@/components/ScreenWrapper";
import Avatar from "@/components/Avatar";
import { theme } from "@/constants/theme";
import Icon from "@/assets/icons";
import { SupaUser } from "@/services/userService";
import { hp, maskGmail, maskPhoneNumber, wp } from "@/helpers/common";

// Profile
const Profile = () => {
  const { user: currentUser, logoutUser, clearPage, clearRooms } = useAuth();
  const [user, setUser] = useState<SupaUser | null>(null);
  const router = useRouter();
  useFocusEffect(
    useCallback(() => {
      setUser(currentUser?.detail || null);
    }, [currentUser])
  );

  return (
    <ScreenWarpper>
      <View style={styles.container}>
        <ProfileHeader
          handleLogout={() => {
            Alert.alert("Trang cá nhân", "Bạn đang đăng xuất đúng chứ?", [
              {
                text: "Không phải",
                onPress: () => {},
                style: "cancel",
              },
              {
                text: "Đúng vậy",
                onPress: () => router.push('/logout'),
                style: "destructive",
              },
            ]);
          }}
        />
        <AvatarSection user={user} router={router} />
        <UserInfo user={user} />
      </View>
    </ScreenWarpper>
  );
};

export default Profile;

// Profile Header
const ProfileHeader = ({ handleLogout }: { handleLogout: () => void }) => (
  <View style={styles.headerContainer}>
    <Text style={styles.headerText}>Trang Cá Nhân</Text>
    <View
      style={{
        position: "absolute",
        right: 0,
      }}
    >
      <TouchableOpacity onPress={handleLogout}>
        <View
          style={{
            backgroundColor: theme.colors.mistyRose,
            padding: 5,
            borderRadius: theme.radius.xxl * 99,
          }}
        >
          <Icon name="logout" color={theme.colors.rose} />
        </View>
      </TouchableOpacity>
    </View>
  </View>
);

// Avatar Section
const AvatarSection = ({
  user,
  router,
}: {
  user: SupaUser | null;
  router: Router;
}) => (
  <View style={styles.avatarContainer}>
    <Avatar uri={user?.image} size={hp(12)} rounded={theme.radius.xxl * 1.4} />
    <Pressable
      style={styles.editIcon}
      onPress={() => router.push("/editProfile")}
    >
      <Icon name="edit" strokeWidth={2.5} size={20} />
    </Pressable>
  </View>
);

// User Info
const UserInfo = ({ user }: { user: SupaUser | null }) => (
  <View style={styles.userInfoContainer}>
    <View style={styles.userInfoTextContainer}>
      <Text style={styles.userName}>{user?.name || "Chưa cập nhật tên"}</Text>
      <Text>{user?.address || ""}</Text>
    </View>

    <View style={styles.userDetails}>
      <UserDetail icon="mail" text={maskGmail(user?.email || "")} />
      {user?.phone && (
        <UserDetail icon="call" text={maskPhoneNumber(user?.phone)} />
      )}
    </View>
  </View>
);

// User Detail
const UserDetail = ({ icon, text }: { icon: any; text: string }) => (
  <View style={styles.info}>
    <Icon name={icon} size={20} color={theme.colors.textLight} />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: hp(2),
    paddingHorizontal: wp(4),
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    gap: 10,
    marginBottom: 10,
  },
  headerText: {
    fontSize: hp(2.7),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.textDark,
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
  userInfoContainer: {
    gap: 15,
  },
  userInfoTextContainer: {
    alignItems: "center",
    gap: 4,
  },
  userName: {
    fontSize: hp(3),
    fontWeight: theme.fonts.medium,
    color: theme.colors.textDark,
  },
  userDetails: {
    gap: 10,
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
});
