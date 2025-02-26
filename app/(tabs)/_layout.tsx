import { Stack, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import Icon from "@/assets/icons";
import { hp } from "@/helpers/common";
import TabBarItem from "@/components/TabBarItem";
import { NavigatorProvider, useNavigator } from "@/contexts/NavigatorContext";
import BottomNavigator from "@/components/BottomNavigator";
import { useEffect, useRef } from "react";

export default function _layout() {
  const { currentPosition } = useNavigator();
  const prevPosition = useRef(currentPosition);

  const getTransition = () => {
    return prevPosition.current < currentPosition
      ? "slide_from_right"
      : "slide_from_left";
  };

  useEffect(() => {
    prevPosition.current = currentPosition;
  }, [currentPosition]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false, animation: getTransition() }}>
        <Stack.Screen name="checkRoom" />
        <Stack.Screen name="favorite" />
        <Stack.Screen name="home" />
        <Stack.Screen name="profile" />
      </Stack>
      <BottomNavigator />
    </>
  );
}

// export default function TabLayout() {
//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: theme.colors.primary,
//         tabBarStyle: { backgroundColor: "white", height: hp(7) },
//         headerShown: false,
//       }}
//     >
//       <Tabs.Screen
//         name="home"
//         options={{
//           title: "",
//           tabBarIcon: ({ color, focused }) => (
//             <TabBarItem focused={focused}>
//               <Icon name="home" size={hp(3.5)} color={color} />
//             </TabBarItem>
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="favorite"
//         options={{
//           title: "",
//           tabBarIcon: ({ color, focused }) => (
//             <TabBarItem focused={focused}>
//               <Icon name="heart" size={hp(3.5)} color={color} />
//             </TabBarItem>
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="checkRoom"
//         options={{
//           title: "",
//           tabBarIcon: ({ color, focused }) => (
//             <TabBarItem focused={focused}>
//               <Icon name="calendar" size={hp(3.5)} color={color} />
//             </TabBarItem>
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: "",
//           tabBarIcon: ({ color, focused }) => (
//             <TabBarItem focused={focused}>
//               <Icon name="user" size={hp(3.5)} color={color} />
//             </TabBarItem>
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }
