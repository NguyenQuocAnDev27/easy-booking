export const SUPABASE_FOLDER_NAME = {
  IMAGE: "postImages" as string,
  VIDEO: "postVideos" as string,
};

export const SUPABASE_URL: string = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
export const SUPABASE_KEY: string = process.env.EXPO_PUBLIC_SUPABASE_ANONKEY as string;