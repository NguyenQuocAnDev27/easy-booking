import BottomNavigator from "@/components/BottomNavigator";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { NavigatorProvider } from "@/contexts/NavigatorContext";
import { AppUser } from "@/hooks/authSlice";
import { store } from "@/hooks/store";
import { supabase } from "@/services/supabaseService";
import { getUserData } from "@/services/userService";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert, AppState } from "react-native";
import { Provider } from "react-redux";
import {
  getAddressFromCoordinates,
  NominatimAPIResponse,
} from "@/services/locationService";

const _layout = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <NavigatorProvider>
          <MainLayout />
        </NavigatorProvider>
      </AuthProvider>
    </Provider>
  );
};

const MainLayout = () => {
  const router = useRouter();
  const {
    user,
    loginUser,
    logoutUser,
    updateUser,
    updateNowLocation,
    clearPage,
  } = useAuth();

  AppState.addEventListener("change", (state) => {
    if (state === "active") {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });

  const updatingUserInfo = async (userId: string) => {
    let res = await getUserData(userId);
    if (res.success) {
      updateUser(res.data);
    } else {
      Alert.alert("Login", "You are not authenticated!");
      router.push("/login");
    }
  };

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        loginUser(session?.user);
        updatingUserInfo(session?.user.id);
        router.replace("/waiting");
      } else {
        logoutUser();
        router.replace("/welcome");
      }
    });
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signUp" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="booking" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="waiting" />
      <Stack.Screen name="editProfile" />
      <Stack.Screen name="roomDetail" />
      <Stack.Screen name="logout" />
    </Stack>
  );
};

export default _layout;
