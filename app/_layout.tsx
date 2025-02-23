import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppUser } from "@/hooks/authSlice";
import { store } from "@/hooks/store";
import { supabase } from "@/services/supabaseService";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { AppState } from "react-native";
import { Provider } from "react-redux";

const _layout = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </Provider>
  );
};

const MainLayout = () => {
  const router = useRouter();
  const { loginUser, logoutUser } = useAuth();

  AppState.addEventListener("change", (state) => {
    if (state === "active") {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      console.log(`Session -> userId: ${session?.user?.id}`);

      if (session) {
        loginUser(session?.user);
        router.replace("/home");
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
    </Stack>
  );
};

export default _layout;
