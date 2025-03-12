import {
  Alert,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getImageSource, hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import ScreenWarpper from "@/components/ScreenWrapper";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { getProvinces, Province } from "@/services/provinceService";
import Icon from "@/assets/icons";
import Input from "@/components/Input";
import { SupaUser, updateUser } from "@/services/userService";
import Button from "@/components/Button";
import Header from "@/components/Header";
import { uploadFile } from "@/services/fileSerive";
import { Image } from "expo-image";
import Loading from "@/components/Loading";
import useAsyncStorage, { KEYS_STORAGE } from "@/hooks/useAsyncStorage";

const SCREEN_NAME = "Trang Cá Nhân";

const editProfile = () => {
  const { user: currentUser, updateUser: updateUserData } = useAuth();
  const router = useRouter();
  const [isKeyboardShow, setIsKeyboardShow] = useState<boolean>(false);
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  // console.log(`Image: ${image?.uri}`);
  const [provinces, setProvinces] = useAsyncStorage<Province[]>(
    KEYS_STORAGE.PROVINCES,
    []
  );
  const [selectedProvince, setSelectedProvince] = useState<string | null>(
    currentUser?.detail?.address
      ? currentUser?.detail?.address.split(" - ")[0]
      : null
  );
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(
    currentUser?.detail?.address
      ? currentUser?.detail?.address.split(" - ")[1]
      : null
  );
  const [isOpenListProvince, setIsOpenListProvince] = useState<boolean>(false);
  const [isOpenListDistrict, setIsOpenListDistrict] = useState<boolean>(false);
  const [user, setUser] = useState<SupaUser | null | undefined>(
    currentUser?.detail
  );
  const [loading, setLoading] = useState<boolean>(false);

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.7,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];
      setImage(selectedImage);
      setUser((prev) => ({ ...prev, image: selectedImage.uri }));
    }
  };

  const onSubmit = async () => {
    let userData = { ...user };
    let { name, phone, address, image } = userData;

    if (selectedDistrict === null || selectedProvince === null) {
      Alert.alert(SCREEN_NAME, "Vui lòng chọn địa chỉ của bạn!");
      return;
    }

    if (!name || !phone || !address || !image) {
      Alert.alert(SCREEN_NAME, "Vui lòng điền các thông tin!");
      return;
    }

    setLoading(true);

    // 🔄️ Update image and get imagePath from supabase
    let imageRes = await uploadFile("profiles", image, true);
    if (imageRes.success) {
      userData.image = imageRes.data;
    } else {
      userData.image = null;
    }

    // 🔄️ Update user
    const newUserData = await updateUser(userData);
    console.log("Updating user -> Result:", newUserData);

    if (newUserData.success) {
      // ✅ Success work to-do
      updateUserData(newUserData.data);
      setUser(newUserData.data);
      router.back();
    } else {
      // ❌ Error work to-do
      Alert.alert("Profile", "Error while updating user");
      console.warn(
        `Edit Profile - Error while updating user | ${newUserData.message}`
      );
    }

    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  useEffect(() => {
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

  if (loading) {
    return (
      <ScreenWarpper color="white" autoDismissKeyboard={isKeyboardShow}>
        <View style={styles.container}>
          <Loading size="large" />
        </View>
      </ScreenWarpper>
    );
  }

  return (
    <ScreenWarpper color="white" autoDismissKeyboard={isKeyboardShow}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <Header title="Sửa thông tin" />

          {/* form */}
          <View style={styles.form}>
            <View style={styles.avatarContainer}>
              <Image
                source={image ? image.uri : getImageSource(user?.image)}
                style={styles.avatar}
              />
              <Pressable style={styles.camemraIcon} onPress={onPickImage}>
                <Icon name="camera" strokeWidth={2} size={20} />
              </Pressable>
            </View>

            <Text
              style={{
                fontSize: hp(1.5),
                color: theme.colors.text,
              }}
            >
              Hãy điền đầy đủ thông tin
            </Text>
            <Input
              icon={<Icon name="user" />}
              placeholder="Nhập họ tên"
              value={user?.name}
              onChangeText={(value) => {
                setUser((prev) => ({ ...prev, name: value }));
              }}
            />
            <Input
              icon={<Icon name="call" />}
              placeholder="Nhập số điện thoại"
              value={user?.phone || undefined}
              onChangeText={(value) => {
                setUser((prev) => ({ ...prev, phone: value }));
              }}
            />

            <View>
              <Text style={styles.label}>Chọn tỉnh/thành phố:</Text>
              <TouchableWithoutFeedback
                onPress={() => setIsOpenListProvince(true)}
              >
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedProvince}
                    onValueChange={(value) => {
                      setSelectedProvince(value);
                      setSelectedDistrict(null);
                      setIsOpenListProvince(false);
                    }}
                    style={styles.picker}
                  >
                    <Picker.Item
                      style={styles.pickerItem}
                      label={`Chọn tỉnh/thành phố`}
                      value={null}
                    />
                    {provinces?.map((province) => (
                      <Picker.Item
                        style={styles.pickerItem}
                        key={province.code}
                        label={province.name}
                        value={province.name}
                        color={
                          isOpenListProvince
                            ? selectedProvince === province.name
                              ? theme.colors.primary
                              : theme.colors.text
                            : theme.colors.text
                        }
                      />
                    ))}
                  </Picker>
                </View>
              </TouchableWithoutFeedback>

              {selectedProvince && (
                <>
                  <Text style={styles.label}>Chọn quận/huyện/thành phố:</Text>
                  <TouchableWithoutFeedback
                    onPress={() => setIsOpenListDistrict(true)}
                  >
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={selectedDistrict}
                        onValueChange={(value) => {
                          setSelectedDistrict(value);
                          setUser((prev) => ({
                            ...prev,
                            address: `${selectedProvince} - ${value}`,
                          }));
                          setIsOpenListDistrict(false);
                        }}
                        style={styles.picker}
                      >
                        <Picker.Item
                          style={styles.pickerItem}
                          label={`Chọn quận/huyện/thành phố`}
                          value={null}
                        />
                        {provinces
                          ?.find(
                            (province) => province.name === selectedProvince
                          )
                          ?.districts.map((district) => (
                            <Picker.Item
                              style={styles.pickerItem}
                              key={district.code}
                              label={district.name}
                              value={district.name}
                              color={
                                isOpenListDistrict
                                  ? selectedDistrict === district.name
                                    ? theme.colors.primary
                                    : theme.colors.text
                                  : theme.colors.text
                              }
                            />
                          ))}
                      </Picker>
                    </View>
                  </TouchableWithoutFeedback>
                </>
              )}
            </View>
            {/* submit */}
            <Button text="Cập nhật" onPress={onSubmit} />
            <View style={isKeyboardShow ? { height: hp(25) } : {}}></View>
          </View>
        </ScrollView>
      </View>
    </ScreenWarpper>
  );
};

export default editProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: hp(2),
    paddingHorizontal: wp(4),
  },
  avatarContainer: {
    height: hp(14),
    width: hp(14),
    alignSelf: "center",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: theme.radius.xxl * 1.8,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: theme.colors.darkLight,
  },
  camemraIcon: {
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
  form: {
    gap: 18,
    marginTop: 20,
  },
  input: {
    flexDirection: "row",
    borderWidth: 0.4,
    borderColor: theme.colors.text,
    borderRadius: theme.radius.xxl,
    borderCurve: "continuous",
    padding: 17,
    paddingHorizontal: 20,
    gap: 15,
  },
  bio: {
    flexDirection: "row",
    height: hp(15),
    alignItems: "flex-start",
    paddingVertical: 15,
  },
  label: {
    fontSize: hp(1.5),
    color: theme.colors.text,
    fontWeight: theme.fonts.medium,
    marginVertical: 10,
  },
  pickerContainer: {
    borderWidth: 0.4,
    borderColor: theme.colors.text,
    borderRadius: theme.radius.xxl,
    borderCurve: "continuous",
  },
  picker: { backgroundColor: "transparent" },
  pickerItem: {},
});
