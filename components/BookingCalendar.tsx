import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  VirtualizedList,
} from "react-native";
import React, { useState } from "react";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Icon from "@/assets/icons";

interface BookingCalendarProps {
  checkInDate: Date | null;
  checkOutDate: Date | null;
}

interface DayItem {
  dayOfWeek: string;
  dayOfMonth: number;
  month: number;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  checkInDate,
  checkOutDate,
}) => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const daysOfWeek_Vi = ["CN", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy"];
  const months = [
    "Một",
    "Hai",
    "Ba",
    "Tư",
    "Năm",
    "Sáu",
    "Bảy",
    "Tám",
    "Chín",
    "Mười",
    "Mười Một",
    "Mười Hai",
  ];

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const showColor = () => {
    if (checkInDate === null || checkOutDate === null) return false;
    if (year > checkOutDate.getFullYear()) return true;
    return true;
  };

  // First and last day of the current month
  const firstDayOfMonth = new Date(year, currentMonth, 1);
  const lastDayOfMonth = new Date(year, currentMonth + 1, 0);

  // Calculate the previous month's last days
  const prevMonthLastDate = new Date(year, currentMonth, 0); // Last day of the previous month
  const prevMonthDays = prevMonthLastDate.getDate(); // Get the number of days in the previous month

  // Get the number of days in the current month
  const currentMonthDays = lastDayOfMonth.getDate();

  // Calculate the starting day of the month (day of the week)
  const firstDayOfWeek = firstDayOfMonth.getDay();

  // Prepare the days list (including previous and next month days)
  const daysList: DayItem[] = [];

  // Add previous month days to fill the start of the calendar
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayOfWeek = daysOfWeek[(i + 7) % 7]; // Wrap around to get the correct day of week
    daysList.push({
      dayOfWeek: dayOfWeek,
      dayOfMonth: prevMonthDays - i, // Get the last days of the previous month
      month: currentMonth - 1,
    });
  }

  // Add current month days
  for (let day = 1; day <= currentMonthDays; day++) {
    const currentDate = new Date(year, currentMonth, day);
    const dayOfWeek = daysOfWeek[currentDate.getDay()];
    daysList.push({
      dayOfWeek: dayOfWeek,
      dayOfMonth: day,
      month: currentMonth,
    });
  }

  // Calculate how many days we need to fill for the next month (based on the end of the current month)
  const remainingDaysInWeek = 7 - (daysList.length % 7);
  for (let day = 1; day <= remainingDaysInWeek; day++) {
    const currentDate = new Date(year, currentMonth + 1, day); // Start from the first day of the next month
    const dayOfWeek = daysOfWeek[currentDate.getDay()];
    daysList.push({
      dayOfWeek: dayOfWeek,
      dayOfMonth: day,
      month: currentMonth + 1,
    });
  }

  const getColorDay = (day: number, month: number) => {
    if (checkInDate === null) return "white";
    if (checkOutDate === null) return "white";

    const dayIn = checkInDate.getDate();
    const dayOut = checkOutDate.getDate();
    const monthIn = checkInDate.getMonth();
    const monthOut = checkOutDate.getMonth();
    const yearIn = checkInDate.getFullYear();
    const yearOut = checkOutDate.getFullYear();

    if (
      (day === dayIn && month === monthIn && year === yearIn) ||
      (day === dayOut && month === monthOut && year === yearOut)
    ) {
      return theme.colors.primaryDark;
    }

    if (
      day > dayIn &&
      month >= monthIn &&
      year === yearIn &&
      day < dayOut &&
      month <= monthOut &&
      year === yearOut
    ) {
      return theme.colors.primaryLight;
    }
    return "white";
  };

  const getTextColorDay = (day: number, month: number) => {
    if (checkInDate === null) return "black";
    if (checkOutDate === null) return "black";

    const dayIn = checkInDate.getDate();
    const dayOut = checkOutDate.getDate();
    const monthIn = checkInDate.getMonth();
    const monthOut = checkOutDate.getMonth();
    const yearIn = checkInDate.getFullYear();
    const yearOut = checkOutDate.getFullYear();

    // console.log(`${day * month * year} - ${dayIn * monthIn * yearIn}`)
    if (
      (day === dayIn && month === monthIn && year === yearIn) ||
      (day === dayOut && month === monthOut && year === yearOut)
    ) {
      return theme.colors.white;
    }

    if (
      day > dayIn &&
      month >= monthIn &&
      year === yearIn &&
      day < dayOut &&
      month <= monthOut &&
      year === yearOut
    ) {
      return theme.colors.darkGray;
    }

    if (month < currentMonth || month > currentMonth) return theme.colors.gray;

    return "black";
  };

  const getColorIconLeft = () => {
    if (checkInDate === null) return theme.colors.darkGray;
    const monthIn = checkInDate?.getMonth();
    const yearIn = checkInDate?.getFullYear();
    if (year > yearIn) return theme.colors.primary;
    if (currentMonth > monthIn) return theme.colors.primary;
    return theme.colors.darkGray;
  };

  return (
    <View
      style={{
        width: "100%",
        borderWidth: 1,
        borderColor: theme.colors.primary,
        borderRadius: theme.radius.sm,
        padding: wp(4),
      }}
    >
      <FlatList
        keyExtractor={(item) =>
          `${item.dayOfMonth.toString()}${item.month.toString()}`
        }
        numColumns={7}
        data={daysList}
        ListHeaderComponent={
          <View style={{ width: "100%" }}>
            <View
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: wp(4),
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                disabled={
                  getColorIconLeft() === theme.colors.darkGray ? true : false
                }
                onPress={() => {
                  setCurrentMonth((prev) => {
                    if (prev > 0) return prev - 1;
                    setYear((prevYear) => prevYear - 1);
                    return 0;
                  });
                }}
              >
                <View style={{ padding: 3 }}>
                  <Icon name="squareArrowDown" color={getColorIconLeft()} />
                </View>
              </TouchableOpacity>
              <Text
                style={{
                  fontWeight: theme.fonts.bold,
                  fontSize: hp(2.4),
                  color: theme.colors.darkGray,
                }}
              >
                Tháng {months[currentMonth]} {year}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setCurrentMonth((prev) => {
                    if (prev < 11) return prev + 1;
                    setYear((prevYear) => prevYear + 1);
                    return 0;
                  });
                }}
              >
                <View style={{ padding: 3 }}>
                  <Icon name="squareArrowUp" color={theme.colors.primary} />
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ width: "100%", flexDirection: "row" }}>
              {daysOfWeek_Vi.map((day) => (
                <View
                  key={day}
                  style={{
                    width: wp(100 - 16 - 14) / 7,
                    height: wp(100 - 16 - 14) / 7,
                    alignItems: "center",
                    justifyContent: "center",
                    marginVertical: wp(1),
                    marginHorizontal: wp(1),
                  }}
                >
                  <Text
                    style={{
                      color: theme.colors.darkGray,
                      fontSize: hp(2),
                    }}
                  >
                    {day}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={{
              width: wp(100 - 16 - 14) / 7,
              height: wp(100 - 16 - 14) / 7,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: showColor()
                ? getColorDay(item.dayOfMonth, item.month)
                : "white",
              marginVertical: wp(1),
              marginHorizontal: wp(1),
              borderRadius: theme.radius.xxl * 99,
            }}
          >
            <Text
              style={{
                color: getTextColorDay(item.dayOfMonth, item.month),
                fontSize: hp(2),
              }}
            >
              {item.dayOfMonth}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default BookingCalendar;
