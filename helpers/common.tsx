import { SUPABASE_URL } from "@/constants";
import moment from "moment";
import "moment/locale/vi";
import { Dimensions } from "react-native";

export const { width: deviceWidth, height: deviceHeight } =
  Dimensions.get("window");

export const hp = (percentage: number) => {
  return (percentage * deviceHeight) / 100;
};

export const wp = (percentage: number) => {
  return (percentage * deviceWidth) / 100;
};

export const getImageSource = (uri: string | undefined | null) => {
  if (uri === undefined || uri === null) {
    const defaultUserImage = require("../assets/images/defaultUser.png");
    return defaultUserImage;
  }
  return getSupabaseFileUrl(uri)?.uri;
};

export const getSupabaseFileUrl = (filePath: string) => {
  // console.log(`FilePath: ${filePath}`)
  if (filePath) {
    return {
      uri: `${SUPABASE_URL}/storage/v1/object/public/uploads/${filePath}`,
    };
  }
  return null;
};

export const getFilePath = (folderName: string, isImage: boolean) => {
  return `/${folderName}/${new Date().getTime()}${isImage ? ".png" : ".mp4"}`;
};

export const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/gm, "");
};

export const getFormattedDate = (date: string): string => {
  moment.locale("vi");
  return moment(date).format("D MMMM");
};

export const maskGmail = (email: string): string => {
  if (!email.includes("@gmail.com")) return "";

  const username = email.replace("@gmail.com", "");

  if(username.length < 6) return "";

  if (username.length <= 8 && username.length >= 6) {
    const firstPart = username.slice(0, 2);
    const lastPart = username.slice(-2);
    const middleMask = "*".repeat(username.length - 4);

    return `${firstPart}${middleMask}${lastPart}@gmail.com`;
  }

  const firstPart = username.slice(0, 4);
  const lastPart = username.slice(-4);
  const middleMask = "*".repeat(username.length - 8);

  return `${firstPart}${middleMask}${lastPart}@gmail.com`;
};

export const maskPhoneNumber = (phoneNumber: string): string => {
  if (phoneNumber.length < 6) return "";

  const firstPart = phoneNumber.slice(0, 2);
  const lastPart = phoneNumber.slice(-4);
  const middleMask = "*".repeat(phoneNumber.length - 6);

  return `${firstPart}${middleMask}${lastPart}`;
};

export const formatVND = (amount: number): string => {
  if (isNaN(amount)) return "0 VND";

  return amount
    .toLocaleString("vi-VN") 
    .replace(/,/g, ".")
    + " VND";
};

export const capitalizeText = (text: string): string => {
  if (!text) return "";
  return text
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
