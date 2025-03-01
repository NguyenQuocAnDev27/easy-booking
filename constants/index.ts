export const SUPABASE_FOLDER_NAME = {
  IMAGE: "postImages" as string,
  VIDEO: "postVideos" as string,
};

export const SUPABASE_URL: string = process.env
  .EXPO_PUBLIC_SUPABASE_URL as string;
export const SUPABASE_KEY: string = process.env
  .EXPO_PUBLIC_SUPABASE_ANONKEY as string;

export const STATUS_BOOKING_TICKET = {
  IN_PROCESS: "IN_PROCESS",
  COMPLETED: "COMPLETED",
};

export const STATUS_CHECK_IN_OUT = {
  NOT_CHECK_IN: "NOT_CHECK_IN",
  CHECK_IN: "CHECK_IN",
  CHECK_OUT: "CHECK_OUT",
};
