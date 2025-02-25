import { getFilePath } from "@/helpers/common";
import { APIResponse } from "./userService";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import * as MediaLibrary from "expo-media-library";
import { Alert } from "react-native";
import { supabase } from "./supabaseService";

export const uploadFile = async (
  folderName: string,
  fileUri: string,
  isImage: boolean = true
): Promise<APIResponse> => {
  try {
    if(fileUri.includes("profiles")) {
      return {
        success: true,
        message: "File data is already uploaded on cloud",
        data: fileUri,
      };
    }

    let fileName = getFilePath(folderName, isImage);
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    let imageData = decode(fileBase64);

    let { data, error } = await supabase.storage
      .from("uploads")
      .upload(fileName, imageData, {
        cacheControl: "3600",
        upsert: false,
        contentType: isImage ? "image/*" : "video/*",
      });

    if (error) {
      // ❌ Error
      console.warn(`Error while uploading ${fileUri} | ${error.message}`);
      return {
        success: false,
        message: `Error while uploading ${fileUri} | ${error.message}`,
        data: null,
      };
    }

    // ✅ Success
    return {
      success: true,
      message: "File data uploading successfully",
      data: data?.path,
    };
  } catch (error) {
    // ❌ Error
    console.warn(`Image Service - Error while uploading file | ${error}`);
    return {
      success: false,
      message: `Error while uploading ${fileUri} | ${error}`,
      data: null,
    };
  }
};

export const getLocalFilePath = (filePath: string) => {
  let fileName = filePath.split("/").pop();
  return `${FileSystem.documentDirectory}${fileName}`;
};

export const downloadFile = async (url: string) => {
  try {
    const { uri } = await FileSystem.downloadAsync(url, getLocalFilePath(url));
    return uri;
  } catch (error) {
    return null;
  }
};

export const downloadFileAsync = async (fileUrl: string) => {
  try {
    console.log('Url',fileUrl)
    const { granted } = await MediaLibrary.requestPermissionsAsync();
    if (!granted) {
      Alert.alert("Permission Denied", "Please allow storage access.");
      return;
    }

    const { uri } = await FileSystem.downloadAsync(fileUrl, getLocalFilePath(fileUrl));

    await MediaLibrary.saveToLibraryAsync(uri);

    Alert.alert("Success", "File downloaded successfully!");
    return uri;
  } catch (error) {
    console.error("Download error:", error);
    Alert.alert("Error", "Failed to download the file.");
    return null;
  }
};
